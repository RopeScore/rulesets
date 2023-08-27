import ijruFreestyle300 from '../../models/competition-events/ijru.freestyle@3.0.0'
import { partiallyConfigureCompetitionEventModel } from '../types'

export default partiallyConfigureCompetitionEventModel(ijruFreestyle300, {
  options: {
    discipline: 'wh',
    interactions: false
  },
  id: 'e.ijru.fs.wh.whpf.2.75@3.0.0',
  name: 'Wheel Pair Freestyle'
})
