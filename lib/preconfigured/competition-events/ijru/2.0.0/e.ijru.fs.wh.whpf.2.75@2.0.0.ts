import ijruFreestyle200 from '../../../../models/competition-events/ijru.freestyle@2.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruFreestyle200, {
  options: {
    discipline: 'wh',
    interactions: true,
  },
  id: 'e.ijru.fs.wh.whpf.2.75@2.0.0',
  name: 'Wheel Pair Freestyle',
})
