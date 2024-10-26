import ijruFreestyleWh400 from '../../../../models/competition-events/ijru.freestyle.wh@4.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruFreestyleWh400, {
  options: {
    interactions: true,
  },
  id: 'e.ijru.fs.wh.whpf.2.75@4.0.0',
  name: 'Wheel Pair Freestyle',
})
