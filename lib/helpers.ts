import { type JudgeFieldDefinition, type ScoreTally, type Scoresheet, isClearMark, isMarkScoresheet, isTallyScoresheet, isUndoMark } from './models/types'

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
        const target = scoresheet.marks[mark.target]
        if (!target || isUndoMark(target) || isClearMark(target)) continue
        tally[target.schema] = (tally[target.schema] ?? 0) - (target.value ?? 1)
      } else if (isClearMark(mark)) {
        tally = {}
      } else {
        tally[mark.schema] = (tally[mark.schema] ?? 0) + (mark.value ?? 1)
      }
    }
  }

  if (fieldDefinitions) {
    for (const field of fieldDefinitions) {
      if (typeof tally[field.schema] !== 'number') continue
      tally[field.schema] = clampNumber(tally[field.schema] as number, field)
    }
  }

  if (allowedSchemas) {
    const extra = Object.keys(tally).filter(schema => !allowedSchemas.includes(schema))

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    for (const schema of extra) delete tally[schema]
  }

  return tally
}
