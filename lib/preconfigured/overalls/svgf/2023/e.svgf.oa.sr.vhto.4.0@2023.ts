import svgfVhOverall2023 from '../../../../models/overalls/svgf-vh.overall@2023.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(svgfVhOverall2023, {
  options: {},
  competitionEventOptions: {
    'e.svgf.sp.sr.srsr.4.4x30@2023': { name: 'Single Rope Speed Relay' },
    'e.svgf.sp.sr.srdr.4.4x30@2023': { name: 'Single Rope Double Unders Relay' },
    'e.svgf.fs.sr.srtf-vh.4.75@2023': { name: 'Single Rope Team Freestyle' },
  },
  id: 'e.svgf.oa.sr.vhto.4.0@2023',
  name: 'Enkelrep Overall',
})
