import ijruOverall200 from '../../../../models/overalls/ijru.overall@2.0.0.js'
import { partiallyConfigureOverallModel } from '../../../types.js'

export default partiallyConfigureOverallModel(ijruOverall200, {
  options: {},
  competitionEventOptions: {
    'e.ijru.sp.sr.srss.1.30': { name: 'Single Rope Speed Sprint' },
    'e.ijru.sp.sr.srse.1.180': { name: 'Single Rope Speed Endurance' },
    'e.ijru.fs.sr.srif.1.75': { name: 'Single Rope Individual Freestyle', rankMultiplier: 2, normalisationMultiplier: 2 }
  },
  id: 'e.ijru.oa.sr.isro.1.0@2.0.0',
  name: 'Individual Single Rope Overall'
})
