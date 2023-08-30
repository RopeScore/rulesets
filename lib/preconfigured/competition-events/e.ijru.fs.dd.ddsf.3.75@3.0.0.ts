import ijruFreestyle300 from '../../models/competition-events/ijru.freestyle@3.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../types.js'

export default partiallyConfigureCompetitionEventModel(ijruFreestyle300, {
  options: {
    discipline: 'dd',
    interactions: false
  },
  id: 'e.ijru.fs.dd.ddsf.3.75@3.0.0',
  name: 'Double Dutch Single Freestyle'
})
