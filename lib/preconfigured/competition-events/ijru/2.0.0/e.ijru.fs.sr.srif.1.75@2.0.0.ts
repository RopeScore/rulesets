import ijruFreestyle200 from '../../../../models/competition-events/ijru.freestyle@2.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruFreestyle200, {
  options: {
    discipline: 'sr',
    interactions: false,
  },
  id: 'e.ijru.fs.sr.srif.1.75@2.0.0',
  name: 'Single Rope Individual Freestyle',
})
