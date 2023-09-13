import { RSRWrongJudgeTypeError } from '../../errors.js'
import { calculateTally, matchMeta, roundTo, roundToCurry } from '../../helpers.js'
import type { CompetitionEventModel, JudgeTypeGetter, ScoreTally, TableDefinition } from '../types.js'
import { average } from './svgf-vh.speed@2023.js'

type Option = never

// ======
// JUDGES
// ======
export const timingJudge: JudgeTypeGetter<string, Option> = options => {
  const fieldDefinitions = [{
    schema: 'seconds',
    name: 'Seconds',
    min: 0,
    step: 1
  }] as const
  const id = 'T'
  return {
    id,
    name: 'Timing',
    fieldDefinitions,
    calculateScoresheet: scsh => {
      if (!matchMeta(scsh.meta, { judgeTypeId: id })) throw new RSRWrongJudgeTypeError(scsh.meta.judgeTypeId, id)
      const tally: ScoreTally<(typeof fieldDefinitions)[number]['schema']> = calculateTally(scsh, fieldDefinitions)
      return {
        meta: scsh.meta,
        result: {
          a: tally.seconds ?? Infinity
        },
        statuses: {}
      }
    }
  }
}

// ======
// TABLES
// ======
export const timingPreviewTableHeaders: TableDefinition = {
  headers: [
    { text: 'Seconds (t)', key: 't', formatter: roundToCurry(2) },
    { text: 'Result (R)', key: 'R' }
  ]
}

export const timingResultTableHeaders: TableDefinition = {
  headers: [
    { text: 'Seconds', key: 'R', primary: 'score' },
    { text: 'Rank', key: 'S', color: 'red', primary: 'rank' }
  ]
}

export default {
  id: 'svgf-vh.timing@2023',
  name: 'SvGF Vikingahoppet Timing 2023',
  options: [],
  judges: [timingJudge],

  calculateEntry (meta, res, options) {
    const results = res.filter(r => matchMeta(r.meta, meta))
    if (!results.length) return

    // Calc t
    const ts = results.map(res => res.result.t).filter(t => typeof t === 'number')
    const t = average(ts) ?? 0

    return {
      meta,
      result: {
        t,
        R: roundTo(t, 2)
      },
      statuses: {}
    }
  },
  rankEntries (res, options) {
    let results = [...res]
    results.sort(function (a, b) {
      return (a.result.R ?? 0) - (b.result.R ?? 0) // sort ascending
    })

    results = results.map((el, _, arr) => ({
      ...el,
      result: {
        ...el.result,
        S: arr.findIndex(obj => obj.result.R === el.result.R) + 1
      }
    }))

    return results
  },

  previewTable: options => timingPreviewTableHeaders,
  resultTable: options => timingResultTableHeaders
} satisfies CompetitionEventModel<string, Option>
