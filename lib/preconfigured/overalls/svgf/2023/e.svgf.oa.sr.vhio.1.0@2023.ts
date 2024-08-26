import svgfVhOverall2023 from '../../../../models/overalls/svgf-vh.overall@2023.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(svgfVhOverall2023, {
  options: {},
  competitionEventOptions: {
    'e.svgf.sp.sr.srss.1.30@2023': { name: 'Single Rope Speed Sprint' },
    'e.svgf.sp.sr.srdu.1.30@2023': { name: 'Single Rope Double Unders' },
    'e.svgf.sp.sr.srse.1.120@2023': { name: 'Single Rope Speed Endurance' },
    'e.svgf.fs.sr.srif-vh.1.75@2023': { name: 'Single Rope Individual Freestyle' },
  },
  id: 'e.svgf.oa.sr.vhio.1.0@2023',
  name: 'Individuell Overall',
})
