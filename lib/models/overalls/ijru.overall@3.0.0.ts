import { roundTo, roundToCurry } from '../../helpers.js'
import { type CompetitionEventDefinition } from '../../preconfigured/types.js'
import { type TableHeaderGroup, type OverallModel, type TableDefinitionGetter, type TableHeader, type EntryResult } from '../types.js'

type Option = never
type CompetitionEventOptions = 'name' | 'rankMultiplier' | 'resultMultiplier' | 'normalisationMultiplier'

export const overallTableFactory: TableDefinitionGetter<Option, CompetitionEventOptions> = (options, cEvtOptions) => {
  if (cEvtOptions == null) throw new TypeError('Missing competitionEventOptions argument')
  const groups: TableHeaderGroup[][] = []
  const cEvtDefs = Object.keys(cEvtOptions) as CompetitionEventDefinition[]

  const srEvts = cEvtDefs.filter(cEvt => cEvt.split('.')[3] === 'sr')
  const ddEvts = cEvtDefs.filter(cEvt => cEvt.split('.')[3] === 'dd')

  const disciplineGroup: TableHeaderGroup[] = []

  if (srEvts.length) {
    disciplineGroup.push({
      text: 'Single Rope',
      key: 'sr',
      colspan: srEvts.length * 2
    })
  }

  if (ddEvts.length) {
    disciplineGroup.push({
      text: 'Double Dutch',
      key: 'dd',
      colspan: ddEvts.length * 2
    })
  }

  disciplineGroup.push({
    text: 'Overall',
    key: 'oa',
    colspan: 3,
    rowspan: 2
  })

  groups.push(disciplineGroup)

  const evtGroup: TableHeaderGroup[] = []

  for (const cEvt of [...srEvts, ...ddEvts]) {
    evtGroup.push({
      text: typeof cEvtOptions[cEvt].name === 'string' ? (cEvtOptions[cEvt].name as string).replace(/^(Double Dutch|Single Rope) /, '') : '',
      key: cEvt,
      colspan: 2
    })
  }

  groups.push(evtGroup)

  const headers: TableHeader[] = []

  for (const cEvt of [...srEvts, ...ddEvts]) {
    headers.push({
      text: 'Score',
      key: 'R',
      component: cEvt
    }, {
      text: 'Rank',
      key: 'S',
      component: cEvt,
      color: 'red'
    })
  }

  headers.push({
    text: 'Normalised',
    key: 'B',
    color: 'gray',
    formatter: roundToCurry(2)
  }, {
    text: 'Rank Sum',
    key: 'T',
    color: 'green'
  }, {
    text: 'Rank',
    key: 'S',
    color: 'red'
  })

  return {
    groups,
    headers
  }
}

export default {
  id: 'ijru.overall@3.0.0',
  name: 'IJRU Overall',
  options: [],
  competitionEventOptions: [
    { id: 'name', name: 'Name', type: 'string' },
    { id: 'rankMultiplier', name: 'Rank Multiplier', type: 'number' },
    { id: 'resultMultiplier', name: 'Result Multiplier', type: 'number' },
    { id: 'normalisationMultiplier', name: 'Normalisation Multiplier', type: 'number' }
  ],
  resultTable: overallTableFactory,
  rankOverall (results, options, competitionEventOptions) {
    const components: Partial<Record<CompetitionEventDefinition, EntryResult[]>> = {}
    const competitionEventIds = Object.keys(competitionEventOptions) as CompetitionEventDefinition[]

    const participantIds = [...new Set(results.map(r => r.meta.participantId))]

    const ranked = participantIds.map(participantId => {
      const cRes = competitionEventIds
        .map((cEvt) => components[cEvt]?.find(r => r.meta.participantId === participantId))
        .filter(r => !!r) as EntryResult[]

      const R = roundTo(cRes.reduce((acc, curr) =>
        acc + (
          (curr.result.R ?? 0) *
        (Number.isInteger(competitionEventOptions[curr.meta.competitionEvent]?.resultMultiplier) ? competitionEventOptions[curr.meta.competitionEvent]?.resultMultiplier as number : 1)
        )
      , 0), 4)
      const T = cRes.reduce((acc, curr) =>
        acc + (
          (curr.result.S ?? 0) *
        (Number.isInteger(competitionEventOptions[curr.meta.competitionEvent]?.rankMultiplier) ? competitionEventOptions[curr.meta.competitionEvent]?.rankMultiplier as number : 1)
        )
      , 0)
      const B = roundTo(cRes.reduce((acc, curr) =>
        acc + (
          (curr.result.N ?? 0) *
        (Number.isInteger(competitionEventOptions[curr.meta.competitionEvent]?.normalisationMultiplier) ? competitionEventOptions[curr.meta.competitionEvent]?.normalisationMultiplier as number : 1)
        )
      , 0), 2)

      return {
        meta: { participantId },
        result: { R, T, B, S: 0 },
        componentResults: Object.fromEntries(cRes.map(r => [r.meta.competitionEvent, r])),
        statuses: {}
      }
    })

    ranked.sort((a, b) => {
      if (a.result.T !== b.result.T) return a.result.T - b.result.T
      return b.result.B - a.result.B
    })

    for (let idx = 0; idx < ranked.length; idx++) {
      ranked[idx].result.S = ranked.findIndex(obj => obj.result.B === ranked[idx].result.B) + 1
    }

    return ranked
  }
} satisfies OverallModel<Option, CompetitionEventOptions>
