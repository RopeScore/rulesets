import svgfParOverall200 from '../../../../models/overalls/svgf-par.overall@2.0.0.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(svgfParOverall200, {
  options: {},
  competitionEventOptions: {
    'e.svgf.sp.sr.srps.2.2x30': { name: 'Single Rope Pair Speed' },
    'e.svgf.sp.sr.srpe.2.2x90': { name: 'Single Rope Pair Speed Endurance' },
    'e.ijru.sp.sr.srdr.2.2x30': { name: 'Single Rope Double Unders Relay' },
    'e.ijru.fs.sr.srpf.2.75': { name: 'Single Rope Pair Freestyle', rankMultiplier: 2, normalisationMultiplier: 2 },
    'e.ijru.fs.wh.whpf.2.75': { name: 'Wheel Pair Freestyle' }
  },
  id: 'e.svgf.oa.xd.tpaa.2.0@2.0.0',
  name: 'Team Pair Overall'
})
