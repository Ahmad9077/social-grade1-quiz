import { useId } from 'react'
import { A, COLOURS, DEEDS, FEATS, PLACES, type ColourId, type CountryId, type DeedId, type FeatId, type PlaceId } from '../data/catalog'

interface ArtProps {
  art: string
  className?: string
}

/**
 * Renders a picture at the size of its container. The art codes are listed with `ArtRef` in
 * the catalog: portraits, flags drawn to their real proportions, colours, the services of a
 * residential area, behaviours, the Amir's achievements, and sentences in speech bubbles.
 */
export function Art({ art, className = '' }: ArtProps) {
  const [kind = '', ...rest] = art.split(':')
  const value = rest.join(':')
  const classes = (name: string) => `art ${name} ${className}`

  switch (kind) {
    case 'n':
      return (
        <span className={classes('art-number')} aria-hidden="true">
          {A(Number(value))}
        </span>
      )
    case 'txt':
      return (
        <span className={classes('art-text')} aria-hidden="true" dir="rtl">
          {value}
        </span>
      )
    case 'say':
      return (
        <span className={classes('art-say')} aria-hidden="true" dir="rtl">
          {value}
        </span>
      )
    case 'tf':
      return (
        <span className={classes(`art-tf tf-${value}`)} aria-hidden="true">
          <span className="tf-mark">{value === 'yes' ? '✓' : '✗'}</span>
          <span className="tf-word">{value === 'yes' ? 'صح' : 'خطأ'}</span>
        </span>
      )
    case 'photo':
      return (
        <span className={classes('art-photo')} aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL}photos/${value}.jpg`} alt="" draggable={false} />
        </span>
      )
    case 'flag':
      return (
        <span className={classes('art-flag')} aria-hidden="true">
          <Flag country={value as CountryId} />
        </span>
      )
    case 'flagx': {
      const [top = 'green', middle = 'white', bottom = 'red', hoist = 'black'] = value.split(',') as ColourId[]
      return (
        <span className={classes('art-flag')} aria-hidden="true">
          <KuwaitShape colours={{ top, middle, bottom, hoist }} />
        </span>
      )
    }
    case 'flagpart':
      return (
        <span className={classes('art-flag art-flag-big')} aria-hidden="true">
          <KuwaitShape colours={{ top: 'green', middle: 'white', bottom: 'red', hoist: 'black' }} blank={value as ColourId} />
        </span>
      )
    case 'kid':
      return (
        <span className={classes('art-kid')} aria-hidden="true">
          <span className="kid-face">🧒🏽</span>
          <span className="kid-flag">
            <span className="kid-pole" />
            <Flag country={value as CountryId} />
          </span>
        </span>
      )
    case 'swatch': {
      const colour = COLOURS[value as ColourId]
      return (
        <span className={classes('art-swatch')} aria-hidden="true">
          <span className="swatch-chip" style={{ background: colour.hex }} />
          <span className="swatch-name">{colour.name}</span>
        </span>
      )
    }
    case 'swatches':
      return (
        <span className={classes('art-swatches')} aria-hidden="true" data-count={value.split(',').length}>
          {value.split(',').map((id) => (
            <span key={id} className="swatch-chip" style={{ background: COLOURS[id as ColourId].hex }} />
          ))}
        </span>
      )
    case 'balloon': {
      const [number = '1', colour = 'red'] = rest
      return <Balloon number={Number(number)} colour={colour as ColourId} className={className} />
    }
    case 'place': {
      const place = PLACES[value as PlaceId]
      return (
        <span className={classes('art-card art-place')} aria-hidden="true">
          <span className="card-pic">{place.emoji}</span>
          <span className="card-name">{place.name}</span>
        </span>
      )
    }
    case 'pic':
      return (
        <span className={classes('art-emoji')} aria-hidden="true">
          {PLACES[value as PlaceId].emoji}
        </span>
      )
    case 'deed': {
      const deed = DEEDS[value as DeedId]
      return (
        <span className={classes('art-card art-deed')} aria-hidden="true">
          <span className="card-pic">{deed.art.join('')}</span>
          <span className="card-name">{deed.name}</span>
        </span>
      )
    }
    case 'feat': {
      const feat = FEATS[value as FeatId]
      return (
        <span className={classes('art-card art-feat')} aria-hidden="true">
          <span className="card-pic">{value === 'towers' ? <Towers /> : feat.emoji}</span>
          <span className="card-name">{feat.name}</span>
        </span>
      )
    }
    case 'heart':
      return <FlagHeart className={className} />
    case 'towers':
      return (
        <span className={classes('art-towers')} aria-hidden="true">
          <Towers />
        </span>
      )
    default:
      return (
        <span className={classes('art-emoji')} aria-hidden="true">
          {art}
        </span>
      )
  }
}

const hex = (id: ColourId) => COLOURS[id].hex
const INK = '#2a1f1a'

interface FlagColours {
  top: ColourId
  middle: ColourId
  bottom: ColourId
  hoist: ColourId
}

const PART_CENTRE: Record<keyof FlagColours, [number, number]> = { top: [75, 10], middle: [75, 30], bottom: [75, 50], hoist: [10, 30] }
const PART_OF: Record<string, keyof FlagColours> = { green: 'top', white: 'middle', red: 'bottom', black: 'hoist' }

/**
 * Kuwait's flag, 1:2: three equal bands and a black trapezoid by the pole, a quarter of the
 * length. With `blank`, that part is left empty with a question mark, as in «أكمل تلوين علم وطني».
 */
function KuwaitShape({ colours, blank }: { colours: FlagColours; blank?: ColourId }) {
  const empty = blank ? PART_OF[blank] : undefined
  const fill = (part: keyof FlagColours) => (part === empty ? '#efe9dc' : hex(colours[part]))
  const dashed = (part: keyof FlagColours) => (part === empty ? { stroke: INK, strokeWidth: 1, strokeDasharray: '3 2.5' } : {})
  return (
    <svg className="flag-svg" viewBox="0 0 120 60">
      <rect x="0" y="0" width="120" height="20" fill={fill('top')} {...dashed('top')} />
      <rect x="0" y="20" width="120" height="20" fill={fill('middle')} {...dashed('middle')} />
      <rect x="0" y="40" width="120" height="20" fill={fill('bottom')} {...dashed('bottom')} />
      <polygon points="0,0 30,20 30,40 0,60" fill={fill('hoist')} {...dashed('hoist')} />
      {empty ? (
        <text x={PART_CENTRE[empty][0]} y={PART_CENTRE[empty][1] + 5} className="flag-ask" textAnchor="middle">
          ؟
        </text>
      ) : null}
      <rect x="0.5" y="0.5" width="119" height="59" fill="none" stroke={INK} strokeWidth="1" />
    </svg>
  )
}

/** A serrated edge between the white hoist and the coloured fly (Qatar, Bahrain). */
function serration(width: number, height: number, base: number, tip: number, points: number) {
  const step = height / points
  const edge = Array.from({ length: points }, (_, k) => `${tip},${(k + 0.5) * step} ${base},${(k + 1) * step}`).join(' ')
  return `${width},0 ${base},0 ${edge} ${width},${height}`
}

/** The six flags of the Gulf states, each in its own proportions. */
function Flag({ country }: { country: CountryId }) {
  const frame = (width: number, height: number) => <rect x="0.5" y="0.5" width={width - 1} height={height - 1} fill="none" stroke={INK} strokeWidth="1" />
  switch (country) {
    case 'kw':
      return <KuwaitShape colours={{ top: 'green', middle: 'white', bottom: 'red', hoist: 'black' }} />
    case 'sa':
      return (
        <svg className="flag-svg" viewBox="0 0 90 60">
          <rect width="90" height="60" fill="#006c35" />
          <text x="45" y="29" className="flag-script" textAnchor="middle" fill="#fff" textLength="70" lengthAdjust="spacingAndGlyphs">
            لا إله إلا الله محمد رسول الله
          </text>
          <path d="M22 40 Q 24 37.6 27 38.6 L 64 38.6 L 64 40.6 L 27 40.6 Z" fill="#fff" />
          <rect x="64" y="37.4" width="2" height="4.4" fill="#fff" />
          <rect x="66" y="38.9" width="5" height="1.4" fill="#fff" />
          {frame(90, 60)}
        </svg>
      )
    case 'qa':
      return (
        <svg className="flag-svg" viewBox="0 0 112 44">
          <rect width="112" height="44" fill="#fff" />
          <polygon points={serration(112, 44, 30, 41, 9)} fill="#8a1538" />
          {frame(112, 44)}
        </svg>
      )
    case 'bh':
      return (
        <svg className="flag-svg" viewBox="0 0 100 60">
          <rect width="100" height="60" fill="#fff" />
          <polygon points={serration(100, 60, 24, 38, 5)} fill="#ce1126" />
          {frame(100, 60)}
        </svg>
      )
    case 'ae':
      return (
        <svg className="flag-svg" viewBox="0 0 120 60">
          <rect x="30" y="0" width="90" height="20" fill="#00732f" />
          <rect x="30" y="20" width="90" height="20" fill="#fff" />
          <rect x="30" y="40" width="90" height="20" fill="#1a1a1a" />
          <rect x="0" y="0" width="30" height="60" fill="#ef3340" />
          {frame(120, 60)}
        </svg>
      )
    case 'om':
      return (
        <svg className="flag-svg" viewBox="0 0 120 60">
          <rect x="30" y="0" width="90" height="20" fill="#fff" />
          <rect x="30" y="20" width="90" height="20" fill="#db161b" />
          <rect x="30" y="40" width="90" height="20" fill="#008000" />
          <rect x="0" y="0" width="30" height="60" fill="#db161b" />
          <g fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
            <path d="M8 5 L22 18" />
            <path d="M22 5 L8 18" />
            <path d="M15 4 V13 q0 4 -3.5 5.5" />
          </g>
          <rect x="10.5" y="9" width="9" height="2" rx="1" fill="#fff" />
          {frame(120, 60)}
        </svg>
      )
  }
}

/** «أحوط العدد الصحيح داخل البالون»: balloons in the flag's colours. */
function Balloon({ number, colour, className = '' }: { number: number; colour: ColourId; className?: string }) {
  const light = colour === 'white'
  return (
    <span className={`art art-balloon ${className}`} aria-hidden="true">
      <svg viewBox="0 0 60 92">
        <path d="M30 60 q -2 10 3 18 q 4 7 -1 14" fill="none" stroke={INK} strokeWidth="1.4" />
        <ellipse cx="30" cy="31" rx="25" ry="29" fill={hex(colour)} stroke={INK} strokeWidth="2.4" />
        <path d="M25 62 L35 62 L30 57 Z" fill={hex(colour)} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
        <ellipse cx="20" cy="18" rx="5" ry="8" fill="#fff" opacity={light ? 0 : 0.28} transform="rotate(-25 20 18)" />
        <text x="30" y="43" textAnchor="middle" className="balloon-number" fill={light ? INK : '#fff'}>
          {A(number)}
        </text>
      </svg>
    </span>
  )
}

/** Kuwait Towers, the book's landmark that is not one of the Amir's achievements. */
function Towers() {
  const sphere = (cx: number, cy: number, r: number) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#24638f" stroke={INK} strokeWidth="1.6" />
      {Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={cx - r * 0.6 + col * r * 0.4}
            cy={cy - r * 0.45 + row * r * 0.45}
            r={r * 0.11}
            fill={(row + col) % 2 ? '#7cc0e4' : '#3fa37c'}
          />
        )),
      )}
    </g>
  )
  return (
    <svg className="towers-svg" viewBox="0 0 80 100">
      <polygon points="37.6,97 42.4,97 40.7,6 39.3,6" fill="#f4f1ea" stroke={INK} strokeWidth="1.4" />
      {sphere(40, 52, 13)}
      {sphere(40, 31, 7)}
      <polygon points="58.2,97 61.8,97 60.6,34 59.4,34" fill="#f4f1ea" stroke={INK} strokeWidth="1.4" />
      {sphere(60, 63, 10)}
      <polygon points="19.4,97 21.6,97 20.8,52 20.2,52" fill="#f4f1ea" stroke={INK} strokeWidth="1.2" />
      <line x1="6" y1="97" x2="74" y2="97" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** The book's mark at the foot of every page: a heart in the colours of the flag. */
export function FlagHeart({ className = '' }: { className?: string }) {
  const id = useId()
  const heart = 'M32 55 C 12 41 2 30 4.5 17.5 C 7 6 22 3 32 14 C 42 3 57 6 59.5 17.5 C 62 30 52 41 32 55 Z'
  return (
    <svg className={`flag-heart ${className}`} viewBox="0 0 64 58" aria-hidden="true">
      <clipPath id={id}>
        <path d={heart} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x="0" y="0" width="64" height="20" fill={hex('green')} />
        <rect x="0" y="20" width="64" height="16" fill={hex('white')} />
        <rect x="0" y="36" width="64" height="22" fill={hex('red')} />
        <polygon points="0,0 20,20 20,36 0,58" fill={hex('black')} />
      </g>
      <path d={heart} fill="none" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
    </svg>
  )
}
