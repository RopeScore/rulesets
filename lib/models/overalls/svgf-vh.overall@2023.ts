import { type CompetitionEventDefinition } from '../../preconfigured/types.js'
import { type TableHeaderGroup, type OverallModel, type TableDefinitionGetter, type TableHeader, type EntryResult } from '../types.js'

type Option = never
type CompetitionEventOptions = 'name'

export const overallTableFactory: TableDefinitionGetter<Option, CompetitionEventOptions> = (options, cEvtOptions) => {
  if (cEvtOptions == null) throw new TypeError('Missing competitionEventOptions argument')
  const groups: TableHeaderGroup[][] = []
  const cEvtDefs = Object.keys(cEvtOptions) as CompetitionEventDefinition[]

  const srEvts = cEvtDefs
    .filter(cEvt => cEvt.split('.')[3] === 'sr')
  const srEvtCols = srEvts.length * 2
  const ddEvts = cEvtDefs
    .filter(cEvt => cEvt.split('.')[3] === 'dd')
  const ddEvtCols = ddEvts.length * 2

  const disciplineGroup: TableHeaderGroup[] = []

  if (srEvtCols) {
    disciplineGroup.push({
      text: 'Single Rope',
      key: 'sr',
      colspan: srEvtCols
    })
  }

  if (ddEvtCols) {
    disciplineGroup.push({
      text: 'Double Dutch',
      key: 'dd',
      colspan: ddEvtCols
    })
  }

  disciplineGroup.push({
    text: 'Overall',
    key: 'oa',
    colspan: 2,
    rowspan: 2
  })

  groups.push(disciplineGroup)

  const evtGroup: TableHeaderGroup[] = []

  for (const cEvt of [...srEvts, ...ddEvts]) {
    evtGroup.push({
      text: typeof cEvtOptions[cEvt].name === 'string' ? (cEvtOptions[cEvt].name as string).replace(/^(Wheel|Single Rope) /, '') : cEvt.split('.')[4] ?? '',
      key: cEvt,
      colspan: 2
    })
  }

  groups.push(evtGroup)

  const headers: TableHeader[] = []

  for (const cEvt of [...srEvts, ...ddEvts]) {
    const isSp = cEvt.split('.')[2] === 'sp'
    if (isSp) {
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
    } else {
      headers.push({
        text: 'Rank Sum',
        key: 'T',
        component: cEvt
      }, {
        text: 'Rank',
        key: 'S',
        component: cEvt,
        color: 'red'
      })
    }
  }

  headers.push({
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
  id: 'svgf-vh.overall@2023',
  name: 'SvGF Vikingahoppet Overall 2023',
  options: [],
  competitionEventOptions: [
    { id: 'name', name: 'Name', type: 'string' }
  ],
  resultTable: overallTableFactory,
  rankOverall (results, options, competitionEventOptions) {
    const components: Partial<Record<CompetitionEventDefinition, Readonly<EntryResult[]>>> = {}
    const competitionEventIds: CompetitionEventDefinition[] = Object.keys(competitionEventOptions) as CompetitionEventDefinition[]

    for (const cEvtDef of competitionEventIds) {
      const ranked = results.filter(result => result.meta.competitionEvent === cEvtDef)
      components[cEvtDef] = ranked
    }

    const participantIds = [...new Set(results.map(r => r.meta.participantId))]

    const ranked = participantIds.map(participantId => {
      const cRes = competitionEventIds
        .map((cEvt) => components[cEvt]?.find(r => r.meta.participantId === participantId))
        .filter(r => !!r) as EntryResult[]

      const T = cRes.reduce((acc, curr) => acc + (curr.result.S ?? 0), 0)

      return {
        meta: { participantId },
        result: { T, S: 0 },
        componentResults: Object.fromEntries(cRes.map(r => [r.meta.competitionEvent, r])),
        statuses: {}
      }
    })

    ranked.sort((a, b) => {
      return a.result.T - b.result.T
    })

    for (let idx = 0; idx < ranked.length; idx++) {
      ranked[idx].result.S = ranked.findIndex(obj => obj.result.T === ranked[idx].result.T) + 1
    }

    return ranked
  }
} satisfies OverallModel<Option, CompetitionEventOptions>
