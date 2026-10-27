# الاجتماعيات - الأول الابتدائي

A test-only practice site (no learn cards) for the first Grade 1 social studies test. The school's card:
«أمير وطني», «بيتي في وطني» and «علم وطني», pages 27 to 41 of the Ministry book «وطني ١» (term 1, 2026/2027).

| Lesson | Pages | What the questions cover |
| --- | --- | --- |
| أمير وطني | 27–30 | the Amir's portrait and name, his love for the country, his achievements (pictures) |
| بيتي في وطني | 31–34 | the services of a residential area and their uses, right and wrong behaviour |
| علم وطني | 38–41 | the four colours and where they sit, the missing part, Kuwait's flag among the Gulf flags, respect for the flag |

Written for a child of five or six: short questions, pictures, no «ليس» and no abstract ideas. Choice questions only, no matching boards (the user's rule unless the school's card asks for them). Mock test: 12 questions, 4 from each lesson. 58 questions; many draw new
answers every round (other Gulf flags, other behaviours, other services), so attempts keep changing.

Audio: nothing new was recorded (the user asked not to spend ElevenLabs credits). Questions are read on screen; the
cheers, kind words, test intro and results are Maryam's clips copied from the math quiz with the same text and hash.
The two portraits in `public/photos/` are the official portraits printed at the front of the book.

## Status
Preview only (27 October 2026): not published, not connected to the Hub, not assigned to any account.

## Development
```bash
npm install
npm run dev            # preview mode at http://127.0.0.1:4195
npm run check          # lint, types, unit tests, seed check, preview build
npx playwright test    # iPhone/iPad WebKit + desktop Chromium flows and Hub contract
npm run build:hub      # production Hub build into dist-hub/ (base /social-grade1-quiz/)
```

- Content, book facts and permanent question keys: `src/data/catalog.ts`
- Hub seed: `npm run generate:hub-seed` → `integration/seed-social-grade1.sql`
