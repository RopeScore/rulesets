import ijruFreestyle300 from '../../../../models/competition-events/ijru.freestyle@3.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruFreestyle300, {
  options: {
    discipline: 'sr',
    interactions: true,
  },
  id: 'e.ijru.fs.sr.srtf.4.75@3.0.0',
  name: 'Single Rope Team Freestyle',
})
