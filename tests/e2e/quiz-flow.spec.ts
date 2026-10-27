import { expect, test } from '@playwright/test'
import { QUESTIONS } from '../../src/data/catalog'
import { PRACTICE_SIZE, TEST_SIZE } from '../../src/domain/round'
import { answer, noHorizontalScroll, start } from './helpers'

test('home lists the three lessons and the mock test, in Arabic RTL', async ({ page }) => {
  await start(page)
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('.topic-card')).toHaveCount(3)
  await expect(page.locator('.topic-card-title')).toHaveText(['أمير وطني', 'بيتي في وطني', 'علم وطني'])
  await expect(page.locator('.test-banner')).toBeVisible()
  await expect(page.locator('.preview-badge').first()).toBeVisible()
  await noHorizontalScroll(page)
})

test('a lesson starts its questions straight away, read on screen', async ({ page }) => {
  await start(page)
  await page.locator('.topic-card[data-topic="amir"]').click()
  await expect(page.locator('section.question')).toBeVisible()
  await expect(page.locator('.learn-card, .mode-card')).toHaveCount(0)
  // Nothing new was recorded, so the question has no replay button.
  await expect(page.locator('.prompt-row button')).toHaveCount(0)
})

test('a full round of the flag gives feedback, stars and a review of misses', async ({ page }) => {
  test.setTimeout(120_000)
  await start(page)
  await page.locator('.topic-card[data-topic="flag"]').click()
  for (let n = 0; n < PRACTICE_SIZE; n += 1) {
    const correct = n !== 2 && n !== 5
    const question = await answer(page, correct)
    await expect(page.locator(correct ? '.feedback-good' : '.feedback-miss')).toBeVisible()
    if (!correct && question.kind === 'pick') await expect(page.locator('.option.is-reveal')).toHaveCount(1)
    await noHorizontalScroll(page)
    await page.locator('.next-button').click()
  }
  await expect(page.locator('.results-card')).toBeVisible()
  await expect(page.locator('.results-number')).toHaveText('٦')
  await expect(page.locator('.review-item')).toHaveCount(2)
  await page.getByRole('button', { name: /الدروس/ }).click()
  await expect(page.locator('.topic-card[data-topic="flag"] .star-icon.is-filled')).toHaveCount(2)
})

test('«صح» comes before «خطأ», on the right where reading starts', async ({ page }) => {
  test.setTimeout(120_000)
  await start(page)
  let seen = 0
  for (let round = 0; round < 4 && seen === 0; round += 1) {
    await page.locator('.topic-card[data-topic="home"]').click()
    for (let n = 0; n < PRACTICE_SIZE; n += 1) {
      // Wait for the previous question to finish leaving.
      await expect(page.locator('section.question')).toHaveCount(1)
      const key = await page.locator('section.question').getAttribute('data-question-key')
      if (QUESTIONS.find((q) => q.key === key)?.fixedOrder) {
        const ids = await page.locator('section.question .option').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-option')))
        expect(ids).toEqual(['yes', 'no'])
        const [yes, no] = await Promise.all([page.locator('.option[data-option="yes"]').boundingBox(), page.locator('.option[data-option="no"]').boundingBox()])
        expect(yes!.x).toBeGreaterThan(no!.x)
        seen += 1
      }
      await answer(page, true)
      await page.locator('.next-button').click()
    }
    await expect(page.locator('.results-card')).toBeVisible()
    await page.getByRole('button', { name: /الدروس/ }).click()
  }
  expect(seen).toBeGreaterThan(0)
})

test('the mock test mixes all three lessons', async ({ page }) => {
  test.setTimeout(120_000)
  await start(page)
  await page.locator('.test-banner').click()
  const topics = new Set<string>()
  for (let n = 0; n < TEST_SIZE; n += 1) {
    const question = await answer(page, true)
    topics.add(question.topic)
    await page.locator('.next-button').click()
  }
  expect(topics.size).toBe(3)
  await expect(page.locator('.results-number')).toHaveText('١٢')
})

test('the portraits load', async ({ page }) => {
  await start(page)
  await page.locator('.topic-card[data-topic="amir"]').click()
  await expect(page.locator('.topic-card')).toHaveCount(0)
  const loaded = await page.evaluate(async () => {
    const base = document.baseURI
    const sizes = await Promise.all(['amir', 'crown-prince'].map(async (id) => (await fetch(new URL(`photos/${id}.jpg`, base))).status))
    return sizes
  })
  expect(loaded).toEqual([200, 200])
})

test('every lesson fits the screen', async ({ page }) => {
  test.setTimeout(120_000)
  await start(page)
  for (const topic of ['amir', 'home', 'flag']) {
    await page.locator(`.topic-card[data-topic="${topic}"]`).click()
    for (let n = 0; n < 5; n += 1) {
      await answer(page, true)
      await noHorizontalScroll(page)
      await page.locator('.next-button').click()
    }
    await page.locator('.round-button').first().click()
    await page.getByRole('button', { name: 'خروج' }).last().click()
  }
})
