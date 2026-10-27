import type { TopicId } from './catalog'

export type ToneId = TopicId | 'test'

// Each lesson keeps one colour everywhere it appears, after the book's lesson banners:
// sky blue for unit 1 («أمير وطني», «بيتي في وطني») and orange for unit 2 («علم وطني»);
// the mock test takes the flag's green.
export const TONES: Record<ToneId, { tone: string; tint: string; deep: string }> = {
  amir: { tone: '#1c8fc2', tint: '#daf1fb', deep: '#11638a' },
  home: { tone: '#2f9e8f', tint: '#daf3ef', deep: '#1d6d62' },
  flag: { tone: '#e8871e', tint: '#fdecd6', deep: '#9c5509' },
  test: { tone: '#007a3d', tint: '#d9f0e3', deep: '#005229' },
}

export function toneStyle(id: ToneId): Record<string, string> {
  const { tone, tint, deep } = TONES[id]
  return { '--tone': tone, '--tint': tint, '--deep': deep }
}
