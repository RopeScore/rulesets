import svgfRhOverall2025 from '../../../../models/overalls/svgf-rh.overall@2025.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(svgfRhOverall2025, {
  options: {},
  competitionEventOptions: {
    'e.ijru.sp.sr.srss.1.30@1.0.0': { name: 'Single Rope Speed Sprint' },
    'e.ijru.sp.sr.srse.1.180@1.0.0': { name: 'Single Rope Speed Endurance' },
    'e.svgf.fs.sr.srif-rh.1.75@2025': { name: 'Single Rope Individual Freestyle' },
  },
  id: 'e.svgf.oa.sr.isro-rh.1.0@2025',
  name: 'Individuell Overall',
})
