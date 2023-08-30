import ijruSpeed300 from '../../../../models/competition-events/ijru.speed@3.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruSpeed300, {
  options: {
    falseSwitches: 3
  },
  id: 'e.ijru.sp.sr.srsr.4.4x30@3.0.0',
  name: 'Single Rope Speed Relay'
})
