import ijruSpeed300 from '../../models/competition-events/ijru.speed@3.0.0'
import { partiallyConfigureCompetitionEventModel } from '../types'

export default partiallyConfigureCompetitionEventModel(ijruSpeed300, {
  options: {
    falseSwitches: 0
  },
  id: 'e.ijru.sp.dd.ddss.3.60@3.0.0',
  name: 'Double Dutch Speed Sprint'
})
