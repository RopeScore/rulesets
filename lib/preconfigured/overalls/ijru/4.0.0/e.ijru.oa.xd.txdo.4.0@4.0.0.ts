import ijruOverall100 from '../../../../models/overalls/ijru.overall@1.0.0.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(ijruOverall100, {
  options: {},
  competitionEventOptions: {
    'e.ijru.sp.sr.srsr.4.4x30@1.0.0': { name: 'Single Rope Speed Relay' },
    'e.ijru.fs.sr.srtf.4.75@4.0.0': { name: 'Single Rope Team Freestyle' },

    'e.ijru.sp.dd.ddsr.4.4x30@1.0.0': { name: 'Double Dutch Speed Relay' },
    'e.ijru.fs.dd.ddpf.4.75@4.0.0': { name: 'Double Dutch Pair Freestyle' },
  },
  id: 'e.ijru.oa.xd.txdo.4.0@4.0.0',
  name: 'Team Overall',
})
