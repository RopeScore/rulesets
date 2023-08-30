import ijruSpeed300 from '../../models/competition-events/ijru.speed@3.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../types.js'

export default partiallyConfigureCompetitionEventModel(ijruSpeed300, {
  options: {
    falseSwitches: 0
  },
  id: 'e.ijru.sp.sr.srss.1.30@3.0.0',
  name: 'Single Rope Speed Sprint'
})
