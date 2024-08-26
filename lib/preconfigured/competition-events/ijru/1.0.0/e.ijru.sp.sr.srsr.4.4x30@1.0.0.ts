import ijruSpeed100 from '../../../../models/competition-events/ijru.speed@1.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruSpeed100, {
  options: {
    falseSwitches: 3,
  },
  id: 'e.ijru.sp.sr.srsr.4.4x30@1.0.0',
  name: 'Single Rope Speed Relay',
})
