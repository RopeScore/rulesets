import svgfVhFreestyle2023 from '../../../../models/competition-events/svgf-vh.freestyle@2023.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(svgfVhFreestyle2023, {
  options: { discipline: 'sr' },
  id: 'e.svgf.fs.sr.srpf-vh.2.75@2023',
  name: 'Single Rope Pair Freestyle',
})
