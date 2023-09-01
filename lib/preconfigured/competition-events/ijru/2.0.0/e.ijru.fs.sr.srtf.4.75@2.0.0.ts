import ijruFreestyle200 from '../../../../models/competition-events/ijru.freestyle@2.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruFreestyle200, {
  options: {
    discipline: 'sr',
    interactions: true
  },
  id: 'e.ijru.fs.sr.srtf.4.75@2.0.0',
  name: 'Single Rope Team Freestyle'
})
