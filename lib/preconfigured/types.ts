import { type JudgeTypeGetter, type CompetitionEventModel, type OverallModel } from '../models/types'

export type CompetitionEventDefinition = `e.${string}.${'fs' | 'sp' | 'oa'}.${'sr' | 'dd' | 'wh' | 'ts' | 'xd'}.${string}.${number}.${`${number}x${number}` | number}`

export interface CompetitionEvent extends Omit<CompetitionEventModel, 'id' | 'name'> {
  id: `${CompetitionEventDefinition}@${string}`
  name: string
}

export interface Overall extends OverallModel {}

export interface PartiallyConfigureCompetitionEventModelOptions<Option extends string> {
  id: CompetitionEvent['id']
  name: string
  options: Partial<Record<Option, unknown>>
}
export function partiallyConfigureCompetitionEventModel <Schema extends string, Option extends string> (model: CompetitionEventModel<Schema, Option>, options: PartiallyConfigureCompetitionEventModelOptions<Option>): CompetitionEvent {
  return {
    id: options.id,
    name: options.name,
    options: model.options.filter(o => !(o.id in options.options)),
    judges: model.judges.map(j => ((o: Partial<Record<Option, unknown>>) => j({ ...o, ...options.options })) as JudgeTypeGetter<string>),
    calculateEntry (meta, results, o) {
      return model.calculateEntry(meta, results, { ...o, ...options.options })
    },
    rankEntries (results, o) {
      return model.rankEntries(results, { ...o, ...options.options })
    },
    previewTable (o) {
      return model.previewTable({ ...o, ...options.options })
    },
    resultTable (o) {
      return model.resultTable({ ...o, ...options.options })
    }
  }
}
