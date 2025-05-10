import svgfVhOverall2023 from '../../../../models/overalls/svgf-vh.overall@2023.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(svgfVhOverall2023, {
  options: {},
  competitionEventOptions: {
    'e.svgf.sp.dd.ddsr.4.2x45@2023': { name: 'Double Dutch Speed Relay' },
    'e.svgf.sp.dd.ddut.4.0@2023': { name: 'Double Dutch Utmaningen' },
    'e.svgf.fs.dd.ddpf-vh.4.120@2023': { name: 'Double Dutch Pair Freestyle' },
  },
  id: 'e.svgf.oa.dd.vhto.4.0@2023',
  name: 'Dubbelrep Overall',
})
