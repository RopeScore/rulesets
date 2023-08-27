import ijruSpeed300 from '../../models/competition-events/ijru.speed@3.0.0'
import { partiallyConfigureCompetitionEventModel } from '../types'

export default partiallyConfigureCompetitionEventModel(ijruSpeed300, {
  options: {
    falseSwitches: 1
  },
  id: 'e.ijru.sp.sr.srdr.2.2x30@3.0.0',
  name: 'Single Rope Double Unders Relay'
})