import { type Ruleset } from '../index.js'

import ijruSpeed100 from '../models/competition-events/ijru.speed@1.0.0.js'
import svgfRhFreestyle2025 from '../models/competition-events/svgf-rh.freestyle@2025.js'
import svgfRhOverall2025 from '../models/overalls/svgf-rh.overall@2025.js'

import eIjruSpDdDdsr44x30100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.dd.ddsr.4.4x30@1.0.0.js'
import eIjruSpDdDdss360100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.dd.ddss.3.60@1.0.0.js'
import eIjruSpSrSrdr22x30100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srdr.2.2x30@1.0.0.js'
import eIjruSpSrSrse1180100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srse.1.180@1.0.0.js'
import eIjruSpSrSrsr44x30100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srsr.4.4x30@1.0.0.js'
import eIjruSpSrSrss130100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srss.1.30@1.0.0.js'
import eIjruSpSrSrtu10100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srtu.1.0@1.0.0.js'
import eSvgfSpSrSrpe22x90200 from '../preconfigured/competition-events/svgf/2.0.0/e.svgf.sp.sr.srpe.2.2x90@2.0.0.js'
import eSvgfSpSrSrps22x30200 from '../preconfigured/competition-events/svgf/2.0.0/e.svgf.sp.sr.srps.2.2x30@2.0.0.js'
import eSvgfFsDdDdpfRh4752025 from '../preconfigured/competition-events/svgf/2025/e.svgf.fs.dd.ddpf-rh.4.75@2025.js'
import eSvgfFsDdDdsfRh3752025 from '../preconfigured/competition-events/svgf/2025/e.svgf.fs.dd.ddsf-rh.3.75@2025.js'
import eSvgfFsSrSrifRh1752025 from '../preconfigured/competition-events/svgf/2025/e.svgf.fs.sr.srif-rh.1.75@2025.js'
import eSvgfFsSrSrpfRh2752025 from '../preconfigured/competition-events/svgf/2025/e.svgf.fs.sr.srpf-rh.2.75@2025.js'
import eSvgfFsSrSrtfRh4752025 from '../preconfigured/competition-events/svgf/2025/e.svgf.fs.sr.srtf-rh.4.75@2025.js'
import eSvgfOaSrIsroRh102025 from '../preconfigured/overalls/svgf/2025/e.svgf.oa.sr.isro-rh.1.0@2025.js'
import eSvgfOaXdReaa402025 from '../preconfigured/overalls/svgf/2025/e.svgf.oa.xd.reaa.4.0@2025.js'
import eSvgfOaXdRsaa402025 from '../preconfigured/overalls/svgf/2025/e.svgf.oa.xd.rsaa.4.0@2025.js'

export default {
  id: 'svgf-rh@2025',
  name: 'SvGF Rikshoppet 2025',
  competitionEvents: [
    eIjruSpSrSrss130100,
    eIjruSpSrSrse1180100,
    eIjruSpSrSrtu10100,
    eSvgfFsSrSrifRh1752025,

    eSvgfSpSrSrps22x30200,
    eSvgfSpSrSrpe22x90200,

    eIjruSpSrSrsr44x30100,
    eIjruSpSrSrdr22x30100,
    eIjruSpDdDdsr44x30100,
    eIjruSpDdDdss360100,

    eSvgfFsSrSrpfRh2752025,
    eSvgfFsSrSrtfRh4752025,
    eSvgfFsDdDdsfRh3752025,
    eSvgfFsDdDdpfRh4752025,
  ],
  overalls: [
    eSvgfOaSrIsroRh102025,
    eSvgfOaXdRsaa402025,
    eSvgfOaXdReaa402025,
  ],
  competitionEventModels: [
    ijruSpeed100,
    svgfRhFreestyle2025,
  ],
  overallModels: [
    svgfRhOverall2025,
  ],
} satisfies Ruleset
