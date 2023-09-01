import ijruOverall100 from '../../../../models/overalls/ijru.overall@1.0.0.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(ijruOverall100, {
  options: {},
  competitionEventOptions: {
    'e.ijru.sp.sr.srdr.2.2x30': { name: 'Single Rope Double Unders Relay' },
    'e.ijru.sp.sr.srsr.4.4x30': { name: 'Single Rope Speed Relay' },
    'e.ijru.fs.sr.srpf.2.75': { name: 'Single Rope Pair Freestyle' },
    'e.ijru.fs.sr.srtf.4.75': { name: 'Single Rope Team Freestyle' }
  },
  id: 'e.ijru.oa.sr.tsro.4.0@3.0.0',
  name: 'Team Single Rope Overall'
})
