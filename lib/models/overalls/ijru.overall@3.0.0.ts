import { roundTo, roundToCurry } from '../../helpers'
import { type TableHeaderGroup, type OverallModel, type TableDefinitionGetter, type TableHeader, type EntryResult } from '../types'

type Option = never

export const overallTableFactory: TableDefinitionGetter<Option> = options => {
  const groups: TableHeaderGroup[][] = []

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
      text: cEvtToName[cEvt].replace(/^(Double Dutch|Single Rope) /, ''),
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
  resultTable: overallTableFactory,
  rankOverall (res) {
    const overallObj = ruleset.overalls[oEvtDef]
    if (!overallObj) throw new TypeError('Invalid Overall Event Definition provided')
    const components: Partial<Record<CompetitionEvent, EntryResult[]>> = {}

    const results = filterParticipatingInAll(res, overallObj.competitionEvents.map(([cEvtDef]) => cEvtDef))
    const participantIds = [...new Set(results.map(r => r.participantId))]

    for (const [cEvtDef] of overallObj.competitionEvents) {
      const eventObj = ruleset.competitionEvents[cEvtDef]
      if (!eventObj) {
        console.warn('Component event', cEvtDef, 'for overall', oEvtDef, 'not found')
        continue
      }
      const ranked = eventObj.rankEntries(results.filter(result => result.competitionEvent === cEvtDef))

      components[cEvtDef] = ranked
    }

    const ranked = participantIds.map(participantId => {
      const cRes = overallObj.competitionEvents
        .map(([cEvt]) => components[cEvt]?.find(r => r.participantId === participantId))
        .filter(r => !!r) as EntryResult[]

      const R = roundTo(cRes.reduce((acc, curr) =>
        acc + (
          (curr.result.R ?? 0) *
        (overallObj.competitionEvents.find(([cEvt]) => cEvt === curr.competitionEvent)?.[1].resultMultiplier ?? 1)
        )
      , 0), 4)
      const T = cRes.reduce((acc, curr) =>
        acc + (
          (curr.result.S ?? 0) *
        (overallObj.competitionEvents.find(([cEvt]) => cEvt === curr.competitionEvent)?.[1].rankMultiplier ?? 1)
        )
      , 0)
      const B = roundTo(cRes.reduce((acc, curr) =>
        acc + (
          (curr.result.N ?? 0) *
        (overallObj.competitionEvents.find(([cEvt]) => cEvt === curr.competitionEvent)?.[1].normalisationMultiplier ?? 1)
        )
      , 0), 2)

      return {
        participantId,
        competitionEvent: oEvtDef,
        result: { R, T, B, S: 0 },
        componentResults: Object.fromEntries(cRes.map(r => [r.competitionEvent, r]))
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
} satisfies OverallModel<Option>
