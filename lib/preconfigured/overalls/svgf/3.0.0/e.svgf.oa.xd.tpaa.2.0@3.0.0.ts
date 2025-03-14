import svgfParOverall200 from '../../../../models/overalls/svgf-par.overall@2.0.0.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(svgfParOverall200, {
  options: {},
  competitionEventOptions: {
    'e.svgf.sp.sr.srps.2.2x30@2.0.0': { name: 'Single Rope Pair Speed' },
    'e.svgf.sp.sr.srpe.2.2x90@2.0.0': { name: 'Single Rope Pair Speed Endurance' },
    'e.ijru.sp.sr.srdr.2.2x30@1.0.0': { name: 'Single Rope Double Unders Relay' },
    'e.svgf.fs.sr.srpf.2.75@3.0.0': { name: 'Single Rope Pair Freestyle', rankMultiplier: 2, normalisationMultiplier: 2 },
  },
  id: 'e.svgf.oa.xd.tpaa.2.0@3.0.0',
  name: 'Pair Overall',
})
