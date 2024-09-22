import { RSRWrongJudgeTypeError } from '../../errors'
import { clampNumber, filterMarkStream, filterTally, formatFactor, matchMeta, roundTo, roundToCurry, simpleCalculateTallyFactory } from '../../helpers'
import type { CompetitionEventModel, JudgeTypeGetter, Options, ScoreTally, TableDefinition } from '../types'

type Option = 'discipline' | 'interactions' |
  'maxRqGymnasticsPower' | 'maxRqMultiples' | 'maxRqRopeManipulation' |
  'maxRqInteractions'

// pres
const Fp = 0.6
const presWeights = {
  ent: 0.25,
  form: 0.25,
  music: 0.2,
  crea: 0.15,
  vari: 0.15,
}

// deduc
const Fv = 0.05
const Fb = 0.05
const Fq = 0.025
const Fm1 = 0.05
const Fm2 = 0.075
const Fm = 0.1

// reqEl
export function getRqMax (options: Options<Option>) {
  return {
    rqGymnasticsPower: typeof options.maxRqGymnasticsPower === 'number' ? options.maxRqGymnasticsPower : 6,
    rqMultiples: typeof options.maxRqMultiples === 'number' ? options.maxRqMultiples : 6,
    rqRopeManipulation: typeof options.maxRqRopeManipulation === 'number' ? options.maxRqRopeManipulation : 6,
    rqInteractions: typeof options.maxRqInteractions === 'number' ? options.maxRqInteractions : 6,
  }
}

// diff
export function L (l: number): number {
  if (l === 0) return 0
  return roundTo(0.1 * Math.pow(1.5, l), 2)
}

// ======
// JUDGES
// ======
export const presentationJudge: JudgeTypeGetter<Option> = options => {
  const components = ['ent', 'form', 'music', 'crea', 'vari'] as const
  const markDefinitions = [
    {
      schema: 'entPlus',
      name: 'Entertainment +',
    },
    {
      schema: 'entMinus',
      name: 'Entertainment -',
    },

    {
      schema: 'formPlus',
      name: 'Form/Execution +',
    },
    {
      schema: 'formMinus',
      name: 'Form/Execution -',
    },

    {
      schema: 'musicPlus',
      name: 'Musicality +',
    },
    {
      schema: 'musicMinus',
      name: 'Musicality -',
    },

    {
      schema: 'creaPlus',
      name: 'Creativity +',
    },
    {
      schema: 'creaMinus',
      name: 'Creativity -',
    },

    {
      schema: 'variPlus',
      name: 'Variety +',
    },
    {
      schema: 'variMinus',
      name: 'Repetitive -',
    },

    {
      schema: 'miss',
      name: 'Miss',
    },

    {
      schema: 'entPlusAdj',
      name: 'Adjustment Entertainment +',
    },
    {
      schema: 'entMinusAdj',
      name: 'Adjustment Entertainment -',
    },

    {
      schema: 'formPlusAdj',
      name: 'Adjustment Form/Execution +',
    },
    {
      schema: 'formMinusAdj',
      name: 'Adjustment Form/Execution -',
    },

    {
      schema: 'musicPlusAdj',
      name: 'Adjustment Musicality +',
    },
    {
      schema: 'musicMinusAdj',
      name: 'Adjustment Musicality -',
    },

    {
      schema: 'creaPlusAdj',
      name: 'Adjustment Creativity +',
    },
    {
      schema: 'creaMinusAdj',
      name: 'Adjustment Creativity -',
    },

    {
      schema: 'variPlusAdj',
      name: 'Adjustment Variety +',
    },
    {
      schema: 'variMinusAdj',
      name: 'Adjustment Repetitive -',
    },
  ] as const
  const tallyDefinitions = [
    {
      schema: 'ent',
      name: 'Entertainment',
      min: 0,
      max: 24,
      step: 1,
    },
    {
      schema: 'form',
      name: 'Form/Execution',
      min: 0,
      max: 24,
      step: 1,
    },
    {
      schema: 'music',
      name: 'Musicality',
      min: 0,
      max: 24,
      step: 1,
    },
    {
      schema: 'crea',
      name: 'Creativity',
      min: 0,
      max: 24,
      step: 1,
    },
    {
      schema: 'vari',
      name: 'Variety',
      min: 0,
      max: 24,
      step: 1,
    },
    {
      schema: 'miss',
      name: 'Miss',
      min: 0,
      step: 1,
    },
  ] as const
  const tallyDefMap = new Map(tallyDefinitions.map(d => [d.schema, d]))
  type TallySchema = typeof tallyDefinitions[number]['schema']
  const id = 'P'
  return {
    id,
    name: 'Presentation',
    markDefinitions,
    tallyDefinitions,
    calculateTally: scsh => {
      if (!matchMeta(scsh.meta, { judgeTypeId: id })) throw new RSRWrongJudgeTypeError(scsh.meta.judgeTypeId, id)
      const marks = filterMarkStream(scsh.marks)
      const tally: Required<ScoreTally<TallySchema>> = {
        ent: 12,
        form: 12,
        music: 12,
        crea: 12,
        vari: 12,
        miss: 0,
      }

      const stageOneMarks = ['miss', ...components.flatMap(c => [`${c}Plus`, `${c}Minus`])]

      for (const mark of marks) {
        if (stageOneMarks.includes(mark.schema)) {
          const sign = mark.schema.endsWith('Minus') ? -1 : 1
          const schema = mark.schema.replace(/(Plus|Minus)$/, '') as TallySchema

          tally[schema] = tally[schema] + ((mark.value ?? 1) * sign)
        }
      }

      for (const field of tallyDefinitions) {
        const v = tally[field.schema]
        if (typeof v !== 'number') continue
        tally[field.schema] = clampNumber(v, field)
      }

      const stageTwoMarks = components.flatMap(c => [`${c}PlusAdj`, `${c}MinusAdj`])

      for (const mark of marks) {
        if (stageTwoMarks.includes(mark.schema)) {
          const sign = mark.schema.endsWith('MinusAdj') ? -1 : 1
          const schema = mark.schema.replace(/(Plus|Minus)Adj$/, '') as TallySchema
          const field = tallyDefMap.get(schema)
          if (field == null) throw new TypeError(`Could not find tally field with schema ${schema} - This error should not occur.`)

          if (sign > 0 && 'max' in field && tally[schema] >= field.max) continue
          if (sign < 0 && 'min' in field && tally[schema] <= field.min) continue

          tally[schema] = tally[schema] + ((mark.value ?? 1) * sign)
        }
      }

      return { meta: scsh.meta, tally }
    },
    calculateJudgeResult: scsh => {
      if (!matchMeta(scsh.meta, { judgeTypeId: id })) throw new RSRWrongJudgeTypeError(scsh.meta.judgeTypeId, id)
      const tally = filterTally(scsh.tally, tallyDefinitions)
      let p = 0

      for (const component of components) {
        let cScore = (tally[component] ?? 12) - (tally.miss ?? 0)
        cScore = clampNumber(cScore, { min: 0, max: 24, step: 1 })

        p += cScore * presWeights[component]
      }
      p = clampNumber(p, { min: 0, max: 24 })

      return {
        meta: scsh.meta,
        result: {
          p,
          nm: tally.miss ?? 0,
        },
        statuses: {},
      }
    },
  }
}

export const technicalJudge: JudgeTypeGetter<Option> = options => {
  const isWH = options.discipline === 'wh'
  const hasInteractions = options.interactions === true

  const maxRq = getRqMax(options)

  const fieldDefinitions = [
    {
      schema: 'timeViolation',
      name: 'Time Violations',
      min: 0,
      max: 2,
      step: 1,
    },
    {
      schema: 'spaceViolation',
      name: 'Space Violations',
      min: 0,
      step: 1,
    },
    {
      schema: 'miss',
      name: 'Misses',
      min: 0,
      step: 1,
    },
    {
      schema: 'break',
      name: 'Breaks',
      min: 0,
      step: 1,
    },

    ...(isWH
      ? [{
          schema: 'rqGymnasticsPower',
          name: 'Power/Gymnastics',
          min: 0,
          max: maxRq.rqGymnasticsPower,
          step: 1,
        }, {
          schema: 'rqMultiples',
          name: 'Multiples',
          min: 0,
          max: maxRq.rqMultiples,
          step: 1,
        }, {
          schema: 'rqRopeManipulation',
          name: 'Rope manipulation',
          min: 0,
          max: maxRq.rqRopeManipulation,
          step: 1,
        }, {
          schema: 'rqInteractions',
          name: 'Partner interactions',
          min: 0,
          max: maxRq.rqInteractions,
          step: 1,
        }]
      : []
    ),

    ...(!isWH && hasInteractions
      ? [{
          schema: 'rqInteractions',
          name: 'Pairs interactions',
          min: 0,
          max: maxRq.rqInteractions,
          step: 1,
        }]
      : []
    ),
  ]
  const id = 'T'
  return {
    id,
    name: 'Technical Judge',
    markDefinitions: fieldDefinitions,
    tallyDefinitions: fieldDefinitions,
    calculateTally: simpleCalculateTallyFactory(id, fieldDefinitions),
    calculateJudgeResult: scsh => {
      if (!matchMeta(scsh.meta, { judgeTypeId: id })) throw new RSRWrongJudgeTypeError(scsh.meta.judgeTypeId, id)
      const tally = filterTally(scsh.tally, fieldDefinitions)
      return {
        meta: scsh.meta,
        result: {
          nm: tally.miss ?? 0,
          nb: tally.break ?? 0,
          nv: (tally.timeViolation ?? 0) + (tally.spaceViolation ?? 0),

          ...(isWH
            ? {
                aqP: clampNumber(maxRq.rqGymnasticsPower - (tally.rqGymnasticsPower ?? 0), { min: 0 }),
                aqM: clampNumber(maxRq.rqMultiples - (tally.rqMultiples ?? 0), { min: 0 }),
                aqR: clampNumber(maxRq.rqRopeManipulation - (tally.rqRopeManipulation ?? 0), { min: 0 }),
                aqI: clampNumber(maxRq.rqInteractions - (tally.rqInteractions ?? 0), { min: 0 }),
              }
            : {}
          ),

          ...(!isWH && hasInteractions
            ? {
                aqI: clampNumber(maxRq.rqInteractions - (scsh.tally.rqInteractions ?? 0), { min: 0 }),
              }
            : {}
          ),
        },
        statuses: {},
      }
    },
  }
}

export const difficultyJudgeFactory: (id: string, name: string) => JudgeTypeGetter<Option> = (id, name) => options => {
  const maxRq = getRqMax(options)
  const isWH = options.discipline === 'wh'

  const fieldDefinitions = [
    {
      name: 'Level 0.5',
      schema: 'diffL0.5',
      min: 0,
      step: 1,
    },
    ...Array(8).fill(undefined).map((el, idx) => ({
      name: `Level ${idx + 1}`,
      schema: `diffL${idx + 1}` as const,
      min: 0,
      step: 1,
    })),

    // Not used in any math, just for tracking
    {
      name: 'Repeated Skills',
      schema: 'rep',
      min: 0,
      step: 1,
    },
  ] as const
  const levels: Record<string, number> = Object.fromEntries(Array(8).fill(undefined).map((el, idx) => [`diffL${idx + 1}`, idx + 1] as const))
  levels['diffL0.5'] = 0.5
  return {
    id,
    name,
    markDefinitions: fieldDefinitions,
    tallyDefinitions: fieldDefinitions,
    calculateTally: simpleCalculateTallyFactory<string>(id, fieldDefinitions),
    calculateJudgeResult: scsh => {
      if (!matchMeta(scsh.meta, { judgeTypeId: id })) throw new RSRWrongJudgeTypeError(scsh.meta.judgeTypeId, id)
      const tally = filterTally(scsh.tally, fieldDefinitions)
      const d = fieldDefinitions.filter(f => f.schema !== 'rep').map(f => (tally[f.schema] ?? 0) * L(levels[f.schema])).reduce((a, b) => a + b)
      return {
        meta: scsh.meta,
        result: {
          d,

          ...(isWH
            ? {}
            : {
                aqP: clampNumber(maxRq.rqGymnasticsPower - (tally.rqGymnasticsPower ?? 0), { min: 0 }),
                aqM: clampNumber(maxRq.rqMultiples - (tally.rqMultiples ?? 0), { min: 0 }),
                aqR: clampNumber(maxRq.rqRopeManipulation - (tally.rqRopeManipulation ?? 0), { min: 0 }),
              }
          ),
        },
        statuses: {},
      }
    },
  }
}

// ======
// TABLES
// ======
export const freestylePreviewTableHeaders: TableDefinition = {
  headers: [
    { text: 'Diff (D)', key: 'D', formatter: roundToCurry(2) },
    { text: 'Pres (P)', key: 'P', formatter: formatFactor },
    { text: 'Req. El (Q)', key: 'Q', formatter: formatFactor },
    { text: 'Deduc (M)', key: 'M', formatter: formatFactor },
    { text: 'Result (R)', key: 'R', formatter: roundToCurry(2) },
  ],
}

export const freestyleResultTableHeaders: TableDefinition = {
  headers: [
    { text: 'Diff', key: 'D', color: 'gray', formatter: roundToCurry(2) },
    { text: 'Pres', key: 'P', color: 'gray', formatter: formatFactor },
    { text: 'Req. El', key: 'Q', color: 'gray', formatter: formatFactor },
    { text: 'Deduc', key: 'M', color: 'gray', formatter: formatFactor },

    { text: 'Score', key: 'R', formatter: roundToCurry(2), primary: 'score' },
    { text: 'Rank', key: 'S', color: 'red', primary: 'rank' },
  ],
}

export default {
  id: 'ijru.freestyle.sr@4.0.0',
  name: 'IJRU Single Rope Freestyle v4.0.0',
  options: [
    { id: 'discipline', name: 'Discipline', type: 'enum', enum: ['sr', 'dd', 'wh', 'ts', 'xd'] },
    { id: 'interactions', name: 'Has Interactions', type: 'boolean' },
    { id: 'maxRqGymnasticsPower', name: 'Power/Gymnastics Required Elements', type: 'number', min: 0, step: 1 },
    { id: 'maxRqMultiples', name: 'Multiples Required Elements', type: 'number', min: 0, step: 1 },
    { id: 'maxRqRopeManipulation', name: 'Rope Manipulation Required Elements', type: 'number', min: 0, step: 1 },
    { id: 'maxRqInteractions', name: 'Interactions Required Elements', type: 'number', min: 0, step: 1 },
  ],
  judges: [presentationJudge, technicalJudge, difficultyJudgeFactory('Dp', 'Difficulty - Power and Gymnastics'), difficultyJudgeFactory('Dm', 'Difficulty - Multiples'), difficultyJudgeFactory('Dr', 'Difficulty - Rope Manipulation')],

  calculateEntry (meta, res, options) {
    const results = res.filter(r => matchMeta(r.meta, meta))
    if (!results.length) return

    const raw: Record<string, number> = {}

    // for (const scoreType of ['D', 'aF', 'aE', 'aM', 'm', 'v', 'Q'] as const) {
    //   const scores = results.map(el => el.result[scoreType]).filter(el => typeof el === 'number')
    //   if (['m', 'v'].includes(scoreType)) raw[scoreType] = roundTo(ijruAverage(scores), 4)
    //   else if (['aF', 'aE', 'aM'].includes(scoreType)) raw[scoreType] = roundTo(ijruAverage(scores), 6)
    //   else raw[scoreType] = roundTo(ijruAverage(scores), 2) // D, Q

    //   if (typeof raw[scoreType] !== 'number' || isNaN(Number(raw[scoreType]))) raw[scoreType] = (['D', 'aF', 'aE', 'aM'].includes(scoreType) ? 0 : 1)
    //   if (scoreType === 'aM' && noMusic) raw[scoreType] = 0
    // }

    // raw.M = roundTo(-(1 - raw.m - raw.v), 2) // the minus is because they're already prepped to 1- and that needs to be reversed

    // raw.P = roundTo(1 + (raw.aE + raw.aF + raw.aM), 2)

    // raw.R = roundTo(raw.D * raw.P * raw.M * raw.Q, 2)
    // raw.R = raw.R < 0 ? 0 : raw.R

    return {
      meta,
      result: raw,
      statuses: {},
    }
  },
  rankEntries (res, options) {
    let results = [...res]
    // const tiePriority = ['R', 'M', 'Q', 'P', 'D'] as const
    results.sort(function (a, b) {
      if (a.result.R !== b.result.R) return (b.result.R ?? 0) - (a.result.R ?? 0) // descending 100 wins over 50
      if (a.result.M !== b.result.M) return (b.result.M ?? 1) - (a.result.M ?? 1) // descending *1 wins over *.9
      if (a.result.Q !== b.result.Q) return (b.result.Q ?? 1) - (a.result.Q ?? 1) // descending *1 wins over *.9
      if (a.result.P !== b.result.P) return (b.result.P ?? 1) - (a.result.P ?? 1) // descending 1.35 wins over 0.95
      if (a.result.D !== b.result.D) return (b.result.D ?? 0) - (a.result.D ?? 0) // descending 100 wins over 50
      return 0
    })

    const high = results.length > 0 ? results[0].result.R ?? 0 : 0
    const low = results.length > 1 ? results[results.length - 1].result.R ?? 0 : 0

    results = results.map((el, idx, arr) => ({
      ...el,
      result: {
        ...el.result,
        S: arr.findIndex(score =>
          score.result.R === el.result.R &&
          score.result.M === el.result.M &&
          score.result.Q === el.result.Q &&
          score.result.P === el.result.P &&
          score.result.D === el.result.D
        ) + 1,
        N: roundTo((((100 - 1) * ((el.result.R ?? 0) - low)) / ((high - low) !== 0 ? high - low : 1)) + 1, 2),
      },
    }))

    return results
  },

  previewTable: options => freestylePreviewTableHeaders,
  resultTable: options => freestyleResultTableHeaders,
} satisfies CompetitionEventModel<Option>