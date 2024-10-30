import { type Ruleset } from '../index.js'

import svgfVhFreestyle2023 from '../models/competition-events/svgf-vh.freestyle@2023.js'
import svgfVhSpeed2023 from '../models/competition-events/svgf-vh.speed@2023.js'
import svgfVhOverall2023 from '../models/overalls/svgf-vh.overall@2023.js'

import eSvgfFsSrSrpfVh2752023 from '../preconfigured/competition-events/svgf/2023/e.svgf.fs.sr.srpf-vh.2.75@2023.js'
import eSvgfSpSrSrdp22x302023 from '../preconfigured/competition-events/svgf/2023/e.svgf.sp.sr.srdp.2.2x30@2023.js'
import eSvgfSpSrSrpe22x602023 from '../preconfigured/competition-events/svgf/2023/e.svgf.sp.sr.srpe.2.2x60@2023.js'
import eSvgfSpSrSrps22x302023 from '../preconfigured/competition-events/svgf/2023/e.svgf.sp.sr.srps.2.2x30@2023.js'
import eSvgfOaSrVhpo202023 from '../preconfigured/overalls/svgf/2023/e.svgf.oa.sr.vhpo.2.0@2023.js'

export default {
  id: 'svgf-vh-par@2023',
  name: 'SvGF VH Pair 2023',
  competitionEvents: [
    eSvgfSpSrSrps22x302023,
    eSvgfSpSrSrpe22x602023,
    eSvgfSpSrSrdp22x302023,
    eSvgfFsSrSrpfVh2752023,
  ],
  overalls: [
    eSvgfOaSrVhpo202023,
  ],
  competitionEventModels: [
    svgfVhSpeed2023,
    svgfVhFreestyle2023,
  ],
  overallModels: [
    svgfVhOverall2023,
  ],
} satisfies Ruleset
