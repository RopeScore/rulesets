import ijruOverall100 from '../../../../models/overalls/ijru.overall@1.0.0.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(ijruOverall100, {
  options: {},
  competitionEventOptions: {
    'e.ijru.sp.sr.srss.1.30@1.0.0': { name: 'Single Rope Speed Sprint' },
    'e.ijru.sp.sr.srse.1.180@1.0.0': { name: 'Single Rope Speed Endurance' },
    'e.ijru.fs.sr.srif.1.75@3.0.0': { name: 'Single Rope Individual Freestyle', rankMultiplier: 2, normalisationMultiplier: 2 },
  },
  id: 'e.ijru.oa.sr.isro.1.0@3.0.0',
  name: 'Individual Single Rope Overall',
})
