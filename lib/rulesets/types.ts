import type { CompetitionEventModel, OverallModel } from '../models/types.js'
import type { Overall, CompetitionEvent } from '../preconfigured/types.js'

export interface Ruleset {
  id: string
  name: string
  competitionEvents: CompetitionEvent[]
  overalls: Overall[]
  competitionEventModels: CompetitionEventModel[]
  overallModels: OverallModel[]
}
