import svgfParOverall200 from '../../../../models/overalls/svgf-par.overall@2.0.0.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(svgfParOverall200, {
  options: {},
  competitionEventOptions: {
    'e.ijru.sp.sr.srss.1.30@1.0.0': { name: 'Single Rope Speed Sprint' },
    'e.ijru.sp.sr.srse.1.180@1.0.0': { name: 'Single Rope Speed Endurance' },
    'e.svgf.fs.sr.srif-rh.1.75@2020': { name: 'Single Rope Individual Freestyle' }
  },
  id: 'e.ijru.oa.sr.isro-rh.1.0@2020',
  name: 'Individuell Overall'
})
