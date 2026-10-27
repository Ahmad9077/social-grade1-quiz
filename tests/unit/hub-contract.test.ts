import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import { QUESTIONS } from '../../src/data/catalog'
import { bootstrapQuiz } from '../../src/hub/bootstrap'
import { HubBridge, levelFor, type Attempt } from '../../src/hub/bridge'
import type { HubWindow } from '../../src/hub/contracts'

const attempts: Attempt[] = [
  { questionKey: 'flag:missing-red', chosen: 'initial', correct: true },
  { questionKey: 'home:where-coop', chosen: 'letter:0', correct: false },
]
const info = { kind: 'practice' as const, topic: 'flag', difficulty: 'medium' as const }

describe('hub contract', () => {
  it('does not touch the Hub in preview mode', async () => {
    const context = await bootstrapQuiz('preview', {} as Window, {} as Document)
    expect(context).toEqual({ mode: 'preview', source: 'preview', difficulty: 'medium', preferredKeys: [] })
    const record = vi.fn()
    const bridge = new HubBridge('preview', { QuizzesHubProgress: { record } } as HubWindow)
    expect(await bridge.reportRound(attempts, info)).toBe('none')
    expect(record).not.toHaveBeenCalled()
  })

  it('reports per-question attempts through the adaptive client', async () => {
    const recordAttempt = vi.fn().mockResolvedValue({ ok: true })
    const record = vi.fn()
    const bridge = new HubBridge('production-hub', { QuizzesHubAdaptive: { recordAttempt }, QuizzesHubProgress: { record } })
    expect(await bridge.reportRound(attempts, info)).toBe('adaptive')
    expect(recordAttempt).toHaveBeenCalledWith([
      { question: { key: 'flag:missing-red' }, correct: true },
      { question: { key: 'home:where-coop' }, correct: false },
    ])
    expect(record).not.toHaveBeenCalled()
  })

  it('falls back to aggregate progress once', async () => {
    const recordAttempt = vi.fn().mockResolvedValue({ ok: false })
    const record = vi.fn().mockResolvedValue({ ok: true })
    const bridge = new HubBridge('production-hub', { QuizzesHubAdaptive: { recordAttempt }, QuizzesHubProgress: { record } })
    expect(await bridge.reportRound(attempts, info)).toBe('progress')
    expect(record).toHaveBeenCalledTimes(1)
    expect(record.mock.calls[0]![0]).toMatchObject({ quizId: 'social-grade1', score: 1, total: 2, level: 'Practice' })
  })

  it('grades levels like the other Hub quizzes', () => {
    expect(levelFor(8, 8)).toBe('A+')
    expect(levelFor(7, 8)).toBe('A')
    expect(levelFor(5, 8)).toBe('Practice')
  })

  it('ships a seed that registers the quiz and profiles but no assignments', () => {
    execFileSync('node', ['scripts/generate-hub-seed.ts', '--check'])
    const sql = fs.readFileSync('integration/seed-social-grade1.sql', 'utf8')
    expect(sql).toContain("'social-grade1',\n  'الاجتماعيات - الأول الابتدائي',\n  'https://ahmad9077.github.io/social-grade1-quiz/'")
    expect(sql).not.toMatch(/insert into public\.quiz_assignments/i)
    for (const question of QUESTIONS) expect(sql).toContain(`('social-grade1', '${question.key}'`)
  })

  it('keeps the manifest id and production path in step with the code', () => {
    const manifest = JSON.parse(fs.readFileSync('public/quiz-manifest.json', 'utf8'))
    expect(manifest.quizId).toBe('social-grade1')
    expect(manifest.basePath).toBe('/social-grade1-quiz/')
    expect(fs.readFileSync('vite.config.ts', 'utf8')).toContain("'/social-grade1-quiz/'")
  })
})
