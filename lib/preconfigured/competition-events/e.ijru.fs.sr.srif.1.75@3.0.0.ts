import ijruFreestyle300 from '../../models/competition-events/ijru.freestyle@3.0.0'
import { partiallyConfigureCompetitionEventModel } from '../types'

export default partiallyConfigureCompetitionEventModel(ijruFreestyle300, {
  options: {
    discipline: 'sr',
    interactions: false
  },
  id: 'e.ijru.fs.sr.srif.1.75@3.0.0',
  name: 'Single Rope Individual Freestyle'
})
