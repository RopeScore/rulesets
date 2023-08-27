import { type Overall, type CompetitionEvent } from '../preconfigured/types'

export interface Ruleset {
  id: string
  name: string
  competitionEvents: CompetitionEvent[]
  overalls: Overall[]
}
