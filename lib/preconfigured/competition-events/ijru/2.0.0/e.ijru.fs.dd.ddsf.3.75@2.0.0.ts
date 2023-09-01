import ijruFreestyle200 from '../../../../models/competition-events/ijru.freestyle@2.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruFreestyle200, {
  options: {
    discipline: 'dd',
    interactions: false
  },
  id: 'e.ijru.fs.dd.ddsf.3.75@2.0.0',
  name: 'Double Dutch Single Freestyle'
})
