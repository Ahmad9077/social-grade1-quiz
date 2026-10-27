// Content for «الاجتماعيات - الأول الابتدائي» — the first social studies test.
// The school's card: «أمير وطني» and «بيتي في وطني» (unit 1) and «علم وطني» (unit 2), pages 27
// to 41 of the Ministry book «وطني ١» (Grade 1, term 1, 2026/2027):
//   amir — the Amir's portrait and name, his love for the country, and his achievements
//   home — the services of a residential area, good behaviour with neighbours and at home,
//          caring for the area and its services
//   flag — the four colours and where they sit, Kuwait's flag among the Gulf flags, respect
// The user asked for questions a child of five or six can manage (short, pictured, concrete),
// and for choice questions only: no matching boards unless the school's card asks for them.
//
// No new recordings: the user asked not to spend ElevenLabs credits. Questions are read on
// screen; the voice is Maryam's shared phrases (cheers, kind words, results) recorded for the
// math quiz, copied with the same text and hash so nothing is sent again.
// Questions with a `draw` take new wrong answers (and sometimes a new right one) every round,
// so attempts keep changing. Wording never speaks to a girl or a boy. Question keys are
// permanent Hub identifiers. This file is self-contained so Node scripts can import it directly.

export const QUIZ_ID = 'social-grade1'

export type TopicId = 'amir' | 'home' | 'flag'
export type QuestionKind = 'pick' | 'match'

/**
 * What a tile or the question shows:
 *   photo:<id>        an official portrait           txt:<text>        a word or a short sentence
 *   say:<text>        a sentence in a speech bubble  tf:<yes|no>       «صح» or «خطأ»
 *   flag:<country>    a Gulf flag (kw sa qa om bh ae) kid:<country>    a child holding that flag
 *   flagx:<top>,<middle>,<bottom>,<hoist>   Kuwait's flag shape in these colours
 *   flagpart:<colour> Kuwait's flag with that part left blank
 *   swatch:<colour>   one colour and its name        swatches:<a,b,…>  a set of colours
 *   balloon:<n>:<colour>  a balloon with a number    n:<k>             a number
 *   place:<id>        a service with its name        pic:<id>          the same service, picture only
 *   deed:<id>         a behaviour, pictured and named
 *   feat:<id>         an achievement or a landmark
 * Anything else is an emoji.
 */
export type ArtRef = string

const DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
/** A number in the book's digits. */
export const A = (value: number) => String(value).replace(/\d/g, (d) => DIGITS[Number(d)]!)

// ── Facts from the book ───────────────────────────────────────────────────
export const AMIR = {
  name: 'الشيخ مشعل الأحمد الصباح',
  fullName: 'حضرة صاحب السمو الشيخ مشعل الأحمد الجابر الصباح',
}

export const COLOURS = {
  green: { name: 'الأخضر', hex: '#007a3d' },
  white: { name: 'الأبيض', hex: '#ffffff' },
  red: { name: 'الأحمر', hex: '#ce1126' },
  black: { name: 'الأسود', hex: '#1a1a1a' },
  blue: { name: 'الأزرق', hex: '#1f6fd1' },
  yellow: { name: 'الأصفر', hex: '#f6c21c' },
  orange: { name: 'البرتقالي', hex: '#f08a24' },
} as const
export type ColourId = keyof typeof COLOURS
/** Kuwait's flag: green, white and red bands from the top, and a black shape by the pole. */
export const FLAG_COLOURS: ColourId[] = ['green', 'white', 'red', 'black']
const PLACE_IN_FLAG: Record<string, string> = { green: 'فوق', white: 'في الوسط', red: 'تحت', black: 'عند العمود' }
const FLAG_ORDER = 'الأخضر فوق، والأبيض في الوسط، والأحمر تحت، والأسود عند العمود'

export const GULF = { kw: 'الكويت', sa: 'السعودية', qa: 'قطر', om: 'عمان', bh: 'البحرين', ae: 'الإمارات' } as const
export type CountryId = keyof typeof GULF
const NEIGHBOURS: CountryId[] = ['sa', 'qa', 'om', 'bh', 'ae']

export const PLACES = {
  school: { name: 'المدرسة', emoji: '🏫' },
  mosque: { name: 'المسجد', emoji: '🕌' },
  park: { name: 'الحديقة العامة', emoji: '🌳' },
  clinic: { name: 'المركز الصحي', emoji: '🏥' },
  coop: { name: 'الجمعية التعاونية', emoji: '🛒' },
  police: { name: 'المخفر', emoji: '🚓' },
  houses: { name: 'المنازل السكنية', emoji: '🏘️' },
} as const
export type PlaceId = keyof typeof PLACES

/** The book's four pictures (page 33) and a few more from everyday life, each pictured and named. */
export const DEEDS = {
  'help-neighbour': { name: 'مساعدة الجار', art: ['👵', '📦'], good: true },
  study: { name: 'أذاكر دروسي في بيتي', art: ['📖', '✏️'], good: true },
  'clean-area': { name: 'أنظف منطقتي', art: ['🧹', '🍂'], good: true },
  'use-bin': { name: 'أرمي القمامة في السلة', art: ['🧃', '🗑️'], good: true },
  'greet-neighbour': { name: 'أسلم على جيراني', art: ['👋', '🏡'], good: true },
  'annoy-neighbour': { name: 'مضايقة الجار', art: ['🔨', '😣'], good: false },
  'running-tap': { name: 'أترك الحنفية مفتوحة', art: ['🚰', '💦'], good: false },
  litter: { name: 'أرمي القمامة في الشارع', art: ['🥤', '🛣️'], good: false },
  'pick-flowers': { name: 'أقطف زهور الحديقة', art: ['🌷', '✂️'], good: false },
  noise: { name: 'أصرخ وأزعج الجيران', art: ['📢', '😖'], good: false },
} as const
export type DeedId = keyof typeof DEEDS

/** The Amir's achievements on page 29, and two landmarks that are not among them. */
export const FEATS = {
  university: { name: 'جامعة عبدالله السالم', emoji: '🎓' },
  hospital: { name: 'مستشفى الصباح الجديد', emoji: '🏥' },
  gulfcup: { name: 'كأس الخليج ٢٦', emoji: '🏆' },
  refinery: { name: 'مصفاة الزور', emoji: '🏭' },
  towers: { name: 'أبراج الكويت', emoji: '' },
  mosque: { name: 'المسجد الكبير', emoji: '🕌' },
} as const
export type FeatId = keyof typeof FEATS
type AchievementId = 'university' | 'hospital' | 'gulfcup' | 'refinery'

// ── Clip ids ──────────────────────────────────────────────────────────────
export const clip = {
  num: (value: number) => `ar/n/${value}`,
  ui: (id: UiClip) => `ar/ui/${id}`,
}

// ── Explanations ──────────────────────────────────────────────────────────
/** One way to explain an answer: shown on screen, and spoken when a clip exists. */
export interface Explanation {
  text: string
  clips: string[]
}

const says = (...lines: string[]): Explanation[] => lines.map((text) => ({ text, clips: [] }))

// ── Topics ────────────────────────────────────────────────────────────────
export interface Topic {
  id: TopicId
  title: string
  page: string
  art: ArtRef[]
}

export const TOPICS: Topic[] = [
  { id: 'amir', title: 'أمير وطني', page: 'ص ٢٧ – ٣٠', art: ['photo:amir'] },
  { id: 'home', title: 'بيتي في وطني', page: 'ص ٣١ – ٣٤', art: ['🏘️', '🌴'] },
  { id: 'flag', title: 'علم وطني', page: 'ص ٣٨ – ٤١', art: ['flag:kw'] },
]

// ── Questions ─────────────────────────────────────────────────────────────
// Written for a child of five or six: a short question, a picture to look at, answers that
// are pictures or one or two words, nothing to rule out («ليس»), and no abstract ideas.
export interface Option {
  id: string
  art: ArtRef
  label: string
  /** Read while the tile lights up; absent when hearing it would give the answer away. */
  clip?: string
}

export interface Pair {
  id: string
  /** Chosen first, on the right where Arabic reading starts. */
  first: ArtRef
  /** The partner that answers it. */
  second: ArtRef
  label: string
  clip?: string
}

/** New answers for every round: one right answer from `right`, and `count` wrong ones from `wrong`. */
export interface Draw {
  right: Option[]
  wrong: Option[]
  count: number
  explain?: (right: Option) => Explanation[]
}

export interface Question {
  key: string
  topic: TopicId
  kind: QuestionKind
  prompt: string
  /** Spoken question; empty when the question is read on screen only. */
  ask: string[]
  subject?: ArtRef
  options: Option[]
  /** «صح» stays before «خطأ» instead of being shuffled. */
  fixedOrder?: boolean
  pairs: Pair[]
  answer: string
  /** Ways to explain the answer; one is chosen each time so it does not repeat word for word. */
  explain: Explanation[]
  draw?: Draw
  difficulty: number
  skills: string[]
}

const d = (difficulty: number) => difficulty

function base(key: string, topic: TopicId, kind: QuestionKind, prompt: string, skills: string[], difficulty: number) {
  return { key: `${topic}:${key}`, topic, kind, prompt, ask: [] as string[], options: [] as Option[], pairs: [] as Pair[], skills: [topic, ...skills], difficulty }
}

/** A question whose answers are drawn afresh every round; the first draw is the stored one. */
function drawn(question: Omit<Question, 'options' | 'answer' | 'explain'> & { explain?: Explanation[] }, draw: Draw): Question {
  const right = draw.right[0]!
  return {
    ...question,
    options: [right, ...draw.wrong.filter((option) => option.id !== right.id).slice(0, draw.count)],
    answer: right.id,
    explain: question.explain ?? draw.explain?.(right) ?? [],
    draw,
  }
}

const YES: Option = { id: 'yes', art: 'tf:yes', label: 'صح' }
const NO: Option = { id: 'no', art: 'tf:no', label: 'خطأ' }

/** «صح أم خطأ؟»: a short sentence in a speech bubble. */
function statement(topic: TopicId, key: string, sentence: string, truth: boolean, fact: string, difficulty: number): Question {
  return {
    ...base(`say-${key}`, topic, 'pick', 'صح أم خطأ؟', ['statement'], difficulty),
    subject: `say:${sentence}`,
    options: [YES, NO],
    fixedOrder: true,
    answer: truth ? 'yes' : 'no',
    explain: says(fact),
  }
}

const textOption = (id: string, text: string): Option => ({ id, art: `txt:${text}`, label: text })

// 1. أمير وطني ─────────────────────────────────────────────────────────────
const featOption = (id: FeatId): Option => ({ id: `f-${id}`, art: `feat:${id}`, label: FEATS[id].name })

/** «أضع نجمة على صورة إنجازات الأمير»: one achievement and two landmarks that are not. */
function featPick(id: AchievementId, difficulty: number): Question {
  return {
    ...base(`feat-pick-${id}`, 'amir', 'pick', 'أي صورة من إنجازات الأمير؟', ['amir_achievements'], difficulty),
    options: [featOption(id), featOption('towers'), featOption('mosque')],
    answer: `f-${id}`,
    explain: says(`${FEATS[id].name} من إنجازات أمير وطني`),
  }
}

// 2. بيتي في وطني ──────────────────────────────────────────────────────────
const placeOption = (id: PlaceId): Option => ({ id: `p-${id}`, art: `place:${id}`, label: PLACES[id].name })
const placeName = (id: PlaceId): Option => textOption(`p-${id}`, PLACES[id].name)
const otherPlaces = (id: PlaceId) => (Object.keys(PLACES) as PlaceId[]).filter((other) => other !== id)

const PLACE_USE: Record<PlaceId, [string, string]> = {
  school: ['أين نتعلم ونقرأ؟', 'نتعلم ونقرأ في المدرسة'],
  mosque: ['أين نصلي؟', 'نصلي في المسجد'],
  park: ['أين نلعب بين الأشجار؟', 'نلعب في الحديقة العامة'],
  clinic: ['أين نذهب إذا مرضنا؟', 'إذا مرضنا نذهب إلى المركز الصحي'],
  coop: ['أين نشتري الأغراض؟', 'نشتري الأغراض من الجمعية التعاونية'],
  police: ['أين نجد الشرطة؟', 'الشرطة في المخفر'],
  houses: ['أين نسكن مع أسرتنا؟', 'نسكن في المنازل السكنية'],
}

function placeUse(id: PlaceId, difficulty: number): Question {
  const [prompt, fact] = PLACE_USE[id]
  return drawn(
    { ...base(`where-${id}`, 'home', 'pick', prompt, ['home_services'], difficulty), explain: says(fact) },
    { right: [placeOption(id)], wrong: otherPlaces(id).map(placeOption), count: 2 },
  )
}

function placeNameQ(id: PlaceId, difficulty: number): Question {
  return drawn(
    {
      ...base(`name-${id}`, 'home', 'pick', 'ما اسم هذا المكان؟', ['home_services'], difficulty),
      subject: `pic:${id}`,
      explain: says(`هذا ${PLACES[id].name}`),
    },
    { right: [placeName(id)], wrong: otherPlaces(id).map(placeName), count: 2 },
  )
}

const deedOption = (id: DeedId): Option => ({ id: `b-${id}`, art: `deed:${id}`, label: DEEDS[id].name })
const GOOD = (Object.keys(DEEDS) as DeedId[]).filter((id) => DEEDS[id].good)
const BAD = (Object.keys(DEEDS) as DeedId[]).filter((id) => !DEEDS[id].good)
const deedFact = (name: string, good: boolean) => (good ? `${name}: عمل صحيح` : `${name}: عمل خطأ`)

/** «أضع علامة ✓ أسفل السلوك الصحيح وعلامة ✗ أسفل السلوك الخاطئ». */
function deedQ(id: DeedId, difficulty: number): Question {
  const good = DEEDS[id].good
  return {
    ...base(`deed-${id}`, 'home', 'pick', 'صح أم خطأ؟', ['home_behaviour'], difficulty),
    subject: `deed:${id}`,
    options: [YES, NO],
    fixedOrder: true,
    answer: good ? 'yes' : 'no',
    explain: says(deedFact(DEEDS[id].name, good)),
  }
}

function deedPick(side: 'good' | 'bad', key: string, difficulty: number): Question {
  const [right, wrong] = side === 'good' ? [GOOD, BAD] : [BAD, GOOD]
  return drawn(
    { ...base(`${side}-${key}`, 'home', 'pick', side === 'good' ? 'أي عمل صحيح؟' : 'أي عمل خطأ؟', ['home_behaviour'], difficulty) },
    { right: right.map(deedOption), wrong: wrong.map(deedOption), count: 2, explain: (option) => says(deedFact(option.label, side === 'good')) },
  )
}

// 3. علم وطني ──────────────────────────────────────────────────────────────
const flagOption = (id: CountryId): Option => ({ id: `c-${id}`, art: `flag:${id}`, label: `علم ${GULF[id]}` })
const kidOption = (id: CountryId): Option => ({ id: `k-${id}`, art: `kid:${id}`, label: `طفل يحمل علم ${GULF[id]}` })
const swatchOption = (id: ColourId): Option => ({ id: `s-${id}`, art: `swatch:${id}`, label: COLOURS[id].name })

function whichFlag(count: number, difficulty: number): Question {
  return drawn(
    { ...base(`which-flag-${count + 1}`, 'flag', 'pick', 'أين علم الكويت؟', ['flag_gulf'], difficulty), explain: says(`علم وطني: ${FLAG_ORDER}`) },
    { right: [flagOption('kw')], wrong: NEIGHBOURS.map(flagOption), count },
  )
}

function whichKid(count: number, difficulty: number): Question {
  return drawn(
    { ...base(`which-kid-${count + 1}`, 'flag', 'pick', 'من يحمل علم الكويت؟', ['flag_gulf'], difficulty), explain: says(`علم وطني: ${FLAG_ORDER}`) },
    { right: [kidOption('kw')], wrong: NEIGHBOURS.map(kidOption), count },
  )
}

/** «أكمل تلوين علم وطني»: which colour fills the blank part? */
function missingPart(colour: ColourId, difficulty: number): Question {
  return {
    ...base(`missing-${colour}`, 'flag', 'pick', 'ما لون الجزء الناقص؟', ['flag_colours'], difficulty),
    subject: `flagpart:${colour}`,
    options: FLAG_COLOURS.map(swatchOption),
    answer: `s-${colour}`,
    explain: says(`${COLOURS[colour].name} ${PLACE_IN_FLAG[colour]}`, FLAG_ORDER),
  }
}

const flagxOption = (id: string, colours: string): Option => ({ id, art: `flagx:${colours}`, label: 'علم' })
const WRONG_FLAGS = [
  flagxOption('x-red-top', 'red,white,green,black'),
  flagxOption('x-white-top', 'white,green,red,black'),
  flagxOption('x-red-hoist', 'green,white,black,red'),
  flagxOption('x-red-middle', 'green,red,white,black'),
]

export const QUESTIONS: Question[] = [
  // 1. أمير وطني (pages 27–30)
  {
    ...base('portrait', 'amir', 'pick', 'أين صورة أمير وطني؟', ['amir_who'], d(15)),
    options: [
      { id: 'amir', art: 'photo:amir', label: 'صورة' },
      { id: 'crown-prince', art: 'photo:crown-prince', label: 'صورة' },
    ],
    answer: 'amir',
    explain: says(`هذا أمير وطني: ${AMIR.name}، حفظه الله`, `${AMIR.fullName}، أمير دولة الكويت`),
  },
  {
    ...base('who', 'amir', 'pick', 'من هذا؟', ['amir_who'], d(10)),
    subject: 'photo:amir',
    options: [textOption('amir', 'أمير الكويت'), textOption('teacher', 'معلم'), textOption('doctor', 'طبيب')],
    answer: 'amir',
    explain: says(`هذا أمير وطني: ${AMIR.name}`),
  },
  drawn(
    {
      ...base('first-name', 'amir', 'pick', 'اسم أمير وطني: الشيخ ...', ['amir_who'], d(30)),
      subject: 'photo:amir',
      explain: says(`أمير وطني: ${AMIR.name}`),
    },
    { right: [textOption('meshal', 'مشعل')], wrong: ['سالم', 'خالد', 'حمد', 'فيصل'].map((name, n) => textOption(`name-${n}`, name)), count: 2 },
  ),
  featPick('university', d(30)),
  featPick('hospital', d(25)),
  featPick('gulfcup', d(25)),
  featPick('refinery', d(35)),
  statement('amir', 'name', `أمير وطني هو ${AMIR.name}`, true, `صح: أمير وطني هو ${AMIR.name}`, d(15)),
  statement('amir', 'loves', 'أمير وطني يحب وطنه', true, 'صح: أمير وطني يحب وطنه ويعمل من أجله', d(10)),
  statement('amir', 'we-love', 'نحب أمير وطني ونحترمه', true, 'صح: نحب أمير وطني ونحترمه ونفتخر به', d(10)),
  statement('amir', 'hospital', 'مستشفى الصباح الجديد من إنجازات أمير وطني', true, 'صح: مستشفى الصباح الجديد من إنجازات أمير وطني', d(25)),
  statement('amir', 'teacher', 'أمير وطني معلم في المدرسة', false, `خطأ: ${AMIR.name} أمير دولة الكويت`, d(15)),
  statement('amir', 'towers', 'أبراج الكويت من إنجازات أمير وطني', false, 'خطأ: من إنجازات أمير وطني مستشفى الصباح الجديد وجامعة عبدالله السالم', d(40)),

  // 2. بيتي في وطني (pages 31–34)
  placeUse('school', d(10)),
  placeUse('mosque', d(10)),
  placeUse('park', d(15)),
  placeUse('clinic', d(20)),
  placeUse('coop', d(25)),
  placeUse('police', d(25)),
  placeUse('houses', d(30)),
  placeNameQ('school', d(20)),
  placeNameQ('mosque', d(20)),
  placeNameQ('clinic', d(30)),
  placeNameQ('coop', d(30)),
  ...(Object.keys(DEEDS) as DeedId[]).map((id) => deedQ(id, DEEDS[id].good ? d(10) : d(15))),
  deedPick('good', 'a', d(15)),
  deedPick('good', 'b', d(20)),
  deedPick('bad', 'a', d(20)),
  statement('home', 'clinic', 'إذا مرضنا نذهب إلى المركز الصحي', true, 'صح: إذا مرضنا نذهب إلى المركز الصحي', d(15)),
  statement('home', 'coop-mosque', 'نشتري الأغراض من المسجد', false, 'خطأ: نشتري الأغراض من الجمعية التعاونية، ونصلي في المسجد', d(20)),

  // 3. علم وطني (pages 38–41)
  whichFlag(2, d(15)),
  whichFlag(3, d(25)),
  whichKid(2, d(20)),
  whichKid(3, d(30)),
  {
    ...base('colour-count', 'flag', 'pick', 'كم لونا في علم وطني؟', ['flag_colours'], d(15)),
    options: [
      { id: 'n4', art: 'balloon:4:red', label: A(4) },
      { id: 'n3', art: 'balloon:3:white', label: A(3) },
      { id: 'n2', art: 'balloon:2:green', label: A(2) },
      { id: 'n1', art: 'balloon:1:black', label: A(1) },
    ],
    answer: 'n4',
    explain: [{ text: 'علم وطني له ٤ ألوان: الأخضر والأبيض والأحمر والأسود', clips: [clip.ui('count-is'), clip.num(4)] }],
  },
  {
    ...base('colour-set', 'flag', 'pick', 'أين ألوان علم وطني؟', ['flag_colours'], d(25)),
    options: [
      { id: 'set-4', art: 'swatches:green,white,red,black', label: 'أربعة ألوان' },
      { id: 'set-3', art: 'swatches:green,white,red', label: 'ثلاثة ألوان' },
      { id: 'set-2', art: 'swatches:green,red', label: 'لونان' },
      { id: 'set-1', art: 'swatches:white', label: 'لون واحد' },
    ],
    answer: 'set-4',
    explain: says('ألوان علم وطني: الأخضر والأبيض والأحمر والأسود'),
  },
  drawn(
    { ...base('colour-in', 'flag', 'pick', 'أي لون في علم وطني؟', ['flag_colours'], d(15)) },
    {
      right: FLAG_COLOURS.map(swatchOption),
      wrong: (['blue', 'yellow', 'orange'] as ColourId[]).map(swatchOption),
      count: 2,
      explain: (option) => says(`${option.label} من ألوان علم وطني`, 'ألوان علم وطني: الأخضر والأبيض والأحمر والأسود'),
    },
  ),
  missingPart('green', d(25)),
  missingPart('white', d(30)),
  missingPart('red', d(25)),
  missingPart('black', d(30)),
  drawn(
    { ...base('right-colours', 'flag', 'pick', 'أي علم ألوانه صحيحة؟', ['flag_colours'], d(35)), explain: says(FLAG_ORDER) },
    { right: [flagxOption('x-right', 'green,white,red,black')], wrong: WRONG_FLAGS, count: 2 },
  ),
  {
    ...base('respect', 'flag', 'pick', 'كيف نحترم علم وطني؟', ['flag_respect'], d(15)),
    options: [textOption('stand', 'نقف له بافتخار'), textOption('floor', 'نرميه على الأرض'), textOption('scribble', 'نرسم عليه')],
    answer: 'stand',
    explain: says('نحترم علم وطني، ونقف له بافتخار'),
  },
  statement('flag', 'four', 'علم وطني له أربعة ألوان', true, 'صح: الأخضر والأبيض والأحمر والأسود', d(15)),
  statement('flag', 'three', 'علم وطني له ثلاثة ألوان', false, 'خطأ: علم وطني له أربعة ألوان', d(20)),
  statement('flag', 'green-top', 'اللون الأخضر فوق في علم وطني', true, `صح: ${FLAG_ORDER}`, d(25)),
  statement('flag', 'red-top', 'اللون الأحمر فوق في علم وطني', false, `خطأ: ${FLAG_ORDER}`, d(30)),
  statement('flag', 'respect', 'نحترم علم وطني', true, 'صح: نحترم علم وطني ونقف له بافتخار', d(10)),
  statement('flag', 'floor', 'نترك علم وطني على الأرض', false, 'خطأ: نحافظ على علم وطني ونرفعه عاليا', d(15)),
]

// ── Narration ─────────────────────────────────────────────────────────────
// Maryam's shared phrases from the math quiz: the same text, so the same recording.
export const UI_CLIPS = {
  welcome: 'هلا! نختار درس ونبدأ.',
  'test-intro': 'هذا اختبار تجريبي… فيه أسئلة من كل الدروس. يلا نبدأ!',
  'match-wrong': 'لا… نجرب مرة ثانية.',
  review: 'خلنا نتذكر مع بعض…',
  'done-great': 'واو! نتيجة رائعة!',
  'done-good': 'حلو! نتدرب مرة ثانية… ونصير أقوى.',
  'count-is': 'العدد',
  'cheer-1': 'كفو!',
  'cheer-2': 'ما شاء الله! صح.',
  'cheer-3': 'واو! جواب صح!',
  'cheer-4': 'برافو! جواب ممتاز.',
  'cheer-5': 'الله! جواب حلو.',
  'cheer-6': 'تمام التمام!',
  'cheer-7': 'عفية!',
  'cheer-8': 'صح! رائع.',
  'cheer-9': 'زين! جواب صحيح.',
  'cheer-10': 'يا سلام! صح.',
  'retry-1': 'مو مشكلة… الجواب الصح…',
  'retry-2': 'قربنا! الجواب الصح…',
  'retry-3': 'خلنا نتعلمها مع بعض… الجواب الصح…',
  'retry-4': 'محاولة حلوة! الجواب الصح…',
  'retry-5': 'نشوف مع بعض… الجواب الصح…',
} as const
export type UiClip = keyof typeof UI_CLIPS

export interface Cheer {
  text: string
  clip: string
}

export const CHEERS: Cheer[] = (Object.keys(UI_CLIPS) as UiClip[])
  .filter((id) => id.startsWith('cheer-'))
  .map((id) => ({ text: UI_CLIPS[id], clip: clip.ui(id) }))

export const RETRIES = (Object.keys(UI_CLIPS) as UiClip[])
  .filter((id) => id.startsWith('retry-'))
  .map((id) => ({ text: UI_CLIPS[id].replace('الجواب الصح…', '').replace('…', '').trim(), clip: clip.ui(id) }))

export interface AudioCue {
  id: string
  text: string
  /** `ar`: Kuwaiti (Maryam), without diacritics. */
  voice: 'ar'
}

export function bare(text: string): string {
  return text.replace(/[ً-ْٰ]/g, '')
}

export function audioCues(): AudioCue[] {
  const ar = (id: string, text: string): AudioCue => ({ id, text: bare(text), voice: 'ar' })
  return [ar(clip.num(4), 'أربعة.'), ...(Object.keys(UI_CLIPS) as UiClip[]).map((id) => ar(clip.ui(id), UI_CLIPS[id]))]
}

/** Every clip a round needs, so it can be loaded before the first question. */
export function roundClips(questions: Question[]): string[] {
  return [
    ...questions.flatMap((question) => [
      ...question.ask,
      ...question.options.flatMap((option) => (option.clip ? [option.clip] : [])),
      ...question.pairs.flatMap((pair) => (pair.clip ? [pair.clip] : [])),
      ...question.explain.flatMap((way) => way.clips),
    ]),
    clip.ui('match-wrong'),
    clip.ui('review'),
    ...CHEERS.map((cheer) => cheer.clip),
    ...RETRIES.map((retry) => retry.clip),
    clip.ui('done-great'),
    clip.ui('done-good'),
  ]
}

/** A copy of the question for one round: drawn questions get this round's answers. */
export function dressQuestion(question: Question, random: () => number = Math.random): Question {
  const { draw } = question
  if (!draw) return question
  const right = draw.right[Math.floor(random() * draw.right.length)]!
  const wrong = [...draw.wrong.filter((option) => option.id !== right.id)]
  for (let i = wrong.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[wrong[i], wrong[j]] = [wrong[j]!, wrong[i]!]
  }
  return {
    ...question,
    options: [right, ...wrong.slice(0, draw.count)],
    answer: right.id,
    explain: draw.explain ? draw.explain(right) : question.explain,
  }
}
