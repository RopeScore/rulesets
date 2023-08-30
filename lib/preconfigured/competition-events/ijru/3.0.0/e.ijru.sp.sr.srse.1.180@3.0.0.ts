import ijruSpeed300 from '../../../../models/competition-events/ijru.speed@3.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruSpeed300, {
  options: {
    falseSwitches: 0
  },
  id: 'e.ijru.sp.sr.srse.1.180@3.0.0',
  name: 'Single Rope Speed Endurance'
})