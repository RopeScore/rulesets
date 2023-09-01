import ijruSpeed100 from '../../../../models/competition-events/ijru.speed@1.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruSpeed100, {
  options: {
    falseSwitches: 3
  },
  id: 'e.svgf.sp.dd.ddsr.4.4x45@2020',
  name: 'Double Dutch Speed Relay'
})
