import ijruFreestyleSr420 from '../../../../models/competition-events/ijru.freestyle.sr@4.2.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruFreestyleSr420, {
  options: {
    interactions: true,
  },
  id: 'e.ijru.fs.sr.srtf.4.75@4.2.0',
  name: 'Single Rope Team Freestyle',
})
