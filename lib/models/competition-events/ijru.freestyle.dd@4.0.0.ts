import { RSRWrongJudgeTypeError } from '../../errors.js'
import { filterMarkStream, filterTally, matchMeta, roundTo } from '../../helpers/helpers.js'
import type { CompetitionEventModel, GenericMark, JudgeTypeGetter, Mark, ScoreTally } from '../types.js'
import { presentationJudge, technicalJudgeFactory } from './ijru.freestyle.sr@4.0.0.js'

export type Option = 'interactions'

const Fds = 0.35 / 0.25
const Fp = 0.4

export function L (l: number): number {
  if (l === 0) return 0
  return roundTo(Math.pow(1.5, l), 2)
}

// ======
// JUDGES
// ======
type DiffMarkSchema = 'break' | `diff${'Plus' | 'Minus'}` | `diffL${1 | 2 | 3 | 4 | 5}`
type DiffTallySchema = 'break' | `diffL${1 | 2 | 3 | 4 | 5}${'' | 'Plus' | 'Minus'}`
const diffMarkRegex = /^diffL[0-5]$/
function isDiffMark (x: Mark<DiffMarkSchema>): x is GenericMark<Exclude<DiffMarkSchema, 'break' | 'diffPlus' | 'diffMinus'>> {
  return diffMarkRegex.test(x.schema)
}
export const difficultyJumperJudge: JudgeTypeGetter<Option, DiffMarkSchema, DiffTallySchema> = options => {
  const markDefinitions = [
    { schema: 'diffPlus', name: 'Difficulty +' },
    { schema: 'diffMinus', name: 'Difficulty -' },
    { schema: 'break', name: 'Break' },

    ...Array(5).fill(undefined).map((el, idx) => ({
      name: `Level ${idx + 1}`,
      schema: `diffL${idx + 1}` as const,
    })),
  ]
  const tallyDefinitions = [
    { schema: 'break', name: 'Breaks', min: 0, step: 1 },

    ...Array(5).fill(undefined).flatMap((el, idx) => [
      {
        name: `Level ${idx + 1}-`,
        schema: `diffL${idx + 1}Minus` as const,
        min: 0,
        step: 1,
      },
      {
        name: `Level ${idx + 1}`,
        schema: `diffL${idx + 1}` as const,
        min: 0,
        step: 1,
      },
      {
        name: `Level ${idx + 1}+`,
        schema: `diffL${idx + 1}Plus` as const,
        min: 0,
        step: 1,
      },
    ] as const),
  ]

  const markLevels: Record<DiffTallySchema, number> = {
    break: 0,
    ...Object.fromEntries(Array(5).fill(undefined).flatMap((el, idx) => [
      [`diffL${idx + 1}Minus`, idx + 1 - 0.25] as const,
      [`diffL${idx + 1}`, idx + 1] as const,
      [`diffL${idx + 1}Plus`, idx + 1 + 0.5] as const,
    ] as const)) as Record<Exclude<DiffTallySchema, 'break'>, number>,
  }

  const id = 'Dj'
  return {
    id,
    name: 'Difficulty - Jumpers',
    markDefinitions,
    tallyDefinitions,
    calculateTally: (scsh) => {
      if (!matchMeta(scsh.meta, { judgeTypeId: id })) throw new RSRWrongJudgeTypeError(scsh.meta.judgeTypeId, id)
      const marks = filterMarkStream<DiffMarkSchema>(scsh.marks)
      const tally: ScoreTally<DiffTallySchema> = {}

      for (let idx = 0; idx < marks.length; idx++) {
        const mark = marks[idx]
        if (mark.schema === 'break') {
          tally[mark.schema] = (tally[mark.schema] ?? 0) + (mark.value ?? 1)
        } else if (mark.schema === 'diffMinus' || mark.schema === 'diffPlus') {
          const type = mark.schema.endsWith('Plus') ? 'Plus' : 'Minus'
          const prevMark = marks[idx - 1]

          // A plus/minus mark must come directly after a difficulty mark to be valid
          if (prevMark == null || !isDiffMark(prevMark)) continue
          // A plus/minus mark needs to have some marks in the tally to count
          if ((tally[prevMark.schema] ?? 0) <= 0) continue

          tally[prevMark.schema] = (tally[prevMark.schema] ?? 0) - (mark.value ?? 1)
          tally[`${prevMark.schema}${type}`] = (tally[`${prevMark.schema}${type}`] ?? 0) + (mark.value ?? 1)
        } else if (isDiffMark(mark)) {
          tally[mark.schema] = (tally[mark.schema] ?? 0) + (mark.value ?? 1)
        }
      }

      return {
        meta: scsh.meta,
        tally: filterTally(tally, tallyDefinitions),
      }
    },
    calculateJudgeResult: (scsh) => {
      if (!matchMeta(scsh.meta, { judgeTypeId: id })) throw new RSRWrongJudgeTypeError(scsh.meta.judgeTypeId, id)
      const tally = filterTally(scsh.tally, tallyDefinitions)

      const sumScore = tallyDefinitions.map(f => (tally[f.schema] ?? 0) * L(markLevels[f.schema as DiffTallySchema])).reduce((a, b) => a + b)
      const numMarks = tallyDefinitions.map(f => (tally[f.schema] ?? 0)).reduce((a, b) => a + b)
      const d = sumScore / numMarks

      return {
        meta: scsh.meta,
        result: {
          d,
        },
        statuses: {},
      }
    },
  }
}

export const difficultyTurnerJudge: JudgeTypeGetter<Option, DiffMarkSchema, DiffTallySchema> = options => {
  const markDefinitions = [
    { schema: 'diffPlus', name: 'Difficulty +' },
    { schema: 'diffMinus', name: 'Difficulty -' },

    ...Array(5).fill(undefined).map((el, idx) => ({
      name: `Level ${idx + 1}`,
      schema: `diffL${idx + 1}` as const,
    })),
  ]
  const tallyDefinitions = [
    ...Array(5).fill(undefined).flatMap((el, idx) => [
      {
        name: `Level ${idx + 1}-`,
        schema: `diffL${idx + 1}Minus` as const,
        min: 0,
        step: 1,
      },
      {
        name: `Level ${idx + 1}`,
        schema: `diffL${idx + 1}` as const,
        min: 0,
        step: 1,
      },
      {
        name: `Level ${idx + 1}+`,
        schema: `diffL${idx + 1}Plus` as const,
        min: 0,
        step: 1,
      },
    ] as const),
  ]

  const markLevels: Record<DiffTallySchema, number> = {
    break: 0,
    ...Object.fromEntries(Array(5).fill(undefined).flatMap((el, idx) => [
      [`diffL${idx + 1}Minus`, idx + 1 - 0.25] as const,
      [`diffL${idx + 1}`, idx + 1] as const,
      [`diffL${idx + 1}Plus`, idx + 1 + 0.5] as const,
    ] as const)) as Record<Exclude<DiffTallySchema, 'break'>, number>,
  }

  const id = 'Dt'
  return {
    id,
    name: 'Difficulty - Turners',
    markDefinitions,
    tallyDefinitions,
    calculateTally: (scsh) => {
      if (!matchMeta(scsh.meta, { judgeTypeId: id })) throw new RSRWrongJudgeTypeError(scsh.meta.judgeTypeId, id)
      const marks = filterMarkStream<DiffMarkSchema>(scsh.marks)
      const tally: ScoreTally<DiffTallySchema> = {}

      for (let idx = 0; idx < marks.length; idx++) {
        const mark = marks[idx]
        if (mark.schema === 'diffMinus' || mark.schema === 'diffPlus') {
          const type = mark.schema.endsWith('Plus') ? 'Plus' : 'Minus'
          const prevMark = marks[idx - 1]

          // A plus/minus mark must come directly after a difficulty mark to be valid
          if (prevMark == null || !isDiffMark(prevMark)) continue
          // A plus/minus mark needs to have some marks in the tally to count
          if ((tally[prevMark.schema] ?? 0) <= 0) continue

          tally[prevMark.schema] = (tally[prevMark.schema] ?? 0) - (mark.value ?? 1)
          tally[`${prevMark.schema}${type}`] = (tally[`${prevMark.schema}${type}`] ?? 0) + (mark.value ?? 1)
        } else if (isDiffMark(mark)) {
          tally[mark.schema] = (tally[mark.schema] ?? 0) + (mark.value ?? 1)
        }
      }

      return {
        meta: scsh.meta,
        tally: filterTally(tally, tallyDefinitions),
      }
    },
    calculateJudgeResult: (scsh) => {
      if (!matchMeta(scsh.meta, { judgeTypeId: id })) throw new RSRWrongJudgeTypeError(scsh.meta.judgeTypeId, id)
      const tally = filterTally(scsh.tally, tallyDefinitions)

      return {
        meta: scsh.meta,
        result: {
        },
        statuses: {},
      }
    },
  }
}

export default {
  id: 'ijru.freestyle.dd@4.0.0',
  name: 'IJRU Double Dutch Freestyle v4.0.0',
  options: [
    { id: 'interactions', name: 'Has Interactions', type: 'boolean' },
  ],
  judges: [presentationJudge, technicalJudgeFactory({ discipline: 'dd' }), difficultyJumperJudge, difficultyTurnerJudge],

  calculateEntry: (meta, res, options) => {
    return {
      meta,
      result: {},
      statuses: {},
    }
  },
  rankEntries: SR.rankEntries,

  previewTable: options => freestylePreviewTableHeadersFactory({ discipline: 'sr' })(options),
  resultTable: options => freestyleResultTableHeaders,
} satisfies CompetitionEventModel<Option>
