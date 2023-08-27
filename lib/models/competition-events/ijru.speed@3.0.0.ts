import { calculateTally, roundTo } from '../../helpers.js'
import type { CompetitionEventModel, JudgeTypeGetter, ScoreTally, TableDefinition } from '../types.js'
import { ijruAverage } from './ijru.freestyle@3.0.0.js'

type Option = 'falseSwitches'

// deduc
const SpeedDed = 10

// ======
// JUDGES
// ======
export const speedJudge: JudgeTypeGetter<string, Option> = options => {
  const fieldDefinitions = [{
    schema: 'step',
    name: 'Score',
    min: 0,
    step: 1
  }] as const
  const id = 'S'
  return {
    id,
    name: 'Speed',
    fieldDefinitions,
    calculateScoresheet: scsh => {
      const tally: ScoreTally<(typeof fieldDefinitions)[number]['schema']> = calculateTally(scsh, fieldDefinitions)
      return {
        judgeTypeId: id,
        judgeId: scsh.judgeId,
        result: {
          a: tally.step ?? 0
        }
      }
    }
  }
}

export const speedHeadJudge: JudgeTypeGetter<string, Option> = options => {
  const falseSwitches = Number.isSafeInteger(options.falseSwitches) && options.falseSwitches as number > 0 ? options.falseSwitches as number : undefined
  const fieldDefinitions = [
    {
      schema: 'step',
      name: 'Score',
      min: 0,
      step: 1
    },
    {
      schema: 'falseStart',
      name: 'False Start',
      min: 0,
      max: 1,
      step: 1
    },
    ...(falseSwitches != null
      ? [{
          schema: 'falseSwitch',
          name: 'False Switches',
          min: 0,
          max: falseSwitches,
          step: 1
        }]
      : [])
  ] as const
  const id = 'Shj'
  return {
    id,
    name: 'Speed Head Judge',
    fieldDefinitions,
    calculateScoresheet: scsh => {
      const tally: ScoreTally<(typeof fieldDefinitions)[number]['schema']> = calculateTally(scsh, fieldDefinitions)
      return {
        judgeTypeId: id,
        judgeId: scsh.judgeId,
        result: {
          a: tally.step ?? 0,
          m: ((tally.falseStart ?? 0) + (tally.falseSwitch ?? 0)) * SpeedDed
        }
      }
    }
  }
}

// ======
// TABLES
// ======
export const speedPreviewTableHeaders: TableDefinition = {
  headers: [
    { text: 'Steps (a)', key: 'a' },
    { text: 'Deduc (m)', key: 'm' },
    { text: 'Result (R)', key: 'R' },

    { text: 'Reskip Allowed', key: 'withinThree', formatter: (n) => n === 1 ? 'No' : 'Yes' }
  ]
}

export const speedResultTableHeaders: TableDefinition = {
  headers: [
    { text: 'Score', key: 'R' },
    { text: 'Rank', key: 'S', color: 'red' }
  ]
}

export default {
  id: 'ijru.speed@3.0.0',
  name: 'IJRU Speed v3.0.0',
  options: [
    { id: 'falseSwitches', name: 'False Switches', type: 'number' }
  ],
  judges: [speedJudge, speedHeadJudge],

  calculateEntry (meta, results, options) {
    if (!results.length) return

    // Calc a
    const as = results.map(res => res.result.a).filter(a => typeof a === 'number')
    const a = ijruAverage(as) ?? 0

    // Calc m
    const ms = results.map(res => res.result.m).filter(m => typeof m === 'number')
    const m = ijruAverage(ms) ?? 0

    // calc withinThree
    const minDiff = Math.min(...results
      .map(res => res.result.a)
      .sort((a, b) => a - b)
      .flatMap((res, idx, arr) => arr[idx + 1] - res)
      .filter(n => !Number.isNaN(n)))
    const withinThree = minDiff <= 3

    return {
      entryId: meta.entryId,
      result: {
        a,
        m,
        R: roundTo(a - m, 2)
      },
      flags: {
        withinThree
      }
    }
  },
  rankEntries (res, options) {
    let results = [...res]
    results.sort(function (a, b) {
      return (b.result.R ?? 0) - (a.result.R ?? 0) // sort descending
    })

    const high = results.length > 0 ? results[0].result.R ?? 0 : 0
    const low = results.length > 1 ? results[results.length - 1].result.R ?? 0 : 0

    results = results.map((el, _, arr) => ({
      ...el,
      result: {
        ...el.result,
        S: arr.findIndex(obj => obj.result.R === el.result.R) + 1,
        N: roundTo((((100 - 1) * ((el.result.R ?? 0) - low)) / ((high - low !== 0) ? high - low : 1)) + 1, 2)
      }
    }))

    return results
  },

  previewTable: options => speedPreviewTableHeaders,
  resultTable: options => speedResultTableHeaders
} satisfies CompetitionEventModel<string, Option>
