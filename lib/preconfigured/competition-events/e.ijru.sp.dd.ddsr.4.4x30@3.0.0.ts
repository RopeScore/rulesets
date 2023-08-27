import ijruSpeed300 from '../../models/competition-events/ijru.speed@3.0.0'
import { partiallyConfigureCompetitionEventModel } from '../types'

export default partiallyConfigureCompetitionEventModel(ijruSpeed300, {
  options: {
    falseSwitches: 3
  },
  id: 'e.ijru.sp.dd.ddsr.4.4x30@3.0.0',
  name: 'Double Dutch Speed Relay'
})