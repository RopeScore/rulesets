import ijruOverall100 from '../../../../models/overalls/ijru.overall@1.0.0.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(ijruOverall100, {
  options: {},
  competitionEventOptions: {
    'e.ijru.sp.dd.ddss.3.60': { name: 'Double Dutch Speed Sprint' },
    'e.ijru.sp.dd.ddsr.4.4x30': { name: 'Double Dutch Speed Relay' },
    'e.ijru.fs.dd.ddsf.3.75': { name: 'Double Dutch Single Freestyle' },
    'e.ijru.fs.dd.ddpf.4.75': { name: 'Double Dutch Pair Freestyle' }
  },
  id: 'e.ijru.oa.dd.tddo.4.0@3.0.0',
  name: 'Team Double Dutch Overall'
})
