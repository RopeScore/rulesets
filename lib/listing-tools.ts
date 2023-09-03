import { type CompetitionEventDefinition } from './preconfigured/types.js'
import { type ModelOption } from './models/types.js'

export interface CompetitionEventModelInfo {
  id: string
  name: string
  options: Readonly<Array<ModelOption<string>>>
  // We can't include fieldDefinitions here since they depend on options
  judges: Readonly<Array<{ id: string, name: string }>>
}

export interface OverallModelInfo {
  id: string
  name: string
  options: Readonly<Array<ModelOption<string>>>
  competitionEventOptions: Readonly<Array<ModelOption<string>>>
}

export interface CompetitionEventInfo extends Omit<CompetitionEventModelInfo, 'id'> {
  id: CompetitionEventDefinition
  modelId: CompetitionEventModelInfo['id']
}

export interface OverallInfo extends Omit<OverallModelInfo, 'id' | 'competitionEventOptions'> {
  id: CompetitionEventDefinition
  modelId: OverallModelInfo['id']
  competitionEvents: Readonly<CompetitionEventDefinition[]>
}

export interface RulesetInfo {
  id: string
  name: string
  competitionEvents: Readonly<CompetitionEventInfo[]>
  overalls: Readonly<OverallInfo[]>
}

export async function listCompetitionEventModels () {
  return (await import('../data/competition-event-models.json', { assert: { type: 'json' } })).default
}
export async function listOverallModels () {
  return (await import('../data/overall-models.json', { assert: { type: 'json' } })).default
}

export async function listPreconfiguredCompetitionEvents () {
  return (await import('../data/competition-events.json', { assert: { type: 'json' } })).default
}
export async function listPreconfiguredOveralls () {
  return (await import('../data/overalls.json', { assert: { type: 'json' } })).default
}

export async function listRulesets () {
  return (await import('../data/rulesets.json', { assert: { type: 'json' } })).default
}
