import type { CompetitionEventModel } from '../types'
import type { Option } from './ijru.freestyle.sr@4.0.0'
import { default as SR, calculateEntryFactory, difficultyJudgeFactory, freestylePreviewTableHeadersFactory, freestyleResultTableHeaders, presentationJudge, technicalJudgeFactory } from './ijru.freestyle.sr@4.0.0'

export default {
  id: 'ijru.freestyle.wh@4.0.0',
  name: 'IJRU Wheel Freestyle v4.0.0',
  options: SR.options,
  judges: [presentationJudge, technicalJudgeFactory({ discipline: 'sr' }), difficultyJudgeFactory('Da', 'Difficulty - Athlete A', { discipline: 'sr' }), difficultyJudgeFactory('Db', 'Difficulty - Athlete B', { discipline: 'sr' })],

  calculateEntry: calculateEntryFactory({ discipline: 'wh' }),
  rankEntries: SR.rankEntries,

  previewTable: options => freestylePreviewTableHeadersFactory({ discipline: 'sr' })(options),
  resultTable: options => freestyleResultTableHeaders,
} satisfies CompetitionEventModel<Option>
