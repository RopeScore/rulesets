import svgfFreestyle300 from '../../../../models/competition-events/svgf.freestyle@3.0.0.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(svgfFreestyle300, {
  options: {
    discipline: 'sr',
    interactions: true,
  },
  id: 'e.svgf.fs.sr.srpf.2.75@3.0.0',
  name: 'Single Rope Pair Freestyle',
})
