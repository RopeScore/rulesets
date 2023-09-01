import ijruSpeed300 from '../../../../models/competition-events/ijru.speed@1.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruSpeed300, {
  options: {
    falseSwitches: 0
  },
  id: 'e.ijru.sp.dd.ddss.3.60@3.0.0',
  name: 'Double Dutch Speed Sprint'
})
