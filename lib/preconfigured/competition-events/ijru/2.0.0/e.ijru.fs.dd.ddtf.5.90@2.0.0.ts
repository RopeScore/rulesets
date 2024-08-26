import ijruFreestyle200 from '../../../../models/competition-events/ijru.freestyle@2.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruFreestyle200, {
  options: {
    discipline: 'dd',
    interactions: true,
  },
  id: 'e.ijru.fs.dd.ddtf.5.90@2.0.0',
  name: 'Double Dutch Triad Freestyle',
})
