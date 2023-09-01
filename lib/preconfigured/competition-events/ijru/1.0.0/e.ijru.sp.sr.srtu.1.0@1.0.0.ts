import ijruSpeed100 from '../../../../models/competition-events/ijru.speed@1.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruSpeed100, {
  options: {
    falseSwitches: 0
  },
  id: 'e.ijru.sp.sr.srtu.1.0@1.0.0',
  name: 'Single Rope Triple Unders'
})