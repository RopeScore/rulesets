import ijruSpeed100 from '../../../../models/competition-events/ijru.speed@1.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruSpeed100, {
  options: {
    falseSwitches: 1,
  },
  id: 'e.ijru.sp.sr.srdr.2.2x30@1.0.0',
  name: 'Single Rope Double Unders Relay',
})
