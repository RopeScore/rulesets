import { type Ruleset } from './types.js'

import ijruSpeed100 from '../models/competition-events/ijru.speed@1.0.0.js'
import ijruOverall100 from '../models/overalls/ijru.overall@1.0.0.js'

import eIjruSpDdDdsr44x30100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.dd.ddsr.4.4x30@1.0.0.js'
import eIjruSpDdDdss360100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.dd.ddss.3.60@1.0.0.js'
import eIjruSpSrSrdr22x30100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srdr.2.2x30@1.0.0.js'
import eIjruSpSrSrse1180100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srse.1.180@1.0.0.js'
import eIjruSpSrSrsr44x30100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srsr.4.4x30@1.0.0.js'
import eIjruSpSrSrss130100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srss.1.30@1.0.0.js'
import eIjruSpSrSrtu10100 from '../preconfigured/competition-events/ijru/1.0.0/e.ijru.sp.sr.srtu.1.0@1.0.0.js'

export default {
  id: 'ijru@4.0.0',
  name: 'IJRU v4.0.0',
  competitionEvents: [
    eIjruSpSrSrss130100,
    eIjruSpSrSrse1180100,
    eIjruSpSrSrtu10100,
    // eIjruFsSrSrif175400,

    eIjruSpSrSrsr44x30100,
    eIjruSpSrSrdr22x30100,
    eIjruSpDdDdsr44x30100,
    eIjruSpDdDdss360100,

    // eIjruFsSrSrpf275400,
    // eIjruFsSrSrtf475400,
    // eIjruFsDdDdsf375400,
    // eIjruFsDdDdpf475400,
    // eIjruFsDdDdtf590400,
    // eIjruFsWhWhpf275400,

    // TODO: DDC
  ],
  overalls: [
    // eIjruOaSrIsro10400,
    // eIjruOaXdTxdo40400,
  ],
  competitionEventModels: [
    // ijruFreestyleSrwh400,
    // ijruFreestyleDd400,
    ijruSpeed100,
  ],
  overallModels: [
    ijruOverall100,
  ],
} satisfies Ruleset
