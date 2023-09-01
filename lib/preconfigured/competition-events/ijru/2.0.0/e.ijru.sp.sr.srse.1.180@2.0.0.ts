import ijruSpeed200 from '../../../../models/competition-events/ijru.speed@2.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruSpeed200, {
  options: {
    falseSwitches: 0
  },
  id: 'e.ijru.sp.sr.srse.1.180@2.0.0',
  name: 'Single Rope Speed Endurance'
})
