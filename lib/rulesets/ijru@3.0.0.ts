import eIjruFsDdDdpf475300 from '../preconfigured/competition-events/e.ijru.fs.dd.ddpf.4.75@3.0.0.js'
import eIjruFsDdDdsf375300 from '../preconfigured/competition-events/e.ijru.fs.dd.ddsf.3.75@3.0.0.js'
import eIjruFsDdDdtf590300 from '../preconfigured/competition-events/e.ijru.fs.dd.ddtf.5.90@3.0.0.js'
import eIjruFsSrSrif175300 from '../preconfigured/competition-events/e.ijru.fs.sr.srif.1.75@3.0.0.js'
import eIjruFsSrSrpf275300 from '../preconfigured/competition-events/e.ijru.fs.sr.srpf.2.75@3.0.0.js'
import eIjruFsSrSrtf475300 from '../preconfigured/competition-events/e.ijru.fs.sr.srtf.4.75@3.0.0.js'
import eIjruFsWhWhpf275300 from '../preconfigured/competition-events/e.ijru.fs.wh.whpf.2.75@3.0.0.js'
import eIjruSpDdDdsr44x30300 from '../preconfigured/competition-events/e.ijru.sp.dd.ddsr.4.4x30@3.0.0.js'
import eIjruSpDdDdss360300 from '../preconfigured/competition-events/e.ijru.sp.dd.ddss.3.60@3.0.0.js'
import eIjruSpSrSrdr22x30300 from '../preconfigured/competition-events/e.ijru.sp.sr.srdr.2.2x30@3.0.0.js'
import eIjruSpSrSrse1180300 from '../preconfigured/competition-events/e.ijru.sp.sr.srse.1.180@3.0.0.js'
import eIjruSpSrSrsr44x30300 from '../preconfigured/competition-events/e.ijru.sp.sr.srsr.4.4x30@3.0.0.js'
import eIjruSpSrSrss130300 from '../preconfigured/competition-events/e.ijru.sp.sr.srss.1.30@3.0.0.js'
import eIjruSpSrSrtu10300 from '../preconfigured/competition-events/e.ijru.sp.sr.srtu.1.0@3.0.0.js'
import eIjruOaDdTddo40300 from '../preconfigured/overalls/e.ijru.oa.dd.tddo.4.0@3.0.0.js'
import eIjruOaSrIsro10300 from '../preconfigured/overalls/e.ijru.oa.sr.isro.1.0@3.0.0.js'
import eIjruOaSrTsro40300 from '../preconfigured/overalls/e.ijru.oa.sr.tsro.4.0@3.0.0.js'
import eIjruOaXdTcaa40300 from '../preconfigured/overalls/e.ijru.oa.xd.tcaa.4.0@3.0.0.js'
import { type Ruleset } from './types.js'

export default {
  id: 'ijru@3.0.0',
  name: 'IJRU v3.0.0',
  competitionEvents: [
    eIjruSpSrSrss130300,
    eIjruSpSrSrse1180300,
    eIjruSpSrSrtu10300,
    eIjruFsSrSrif175300,

    eIjruSpSrSrsr44x30300,
    eIjruSpSrSrdr22x30300,
    eIjruSpDdDdsr44x30300,
    eIjruSpDdDdss360300,

    eIjruFsSrSrpf275300,
    eIjruFsSrSrtf475300,
    eIjruFsDdDdsf375300,
    eIjruFsDdDdpf475300,
    eIjruFsDdDdtf590300,
    eIjruFsWhWhpf275300
  ],
  overalls: [
    eIjruOaSrIsro10300,
    eIjruOaSrTsro40300,
    eIjruOaDdTddo40300,
    eIjruOaXdTcaa40300
  ]
} satisfies Ruleset
