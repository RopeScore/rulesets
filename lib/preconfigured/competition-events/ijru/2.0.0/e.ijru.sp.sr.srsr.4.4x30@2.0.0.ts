import ijruSpeed200 from '../../../../models/competition-events/ijru.speed@2.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruSpeed200, {
  options: {
    falseSwitches: 3
  },
  id: 'e.ijru.sp.sr.srsr.4.4x30@2.0.0',
  name: 'Single Rope Speed Relay'
})
