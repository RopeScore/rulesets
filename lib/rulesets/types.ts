import { type Overall, type CompetitionEvent } from '../preconfigured/types.js'

export interface Ruleset {
  id: string
  name: string
  competitionEvents: CompetitionEvent[]
  overalls: Overall[]
}
