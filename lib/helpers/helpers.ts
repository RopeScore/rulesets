import { RSRWrongJudgeTypeError } from '../errors.js'
import type { GenericMark, Mark } from '../models/types.js'
import { type JudgeFieldDefinition, type ScoreTally, isClearMark, isUndoMark, type Meta, type EntryResult, type TallyScoresheet, type MarkScoresheet } from '../models/types.js'
import { type CompetitionEventDefinition } from '../preconfigured/types.js'

export function isObject (x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x != null && !Array.isArray(x)
}

export function isMarkScoresheet <Schema extends string = string> (scoresheet: unknown): scoresheet is MarkScoresheet<Schema> {
  return isObject(scoresheet) && 'marks' in scoresheet
}

export function isTallyScoresheet <Schema extends string = string> (scoresheet: unknown): scoresheet is TallyScoresheet<Schema> {
  return isObject(scoresheet) && 'tally' in scoresheet
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
export function roundTo (n: number, digits = 0): number {
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
export function roundToCurry (digits = 0) {
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

export function filterMarkStream <Schema extends string> (rawMarks: Readonly<Array<Readonly<Mark<Schema>>>>): Array<GenericMark<Schema>> {
  const clearMarkIdx = rawMarks.findLastIndex(mark => mark.schema === 'clear')
  const marks = rawMarks.slice(clearMarkIdx + 1)
  for (let idx = 0; idx < marks.length; idx++) {
    const mark = marks[idx]
    if (isUndoMark(mark)) {
      let targetIdx = -1
      // We're doing an optimised check here since the undone mark need to be
      // before the undo mark, and will most likely be just before teh undo mark
      // therefore findIndex or findLastIndex would be wasteful
      for (let tIdx = idx - 1; tIdx >= 0; tIdx--) {
        if (marks[tIdx].sequence === mark.target) {
          targetIdx = tIdx
          break
        }
      }
      if (targetIdx >= 0 && !isUndoMark(marks[targetIdx]) && !isClearMark(marks[targetIdx])) {
        marks.splice(targetIdx, 1)
        idx--
      }
      marks.splice(idx, 1)
      idx--
    }
  }
  return marks
}

export function filterTally <Schema extends string> (_tally: ScoreTally, fieldDefinitions?: Readonly<Array<JudgeFieldDefinition<Schema>>>): ScoreTally<Schema> {
  if (fieldDefinitions == null) return _tally as ScoreTally<Schema>
  const tally: ScoreTally<Schema> = {}

  for (const field of fieldDefinitions) {
    const v = _tally[field.schema]
    if (typeof v !== 'number') continue

    tally[field.schema] = clampNumber(v, field)
  }

  return tally
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
export function simpleCalculateTallyFactory <Schema extends string> (judgeTypeId: string, fieldDefinitions?: Readonly<Array<JudgeFieldDefinition<Schema>>>) {
  return function simpleCalculateTally (scoresheet: MarkScoresheet<Schema>) {
    if (!matchMeta(scoresheet.meta, { judgeTypeId })) throw new RSRWrongJudgeTypeError(scoresheet.meta.judgeTypeId, judgeTypeId)
    let tally: ScoreTally<Schema> = isTallyScoresheet<Schema>(scoresheet) ? { ...(scoresheet.tally ?? {}) } : {}

    for (const mark of filterMarkStream(scoresheet.marks)) {
      tally[mark.schema as Schema] = (tally[mark.schema as Schema] ?? 0) + (mark.value ?? 1)
    }

    tally = filterTally(tally, fieldDefinitions)

    return {
      meta: scoresheet.meta,
      tally,
    }
  }
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
export function filterParticipatingInAll (results: readonly EntryResult[], competitionEvents: CompetitionEventDefinition[]) {
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
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function validateOptions () {}

// TODO
// eslint-disable-next-line @typescript-eslint/no-empty-function
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
    version: match.groups.version ?? null as string | null,
  }
}
