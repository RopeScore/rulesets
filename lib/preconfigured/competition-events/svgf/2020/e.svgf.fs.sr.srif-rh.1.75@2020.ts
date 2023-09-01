import svgfRhFreestyle2020 from '../../../../models/competition-events/svgf-rh.freestyle@2020.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(svgfRhFreestyle2020, {
  options: {
    discipline: 'sr'
  },
  id: 'e.svgf.fs.sr.srif-rh.1.75@2020',
  name: 'Single Rope Individual Freestyle'
})
