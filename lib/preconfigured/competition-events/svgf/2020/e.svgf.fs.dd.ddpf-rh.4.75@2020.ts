import svgfRhFreestyle2020 from '../../../../models/competition-events/svgf-rh.freestyle@2020.js'
import { partiallyConfigureCompetitionEventModel } from '../../../types.js'

export default partiallyConfigureCompetitionEventModel(svgfRhFreestyle2020, {
  options: {
    discipline: 'dd',
  },
  id: 'e.svgf.fs.dd.ddpf-rh.4.75@2020',
  name: 'Double Dutch Pair Freestyle',
})
