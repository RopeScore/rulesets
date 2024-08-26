import svgfRhOverall2020 from '../../../../models/overalls/svgf-rh.overall@2020.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(svgfRhOverall2020, {
  options: {},
  competitionEventOptions: {
    'e.svgf.sp.sr.srps.2.2x30@2.0.0': { name: 'Single Rope Pair Speed' },
    'e.svgf.sp.sr.srpe.2.2x90@2.0.0': { name: 'Single Rope Pair Speed Endurance' },
    'e.ijru.sp.sr.srdr.2.2x30@1.0.0': { name: 'Single Rope Double Unders Relay' },

    'e.svgf.fs.sr.srpf-rh.2.75@2020': { name: 'Single Rope Pair Freestyle', rankMultiplier: 2 },
  },
  id: 'e.svgf.oa.sr.rpaa.2.0@2020',
  name: 'Rikshoppet Par Overall',
})
