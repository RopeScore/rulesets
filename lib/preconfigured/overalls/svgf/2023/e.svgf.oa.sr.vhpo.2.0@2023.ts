import svgfVhOverall2023 from '../../../../models/overalls/svgf-vh.overall@2023.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(svgfVhOverall2023, {
  options: {},
  competitionEventOptions: {
    'e.svgf.sp.sr.srps.2.2x30@2023': { name: 'Single Rope Pair Speed' },
    'e.svgf.sp.sr.srpe.2.2x60@2023': { name: 'Single Rope Pair Endurance' },
    'e.svgf.sp.sr.srdp.2.2x30@2023': { name: 'Single Rope Double Unders Pair' },
    'e.svgf.fs.sr.srpf-vh.2.75@2023': { name: 'Single Rope Pair Freestyle' },
  },
  id: 'e.svgf.oa.sr.vhpo.2.0@2023',
  name: 'Par Overall',
})
