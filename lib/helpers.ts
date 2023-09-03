import { type JudgeFieldDefinition, type ScoreTally, type Scoresheet, isClearMark, isMarkScoresheet, isTallyScoresheet, isUndoMark, type Meta, type EntryResult } from './models/types.js'
import { type CompetitionEventDefinition } from './preconfigured/types.js'

export function isObject (x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x != null && !Array.isArray(x)
}

/**
 * Rounds a number to the closest multiple of the specified multiple.
 *
 * For example if the multiple is 0.5 and the input is 1.25 the number will be
 * rounded to 1.5
 */
export function roundToMultiple (num: number, multiple: number): number {
  const resto = num % multiple
  if (resto < multiple / 2) {
    return num - resto
  } else {
    return num + multiple - resto
  }
}

/**
 * Rounds a number to the specified number of digits
 */
export function roundTo (n: number, digits: number = 0): number {
  const multiplicator = Math.pow(10, digits)
  n = n * multiplicator
  const test = (Math.round(n) / multiplicator)
  if (isNaN(test)) return NaN
  return test
}

/**
 * Returns a function that will round a number to the number of digits passed
 * to the outer function. This also casts the result to a string
 *
 * Useful for creating formatters for table headers
 */
export function roundToCurry (digits: number = 0) {
  return (n: number) => roundTo(n, digits).toFixed(digits)
}

/**
 * Clamps a number to within the specified max and min,
 * if a step size is provided, the number will be rounded to the closest
 * multiple of this step size.
 */
export function clampNumber (n: number, { min, max, step }: { min?: number, max?: number, step?: number }) {
  let num = n
  if (typeof step === 'number') num = roundToMultiple(num, step)
  if (typeof min === 'number' && num < min) num = min
  if (typeof max === 'number' && num > max) num = max
  return num
}

/**
 * Formats a multiplication factor into a percentage adjustment string.
 * For example:
 * - a multiplication factor of 1    (100%) results in an adjustment of  ±0 %
 * - a multiplication factor of 1.35 (135%) results in an adjustment of +35 %
 * - a multiplication factor of 0.77 ( 77%) results in an adjustment of -23 %
 */
export function formatFactor (value: number): string {
  if (typeof value !== 'number' || isNaN(value)) return ''
  else if (value === 1) return '±0 %'
  else if (value > 1) return `+${roundTo((value - 1) * 100, 0)} %`
  else return `-${roundTo((1 - value) * 100, 0)} %`
}

/**
 * Takes a scoresheet and returns a tally
 *
 * if a MarkScoresheet is provided the marks array will be tallied taking undos
 * into account.
 *
 * Each value of the tally will also be clamped to the specified max, min and
 * step size for that field schema.
 */
export function calculateTally <Schema extends string> (scoresheet: Scoresheet<Schema>, fieldDefinitions?: Readonly<Array<JudgeFieldDefinition<Schema>>>): ScoreTally<Schema> {
  let tally: ScoreTally<Schema> = isTallyScoresheet(scoresheet) ? { ...(scoresheet.tally ?? {}) } : {}
  const allowedSchemas = fieldDefinitions?.map(f => f.schema)

  if (isMarkScoresheet(scoresheet)) {
    for (const mark of scoresheet.marks) {
      if (isUndoMark(mark)) {
        const target = scoresheet.marks.find(m => m.sequence === mark.target)
        if (target == null || isUndoMark(target) || isClearMark(target)) continue
        tally[target.schema as Schema] = (tally[target.schema as Schema] ?? 0) - (target.value ?? 1)
      } else if (isClearMark(mark)) {
        tally = {}
      } else {
        tally[mark.schema as Schema] = (tally[mark.schema as Schema] ?? 0) + (mark.value ?? 1)
      }
    }
  }

  if (fieldDefinitions != null) {
    for (const field of fieldDefinitions) {
      if (typeof tally[field.schema] !== 'number') continue
      tally[field.schema] = clampNumber(tally[field.schema] as number, field)
    }
  }

  if (allowedSchemas != null) {
    const extra = Object.keys(tally).filter(schema => !allowedSchemas.includes(schema as Schema))

    // @ts-expect-error Yes I know schema doesn't exist in the target object, I'm deleting the schemas that shouldn't be there
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    for (const schema of extra) delete tally[schema]
  }

  return tally
}

/**
 * Given two meta objects this function returns true if all the expected meta
 * fields are present and matching the expected value in the actual meta object.
 */
export function matchMeta (actual: Meta, expected: Partial<Meta>): boolean {
  for (const [k, v] of Object.entries(expected)) {
    if (actual[k] !== v) return false
  }
  return true
}

/**
 * Filters an array of all results into only results of component entries where
 * that participant has results for every competition event of competitionEvents
 */
export function filterParticipatingInAll (results: Readonly<EntryResult[]>, competitionEvents: CompetitionEventDefinition[]) {
  const participants = [...new Set(results.map(res => res.meta.participantId))]
    .filter(pId => competitionEvents.every(cEvt =>
      results.find(res => res.meta.participantId === pId && res.meta.competitionEvent === cEvt)
    ))

  return results.filter(res =>
    participants.includes(res.meta.participantId) &&
    competitionEvents.includes(res.meta.competitionEvent)
  )
}

// TODO
export function validateOptions () {}

// TODO
export function validateCompetitionEventOptions () {}

const cEvtRegex = /^e\.(?<org>[a-z0-9-]+)\.(?<type>fs|sp|oa)\.(?<discipline>sr|dd|wh|ts|xd)\.(?<eventAbbr>[a-z0-9-]+)\.(?<numParticipants>\d+)\.(?<timing>(?:\d+(?:x\d+)?))(?:@(?<version>[a-z0-9-.]+))?$/
export function parseCompetitionEventDefinition (competitionEvent: string) {
  const match = cEvtRegex.exec(competitionEvent)
  if (match?.groups == null) throw new TypeError(`Not a valid competition event, got ${competitionEvent}`)
  return {
    org: match.groups.org,
    type: match.groups.type as 'fs' | 'sp' | 'oa',
    discipline: match.groups.discipline as 'sr' | 'dd' | 'wh' | 'ts' | 'xd',
    eventAbbr: match.groups.eventAbbr,
    numParticipants: parseInt(match.groups.numParticipants, 10),
    timing: match.groups.timing,
    version: match.groups.version ?? null as string | null
  }
}
