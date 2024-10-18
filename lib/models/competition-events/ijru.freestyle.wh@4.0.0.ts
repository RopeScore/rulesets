import type { CompetitionEventModel } from '../types'
import type { Option } from './ijru.freestyle.sr@4.0.0'
import { default as SR, difficultyJudgeFactory, freestylePreviewTableHeaders, freestyleResultTableHeaders, presentationJudge, technicalJudge } from './ijru.freestyle.sr@4.0.0'

export default {
  id: 'ijru.freestyle.wh@4.0.0',
  name: 'IJRU Wheel Freestyle v4.0.0',
  options: [
    { id: 'discipline', name: 'Discipline', type: 'enum', enum: ['wh'] },
    { id: 'interactions', name: 'Has Interactions', type: 'boolean' },
    { id: 'maxRqGymnasticsPower', name: 'Power/Gymnastics Required Elements', type: 'number', min: 0, step: 1 },
    { id: 'maxRqMultiples', name: 'Multiples Required Elements', type: 'number', min: 0, step: 1 },
    { id: 'maxRqRopeManipulation', name: 'Rope Manipulation Required Elements', type: 'number', min: 0, step: 1 },
    { id: 'maxRqInteractions', name: 'Interactions Required Elements', type: 'number', min: 0, step: 1 },
  ],
  judges: [presentationJudge, technicalJudge, difficultyJudgeFactory('Da', 'Difficulty - Athlete A'), difficultyJudgeFactory('Db', 'Difficulty - Athlete B')],

  calculateEntry: SR.calculateEntry,
  rankEntries: SR.rankEntries,

  previewTable: options => freestylePreviewTableHeaders(options),
  resultTable: options => freestyleResultTableHeaders,
} satisfies CompetitionEventModel<Option>
