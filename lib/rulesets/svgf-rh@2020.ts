import { type Ruleset } from '../index.js'
import eIjruSpDdDdsr44x30100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.dd.ddsr.4.4x30@1.0.0.js'
import eIjruSpDdDdss360100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.dd.ddss.3.60@1.0.0.js'
import eIjruSpSrSrdr22x30100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srdr.2.2x30@1.0.0.js'
import eIjruSpSrSrse1180100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srse.1.180@1.0.0.js'
import eIjruSpSrSrsr44x30100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srsr.4.4x30@1.0.0.js'
import eIjruSpSrSrss130100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srss.1.30@1.0.0.js'
import eIjruSpSrSrtu10100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srtu.1.0@1.0.0.js'
import eSvgfSpSrSrpe22x90200 from '../preconfigured/competition-events/svgf/2.0.0/e.svgf.sp.sr.srpe.2.2x90@2.0.0.js'
import eSvgfSpSrSrps22x30200 from '../preconfigured/competition-events/svgf/2.0.0/e.svgf.sp.sr.srps.2.2x30@2.0.0.js'
import eSvgfFsDdDdpfRh4752020 from '../preconfigured/competition-events/svgf/2020/e.svgf.fs.dd.ddpf-rh.4.75@2020.js'
import eSvgfFsDdDdsfRh3752020 from '../preconfigured/competition-events/svgf/2020/e.svgf.fs.dd.ddsf-rh.3.75@2020.js'
import eSvgfFsSrSrifRh1752020 from '../preconfigured/competition-events/svgf/2020/e.svgf.fs.sr.srif-rh.1.75@2020.js'
import eSvgfFsSrSrpfRh2752020 from '../preconfigured/competition-events/svgf/2020/e.svgf.fs.sr.srpf-rh.2.75@2020.js'
import eSvgfFsSrSrtfRh4752020 from '../preconfigured/competition-events/svgf/2020/e.svgf.fs.sr.srtf-rh.4.75@2020.js'
import eSvgfOaSrIsroRh102020 from '../preconfigured/overalls/svgf/2020/e.svgf.oa.sr.isro-rh.1.0@2020.js'
import eSvgfOaSrRpaa202020 from '../preconfigured/overalls/svgf/2020/e.svgf.oa.sr.rpaa.2.0@2020.js'
import eSvgfOaXdReaa402020 from '../preconfigured/overalls/svgf/2020/e.svgf.oa.xd.reaa.4.0@2020.js'
import eSvgfOaXdRsaa402020 from '../preconfigured/overalls/svgf/2020/e.svgf.oa.xd.rsaa.4.0@2020.js'

export default {
  id: 'svgf-rh@2020',
  name: 'SvGF Rikshoppet 2020',
  competitionEvents: [
    eIjruSpSrSrss130100,
    eIjruSpSrSrse1180100,
    eIjruSpSrSrtu10100,
    eSvgfFsSrSrifRh1752020,

    eSvgfSpSrSrps22x30200,
    eSvgfSpSrSrpe22x90200,

    eIjruSpSrSrsr44x30100,
    eIjruSpSrSrdr22x30100,
    eIjruSpDdDdsr44x30100,
    eIjruSpDdDdss360100,

    eSvgfFsSrSrpfRh2752020,
    eSvgfFsSrSrtfRh4752020,
    eSvgfFsDdDdsfRh3752020,
    eSvgfFsDdDdpfRh4752020
  ],
  overalls: [
    eSvgfOaSrIsroRh102020,
    eSvgfOaXdRsaa402020,
    eSvgfOaXdReaa402020,
    eSvgfOaSrRpaa202020
  ]
} satisfies Ruleset
