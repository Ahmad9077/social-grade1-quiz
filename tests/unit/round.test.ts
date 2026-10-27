import { describe, expect, it } from 'vitest'
import { QUESTIONS, dressQuestion } from '../../src/data/catalog'
import { PRACTICE_SIZE, TEST_PLAN, TEST_SIZE, arrangeOptions, buildPractice, buildTest, orderQuestions, starsFor } from '../../src/domain/round'

function seeded(seed: number) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return value / 2147483647
  }
}

const question = (key: string) => QUESTIONS.find((q) => q.key === key)!

describe('rounds', () => {
  it('builds a practice round from one lesson without repeats', () => {
    const round = buildPractice('flag', [], [], seeded(3))
    expect(round).toHaveLength(PRACTICE_SIZE)
    expect(new Set(round.map((q) => q.key)).size).toBe(PRACTICE_SIZE)
    expect(round.every((q) => q.topic === 'flag')).toBe(true)
  })

  it('builds the twelve-question mock test from every lesson', () => {
    const round = buildTest([], [], seeded(7))
    expect(round).toHaveLength(TEST_SIZE)
    expect(TEST_SIZE).toBe(12)
    for (const [topic, count] of Object.entries(TEST_PLAN)) expect(round.filter((q) => q.topic === topic)).toHaveLength(count)
  })

  it('puts Hub-selected questions first, then unseen ones', () => {
    const pool = QUESTIONS.filter((q) => q.topic === 'home')
    const preferred = [pool[5]!.key, pool[2]!.key]
    const recent = pool.slice(0, 8).map((q) => q.key)
    const ordered = orderQuestions(pool, preferred, recent, seeded(1))
    expect(ordered.slice(0, 2).map((q) => q.key)).toEqual(preferred)
    expect(recent).not.toContain(ordered[2]!.key)
  })

  it('changes from one attempt to the next: other questions, other answers to choose from', () => {
    const first = buildTest([], [], seeded(11))
    const second = buildTest([], first.map((q) => q.key), seeded(12))
    expect(second.filter((q) => first.some((other) => other.key === q.key)).length).toBeLessThanOrEqual(1)

    const flags = new Set(Array.from({ length: 8 }, (_, n) => dressQuestion(question('flag:which-flag-3'), seeded(n * 99991 + 7)).options.map((o) => o.id).sort().join()))
    expect(flags.size).toBeGreaterThan(2)
    const rights = new Set(Array.from({ length: 8 }, (_, n) => dressQuestion(question('home:good-a'), seeded(n * 99991 + 11)).answer))
    expect(rights.size).toBeGreaterThan(2)
  })

  it('draws a fresh question that still has exactly one right answer', () => {
    for (const q of QUESTIONS.filter((entry) => entry.draw)) {
      for (let n = 0; n < 6; n += 1) {
        const dressed = dressQuestion(q, seeded(n * 99991 + 13))
        const ids = dressed.options.map((o) => o.id)
        expect(new Set(ids).size, q.key).toBe(ids.length)
        expect(ids, q.key).toContain(dressed.answer)
        expect(q.draw!.right.map((o) => o.id), q.key).toContain(dressed.answer)
        for (const id of ids.filter((id) => id !== dressed.answer)) expect(q.draw!.wrong.map((o) => o.id), q.key).toContain(id)
        expect(dressed.explain.length, q.key).toBeGreaterThan(0)
      }
    }
  })

  it('keeps «صح» before «خطأ»', () => {
    expect(arrangeOptions(question('flag:say-four'), seeded(4)).map((o) => o.id)).toEqual(['yes', 'no'])
    expect(arrangeOptions(question('home:deed-litter'), seeded(5)).map((o) => o.id)).toEqual(['yes', 'no'])
  })

  it('shuffles the choices of every other pick question', () => {
    const moved = QUESTIONS.filter((q) => q.kind === 'pick' && !q.fixedOrder).some(
      (q) => arrangeOptions(q, seeded(9)).map((o) => o.id).join() !== q.options.map((o) => o.id).join(),
    )
    expect(moved).toBe(true)
  })

  it('awards stars generously for young learners', () => {
    expect(starsFor(8, 8)).toBe(3)
    expect(starsFor(5, 8)).toBe(2)
    expect(starsFor(2, 8)).toBe(1)
    expect(starsFor(0, 0)).toBe(1)
  })
})
