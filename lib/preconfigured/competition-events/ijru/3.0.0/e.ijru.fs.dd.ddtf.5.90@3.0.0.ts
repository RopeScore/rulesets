import ijruFreestyle300 from '../../../../models/competition-events/ijru.freestyle@3.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruFreestyle300, {
  options: {
    discipline: 'dd',
    interactions: true
  },
  id: 'e.ijru.fs.dd.ddtf.5.90@3.0.0',
  name: 'Double Dutch Triad Freestyle'
})
