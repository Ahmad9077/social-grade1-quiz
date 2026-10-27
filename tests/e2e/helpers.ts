import { expect, type Page } from '@playwright/test'
import { QUESTIONS, type Question } from '../../src/data/catalog'

export async function start(page: Page, path = '/') {
  await page.goto(path)
  await page.getByRole('button', { name: /هيا نبدأ/ }).click()
  await expect(page.locator('.home')).toBeVisible()
}

const lastKey = new WeakMap<Page, string>()

/** Answers the visible question; `correct` picks the right answer (or makes one mistake on a board). */
export async function answer(page: Page, correct: boolean): Promise<Question> {
  // The previous question animates out before the next one mounts.
  const previous = lastKey.get(page)
  const section = previous
    ? page.locator(`section.question:not([data-question-key="${previous}"])`)
    : page.locator('section.question')
  await expect(section).toHaveCount(1)
  await expect(page.locator('section.question')).toHaveCount(1)
  const key = await section.getAttribute('data-question-key')
  if (key) lastKey.set(page, key)
  const question = QUESTIONS.find((q) => q.key === key)
  if (!question) throw new Error(`Unknown question on screen: ${key}`)

  if (question.kind === 'match') {
    const [first, second] = question.pairs
    if (!correct) {
      await section.locator(`.match-first[data-pair="${first!.id}"]`).click()
      await section.locator(`.match-second[data-pair="${second!.id}"]`).click()
      await expect(section.locator('.match-item.shake')).toHaveCount(2)
    }
    for (const pair of question.pairs) {
      await section.locator(`.match-first[data-pair="${pair.id}"]`).click()
      await section.locator(`.match-second[data-pair="${pair.id}"]`).click()
    }
    await expect(section.locator('.match-line')).toHaveCount(question.pairs.length)
  } else {
    // Drawn questions get new answers every round: read the choices on screen.
    const shown = await section.locator('.option').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-option') ?? ''))
    const rightIds = new Set(question.draw ? question.draw.right.map((o) => o.id) : [question.answer])
    const id = correct ? shown.find((option) => rightIds.has(option)) : shown.find((option) => !rightIds.has(option))
    if (!id) throw new Error(`No ${correct ? 'right' : 'wrong'} choice on screen for ${question.key}`)
    await section.locator(`.option[data-option="${id}"]`).click()
  }
  await expect(page.locator('.feedback')).toBeVisible()
  return question
}

export async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)
}
