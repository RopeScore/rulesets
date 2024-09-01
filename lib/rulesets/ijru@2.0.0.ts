import eIjruFsDdDdpf475200 from '../preconfigured/competition-events/ijru/2.0.0/e.ijru.fs.dd.ddpf.4.75@2.0.0.js'
import eIjruFsDdDdsf375200 from '../preconfigured/competition-events/ijru/2.0.0/e.ijru.fs.dd.ddsf.3.75@2.0.0.js'
import eIjruFsDdDdtf590200 from '../preconfigured/competition-events/ijru/2.0.0/e.ijru.fs.dd.ddtf.5.90@2.0.0.js'
import eIjruFsSrSrif175200 from '../preconfigured/competition-events/ijru/2.0.0/e.ijru.fs.sr.srif.1.75@2.0.0.js'
import eIjruFsSrSrpf275200 from '../preconfigured/competition-events/ijru/2.0.0/e.ijru.fs.sr.srpf.2.75@2.0.0.js'
import eIjruFsSrSrtf475200 from '../preconfigured/competition-events/ijru/2.0.0/e.ijru.fs.sr.srtf.4.75@2.0.0.js'
import eIjruFsWhWhpf275200 from '../preconfigured/competition-events/ijru/2.0.0/e.ijru.fs.wh.whpf.2.75@2.0.0.js'
import eIjruSpDdDdsr44x30200 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.dd.ddsr.4.4x30@1.0.0.js'
import eIjruSpDdDdss360100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.dd.ddss.3.60@1.0.0.js'
import eIjruSpSrSrdr22x30100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srdr.2.2x30@1.0.0.js'
import eIjruSpSrSrse1180100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srse.1.180@1.0.0.js'
import eIjruSpSrSrsr44x30100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srsr.4.4x30@1.0.0.js'
import eIjruSpSrSrss130100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srss.1.30@1.0.0.js'
import eIjruSpSrSrtu10100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srtu.1.0@1.0.0.js'
import eIjruOaDdTddo40200 from '../preconfigured/overalls/ijru/2.0.0/e.ijru.oa.dd.tddo.4.0@2.0.0.js'
import eIjruOaSrIsro10200 from '../preconfigured/overalls/ijru/2.0.0/e.ijru.oa.sr.isro.1.0@2.0.0.js'
import eIjruOaSrTsro40200 from '../preconfigured/overalls/ijru/2.0.0/e.ijru.oa.sr.tsro.4.0@2.0.0.js'
import eIjruOaXdTcaa40200 from '../preconfigured/overalls/ijru/2.0.0/e.ijru.oa.xd.tcaa.4.0@2.0.0.js'
import { type Ruleset } from './types.js'
import ijruFreestyle200 from '../models/competition-events/ijru.freestyle@2.0.0.js'
import ijruSpeed100 from '../models/competition-events/ijru.speed@1.0.0.js'
import ijruOverall100 from '../models/overalls/ijru.overall@1.0.0.js'

export default {
  id: 'ijru@2.0.0',
  name: 'IJRU v2.0.0',
  competitionEvents: [
    eIjruSpSrSrss130100,
    eIjruSpSrSrse1180100,
    eIjruSpSrSrtu10100,
    eIjruFsSrSrif175200,

    eIjruSpSrSrsr44x30100,
    eIjruSpSrSrdr22x30100,
    eIjruSpDdDdsr44x30200,
    eIjruSpDdDdss360100,

    eIjruFsSrSrpf275200,
    eIjruFsSrSrtf475200,
    eIjruFsDdDdsf375200,
    eIjruFsDdDdpf475200,
    eIjruFsDdDdtf590200,
    eIjruFsWhWhpf275200,
  ],
  overalls: [
    eIjruOaSrIsro10200,
    eIjruOaSrTsro40200,
    eIjruOaDdTddo40200,
    eIjruOaXdTcaa40200,
  ],
  competitionEventModels: [
    ijruFreestyle200,
    ijruSpeed100,
  ],
  overallModels: [
    ijruOverall100,
  ],
} satisfies Ruleset
