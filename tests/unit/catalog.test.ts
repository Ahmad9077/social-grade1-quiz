import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  AMIR,
  CHEERS,
  DEEDS,
  FEATS,
  FLAG_COLOURS,
  QUESTIONS,
  QUIZ_ID,
  RETRIES,
  TOPICS,
  audioCues,
  clip,
  roundClips,
  type DeedId,
  type FeatId,
  type Question,
} from '../../src/data/catalog'
import { PRACTICE_SIZE, TEST_PLAN } from '../../src/domain/round'

const DIACRITICS = /[ً-ْٰ]/
const byKey = (key: string) => QUESTIONS.find((q) => q.key === key)!
const right = (q: Question) => q.options.find((o) => o.id === q.answer)!

describe('question bank', () => {
  it('uses the permanent quiz id', () => {
    expect(QUIZ_ID).toBe('social-grade1')
  })

  it('keeps every published question key', () => {
    const keys = new Set(QUESTIONS.map((q) => q.key))
    const permanent = fs.readFileSync('integration/seed-social-grade1.sql', 'utf8').match(/'[a-z]+:[a-z0-9-]+'/g) ?? []
    expect(permanent.length).toBe(QUESTIONS.length)
    for (const key of permanent) expect(keys.has(key.slice(1, -1)), key).toBe(true)
  })

  it('has unique, well-formed permanent keys', () => {
    const keys = QUESTIONS.map((q) => q.key)
    expect(new Set(keys).size).toBe(keys.length)
    for (const q of QUESTIONS) expect(q.key).toMatch(new RegExp(`^${q.topic}:[a-z0-9-]+$`))
  })

  it('has a big enough bank for fresh rounds in every lesson', () => {
    expect(TOPICS.map((t) => t.id)).toEqual(['amir', 'home', 'flag'])
    for (const topic of TOPICS) {
      const count = QUESTIONS.filter((q) => q.topic === topic.id).length
      expect(count, topic.id).toBeGreaterThanOrEqual(PRACTICE_SIZE + 4)
      expect(count, topic.id).toBeGreaterThanOrEqual(3 * TEST_PLAN[topic.id])
    }
  })

  it('gives every choice question one right answer among two to four distinct options', () => {
    for (const q of QUESTIONS.filter((entry) => entry.kind === 'pick')) {
      const ids = q.options.map((o) => o.id)
      expect(new Set(ids).size, q.key).toBe(ids.length)
      expect(ids, q.key).toContain(q.answer)
      expect(q.options.length, q.key).toBeGreaterThanOrEqual(2)
      expect(q.options.length, q.key).toBeLessThanOrEqual(4)
    }
  })

  it('never offers a right answer among the wrong ones of a drawn question', () => {
    for (const q of QUESTIONS.filter((entry) => entry.draw)) {
      const rightIds = new Set(q.draw!.right.map((o) => o.id))
      if (rightIds.size > 1) for (const option of q.draw!.wrong) expect(rightIds.has(option.id), `${q.key} ${option.id}`).toBe(false)
      expect(q.draw!.wrong.length, q.key).toBeGreaterThanOrEqual(q.draw!.count)
    }
  })

  it('asks choice questions only: no matching boards unless the school asks for them', () => {
    expect(QUESTIONS.filter((q) => q.kind === 'match')).toEqual([])
  })

  it('has a picture for every portrait', () => {
    const photos = new Set(QUESTIONS.flatMap((q) => [q.subject ?? '', ...q.options.map((o) => o.art)]).filter((art) => art.startsWith('photo:')))
    expect(photos.size).toBe(2)
    for (const art of photos) expect(fs.existsSync(`public/photos/${art.slice(6)}.jpg`), art).toBe(true)
  })

  it('has adaptive difficulty in the Hub range with skill tags', () => {
    for (const q of QUESTIONS) {
      expect(q.difficulty).toBeGreaterThanOrEqual(1)
      expect(q.difficulty).toBeLessThanOrEqual(100)
      expect(q.skills[0], q.key).toBe(q.topic)
      expect(q.skills.length, q.key).toBeGreaterThan(1)
    }
  })
})

describe('the book «وطني ١», pages 27 to 41', () => {
  it('knows the Amir: his portrait and his name', () => {
    expect(right(byKey('amir:portrait')).art).toBe('photo:amir')
    expect(right(byKey('amir:who')).label).toBe('أمير الكويت')
    expect(right(byKey('amir:first-name')).label).toBe('مشعل')
    expect(AMIR.name).toBe('الشيخ مشعل الأحمد الصباح')
  })

  it("stars the Amir's achievements, never the Kuwait Towers", () => {
    for (const feat of ['university', 'hospital', 'gulfcup', 'refinery'] as FeatId[]) {
      expect(FEATS[feat].name.length).toBeGreaterThan(0)
      expect(byKey(`amir:feat-pick-${feat}`).answer).toBe(`f-${feat}`)
    }
    expect(byKey('amir:say-towers').answer).toBe('no')
  })

  it('matches each service of the area with its use', () => {
    const use: Record<string, string> = { school: 'نتعلم', mosque: 'نصلي', park: 'نلعب', clinic: 'مرضنا', coop: 'نشتري', police: 'الشرطة', houses: 'نسكن' }
    for (const [place, word] of Object.entries(use)) {
      const q = byKey(`home:where-${place}`)
      expect(q.answer).toBe(`p-${place}`)
      expect(q.prompt, q.key).toContain(word)
    }
  })

  it('judges behaviour as the book does: helping and studying are right, troubling a neighbour and wasting water are wrong', () => {
    expect(DEEDS['help-neighbour'].good && DEEDS.study.good && DEEDS['clean-area'].good).toBe(true)
    expect(DEEDS['annoy-neighbour'].good || DEEDS['running-tap'].good).toBe(false)
    for (const id of Object.keys(DEEDS) as DeedId[]) expect(byKey(`home:deed-${id}`).answer).toBe(DEEDS[id].good ? 'yes' : 'no')
    for (const q of QUESTIONS.filter((entry) => /^home:(good|bad)-/.test(entry.key))) {
      const good = q.key.startsWith('home:good')
      for (const option of q.draw!.right) expect(DEEDS[option.id.slice(2) as DeedId].good, `${q.key} ${option.id}`).toBe(good)
      for (const option of q.draw!.wrong) expect(DEEDS[option.id.slice(2) as DeedId].good, `${q.key} ${option.id}`).toBe(!good)
    }
  })

  it('knows the flag: four colours, green on top, white, red, black by the pole', () => {
    expect(FLAG_COLOURS).toEqual(['green', 'white', 'red', 'black'])
    expect(right(byKey('flag:colour-count')).label).toBe('٤')
    expect(right(byKey('flag:colour-set')).art).toBe('swatches:green,white,red,black')
    for (const colour of FLAG_COLOURS) expect(byKey(`flag:missing-${colour}`).answer).toBe(`s-${colour}`)
    const flags = byKey('flag:right-colours').draw!
    expect(flags.right.map((o) => o.art)).toEqual(['flagx:green,white,red,black'])
    for (const option of flags.wrong) expect(option.art).not.toBe('flagx:green,white,red,black')
    const colours = byKey('flag:colour-in').draw!
    for (const option of colours.right) expect(FLAG_COLOURS).toContain(option.id.slice(2))
    for (const option of colours.wrong) expect(FLAG_COLOURS).not.toContain(option.id.slice(2))
  })

  it('finds Kuwait among the Gulf flags', () => {
    for (const key of ['flag:which-flag-3', 'flag:which-flag-4', 'flag:which-kid-3', 'flag:which-kid-4']) {
      const q = byKey(key)
      expect(q.draw!.right.map((o) => o.art)).toEqual([key.includes('kid') ? 'kid:kw' : 'flag:kw'])
      expect(q.draw!.wrong.some((o) => o.art.endsWith(':kw')), key).toBe(false)
    }
  })
})

describe('made for a child of five or six', () => {
  const words = (text: string) => text.split(/\s+/).filter(Boolean).length

  it('asks short questions with short answers', () => {
    for (const q of QUESTIONS) {
      expect(words(q.prompt), q.key).toBeLessThanOrEqual(5)
      for (const option of q.options) expect(words(option.label), `${q.key} ${option.id}`).toBeLessThanOrEqual(4)
      if (q.subject?.startsWith('say:')) expect(words(q.subject.slice(4)), q.key).toBeLessThanOrEqual(7)
    }
  })

  it('never asks what is not («ليس») and leaves out abstract ideas', () => {
    const hard = /(?<![\u0600-\u06FF])(ليس|ليست|المجال|الحاكم|قيمة|رمز|استقلال|الاقتصادي|المحافل)(?![\u0600-\u06FF])/
    for (const q of QUESTIONS) {
      expect(q.prompt, q.key).not.toMatch(hard)
      for (const option of q.options) expect(option.label, q.key).not.toMatch(hard)
      expect(q.subject ?? '', q.key).not.toMatch(hard)
    }
  })

  it('keeps explanations to a short line or two', () => {
    for (const q of QUESTIONS) for (const way of q.explain) expect(words(way.text), q.key).toBeLessThanOrEqual(16)
  })
})

describe('screen text', () => {
  it('shows no diacritics', () => {
    for (const q of QUESTIONS) {
      expect(q.prompt, q.key).not.toMatch(DIACRITICS)
      for (const way of q.explain) expect(way.text, q.key).not.toMatch(DIACRITICS)
      for (const option of q.options) expect(option.label, q.key).not.toMatch(DIACRITICS)
    }
    for (const topic of TOPICS) expect(topic.title, topic.id).not.toMatch(DIACRITICS)
  })

  it('never glues «و» to a number, where «و١» would read as «وا»', () => {
    for (const q of QUESTIONS) for (const way of q.explain) expect(way.text, q.key).not.toMatch(/و[٠-٩]/)
  })

  it('speaks to every child the same way (no girl- or boy-only words)', () => {
    const words = ['أحسنتي', 'شطورة', 'بطلة', 'عليج', 'إنتي', 'أنتي', 'اختاري', 'شطور', 'بطل', 'عليك', 'اختار', 'اسمع', 'حاول', 'تبي', 'اختر', 'عد', 'عدي', 'حوط', 'حوطي', 'اكتب', 'اكتبي']
    const gendered = new RegExp(`(?<![\\u0600-\\u06FF])(${words.join('|')})(?![\\u0600-\\u06FF])`)
    for (const cue of audioCues()) expect(cue.text, cue.id).not.toMatch(gendered)
    for (const q of QUESTIONS) expect(q.prompt, q.key).not.toMatch(gendered)
    for (const cheer of CHEERS) expect(cheer.text).not.toMatch(gendered)
  })
})

describe('narration', () => {
  const manifest = JSON.parse(fs.readFileSync('public/audio/manifest.json', 'utf8')) as {
    voices: Record<string, { name: string }>
    clips: Record<string, { text: string; hash: string }>
  }

  it('uses Maryam, the Kuwaiti voice, without diacritics', () => {
    expect(Object.keys(manifest.voices)).toEqual(['ar'])
    expect(manifest.voices.ar!.name).toBe('Maryam Essa - Kuwaiti Calm & Warm')
    for (const cue of audioCues()) expect(cue.text, cue.id).not.toMatch(DIACRITICS)
  })

  it('has a recorded clip for every cue, and no unused clips', () => {
    const cues = audioCues()
    for (const cue of cues) {
      expect(manifest.clips[cue.id]?.text, cue.id).toBe(cue.text)
      expect(manifest.clips[cue.id]?.hash, cue.id).toMatch(/^[0-9a-f]{16}$/)
      expect(fs.existsSync(`public/audio/${cue.id}.mp3`), cue.id).toBe(true)
    }
    expect(Object.keys(manifest.clips).sort()).toEqual(cues.map((cue) => cue.id).sort())
  })

  it('records nothing new: no spoken question, only the shared phrases', () => {
    for (const q of QUESTIONS) expect(q.ask, q.key).toEqual([])
    expect(audioCues()).toHaveLength(23)
    expect(fs.existsSync('scripts/generate-audio.py')).toBe(false)
  })

  it('has a recording for every clip a round can play', () => {
    const recorded = new Set(audioCues().map((cue) => cue.id))
    for (const id of roundClips(QUESTIONS)) expect(recorded.has(id), id).toBe(true)
    expect(recorded.has(clip.ui('test-intro'))).toBe(true)
  })

  it('has many cheers and kind words', () => {
    expect(CHEERS.length).toBeGreaterThanOrEqual(10)
    expect(RETRIES.length).toBeGreaterThanOrEqual(5)
  })
})
