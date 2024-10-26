import ijruFreestyleSr400 from '../../../../models/competition-events/ijru.freestyle.sr@4.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(ijruFreestyleSr400, {
  options: {
    interactions: false,
  },
  id: 'e.ijru.fs.sr.srif.1.75@4.0.0',
  name: 'Single Rope Individual Freestyle',
})
