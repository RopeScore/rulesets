import svgfParOverall200 from '../../../../models/overalls/svgf-par.overall@2.0.0.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(svgfParOverall200, {
  options: {},
  competitionEventOptions: {
    'e.ijru.sp.sr.srdr.2.2x30@1.0.0': { name: 'Single Rope Double Unders Relay' },
    'e.ijru.sp.sr.srsr.4.4x30@1.0.0': { name: 'Single Rope Speed Relay' },
    'e.svgf.fs.sr.srtf-rh.4.75@2020': { name: 'Single Rope Team Freestyle' },

    'e.ijru.sp.dd.ddss.3.60@1.0.0': { name: 'Double Dutch Speed Sprint' },
    'e.ijru.sp.dd.ddsr.4.4x30@1.0.0': { name: 'Double Dutch Speed Relay' },
    'e.svgf.fs.dd.ddpf-rh.4.75@2020': { name: 'Double Dutch Pair Freestyle' }
  },
  id: 'e.svgf.oa.xd.rsaa.4.0@2020',
  name: 'Rikshoppet 6:an Overall'
})
