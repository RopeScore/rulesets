import assert from 'node:assert'
import test from 'node:test'
import * as mod from './ijru.freestyle.wh@4.0.0.js'
import * as srMod from './ijru.freestyle.sr@4.0.0.js'
import { type JudgeResult, type EntryMeta, type JudgeMeta } from '../types.js'
import { RSRWrongJudgeTypeError } from '../../errors.js'
import { markGeneratorFactory } from '../../helpers/helpers.test.js'

void test('ijru.freestyle.wh@4.0.0', async t => {
  await t.test('technicalJudge', async t => {
    const meta: JudgeMeta = {
      judgeId: '1',
      judgeTypeId: 'T',
      entryId: '1',
      participantId: '1',
      competitionEvent: 'e.ijru.fs.wh.whpf.2.75@4.0.0',
    }
    const judge = srMod.technicalJudgeFactory({ discipline: 'wh' })

    assert.strictEqual(judge({}).id, 'T')

    await t.test('Throws on incorrect meta.judgeTypeId', () => {
      assert.throws(
        () => judge({}).calculateTally({ meta: { ...meta, judgeTypeId: 'S' }, marks: [] }),
        new RSRWrongJudgeTypeError('S', 'T')
      )
      assert.throws(
        () => judge({}).calculateJudgeResult({ meta: { ...meta, judgeTypeId: 'S' }, tally: { step: 5 } }),
        new RSRWrongJudgeTypeError('S', 'T')
      )
    })

    await t.test('calculates a tally (WH)', () => {
      const m = markGeneratorFactory()
      assert.deepStrictEqual(
        judge({}).calculateTally({
          meta,
          marks: [m('miss'), m('miss'), m('rqInteractions')],
        }),
        {
          meta,
          tally: {
            break: 0,
            miss: 2,
            spaceViolation: 0,
            timeViolation: 0,
            rqGymnasticsPower: 0,
            rqInteractions: 1,
            rqMultiples: 0,
            rqRopeManipulation: 0,
          },
        }
      )
    })

    await t.test('calculates a judge result (WH)', () => {
      assert.deepStrictEqual(
        judge({}).calculateJudgeResult({
          meta,
          tally: {
            break: 4,
            miss: 3,
            timeViolation: 1,
            spaceViolation: 2,
            rqGymnasticsPower: 2,
            rqMultiples: 7,
            rqRopeManipulation: 1,
            rqInteractions: 3,
          },
        }),
        {
          meta,
          result: {
            aqI: 3,
            aqM: 0,
            aqP: 4,
            aqR: 5,
            nb: 4,
            nm: 3,
            nv: 3,
          },
          statuses: {},
        }
      )
    })

    await t.test('Correct default values for empty scoresheet', () => {
      assert.deepStrictEqual(
        judge({}).calculateJudgeResult({ meta, tally: {} }),
        {
          meta,
          result: {
            aqI: 6,
            aqM: 6,
            aqP: 6,
            aqR: 6,
            nb: 0,
            nm: 0,
            nv: 0,
          },
          statuses: {},
        }
      )
    })
  })

  await t.test('difficultyJudge', async t => {
    const meta: JudgeMeta = {
      judgeId: '1',
      judgeTypeId: 'Da',
      entryId: '1',
      participantId: '1',
      competitionEvent: 'e.ijru.fs.wh.whpf.2.75@4.0.0',
    }
    const judge = srMod.difficultyJudgeFactory('Da', 'Difficulty - Athlete A', { discipline: 'wh' })

    assert.strictEqual(judge({}).id, 'Da')

    await t.test('Throws on incorrect meta.judgeTypeId', () => {
      assert.throws(
        () => judge({}).calculateTally({ meta: { ...meta, judgeTypeId: 'S' }, marks: [] }),
        new RSRWrongJudgeTypeError('S', 'Da')
      )
      assert.throws(
        () => judge({}).calculateJudgeResult({ meta: { ...meta, judgeTypeId: 'S' }, tally: { step: 5 } }),
        new RSRWrongJudgeTypeError('S', 'Da')
      )
    })

    await t.test('calculate a tally', () => {
      const m = markGeneratorFactory()
      assert.deepStrictEqual(
        judge({}).calculateTally({
          meta,
          marks: [
            m('diffL0.5'),
            m('diffL1'), m('diffL1'),
            m('diffL2'), m('diffL2'), m('diffL2'),
            m('diffL3'), m('diffL3'), m('diffL3'), m('diffL3'),
            m('diffL4'), m('diffL4'), m('diffL4'), m('diffL4'), m('diffL4'),
            m('diffL5'), m('diffL5'), m('diffL5'), m('diffL5'), m('diffL5'), m('diffL5'),
            m('diffL6'), m('diffL6'), m('diffL6'), m('diffL6'), m('diffL6'), m('diffL6'), m('diffL6'),
            m('diffL7'), m('diffL7'), m('diffL7'), m('diffL7'), m('diffL7'), m('diffL7'), m('diffL7'), m('diffL7'),
            m('diffL8'), m('diffL8'), m('diffL8'), m('diffL8'), m('diffL8'), m('diffL8'), m('diffL8'), m('diffL8'), m('diffL8'),
          ],
        }),
        {
          meta,
          tally: {
            'diffL0.5': 1,
            diffL1: 2,
            diffL2: 3,
            diffL3: 4,
            diffL4: 5,
            diffL5: 6,
            diffL6: 7,
            diffL7: 8,
            diffL8: 9,
            rep: 0,
          },
        }
      )
    })

    await t.test('calculates a judge result', () => {
      assert.deepStrictEqual(
        judge({}).calculateJudgeResult({
          meta,
          tally: {
            'diffL0.5': 1,
            diffL1: 2,
            diffL2: 3,
            diffL3: 4,
            diffL4: 5,
            diffL5: 6,
            diffL6: 7,
            diffL7: 8,
            diffL8: 9,
          },
        }),
        { meta, result: { d: 54.28 }, statuses: {} }
      )
    })

    await t.test('Correct default values for empty scoresheet', () => {
      assert.deepStrictEqual(
        judge({}).calculateJudgeResult({ meta, tally: {} }),
        { meta, result: { d: 0 }, statuses: {} }
      )
    })
  })

  await t.test('calculateEntry', async t => {
    const jMeta = (jId: string, jTId: string): JudgeMeta => ({
      judgeId: jId,
      judgeTypeId: jTId,
      entryId: '1',
      participantId: '1',
      competitionEvent: 'e.ijru.fs.wh.whpf.2.75@4.0.0',
    })
    const eMeta: EntryMeta = {
      entryId: '1',
      participantId: '1',
      competitionEvent: 'e.ijru.fs.wh.whpf.2.75@4.0.0',
    }
    {
      const options = {}
      const scores: JudgeResult[] = [
        { meta: jMeta('1', 'P'), result: { p: 20, nm: 2 }, statuses: {} },
        { meta: jMeta('2', 'P'), result: { p: 12, nm: 2 }, statuses: {} },
        { meta: jMeta('21', 'T'), result: { nb: 4, nm: 3, nv: 4, aqP: 2, aqM: 0, aqR: 2, aqI: 1 }, statuses: {} },
        { meta: jMeta('21', 'T'), result: { nb: 5, nm: 3, nv: 4, aqP: 0, aqM: 2, aqR: 2, aqI: 2 }, statuses: {} },
        { meta: jMeta('31', 'Da'), result: { d: 10.5 }, statuses: {} },
        { meta: jMeta('32', 'Da'), result: { d: 31.22 }, statuses: {} },
        { meta: jMeta('41', 'Db'), result: { d: 35 }, statuses: {} },
        { meta: jMeta('42', 'Db'), result: { d: 39 }, statuses: {} },
      ]
      const result = mod.default.calculateEntry(eMeta, scores, options)
      assert.deepStrictEqual(result, {
        meta: eMeta,
        result: {
          D: 28.93,
          P: 0.8,
          Q: 0.85,
          M: 0.32,
          R: 14.16,

          dA: 20.86,
          dB: 37,

          qM: 1,
          qP: 1,
          qR: 2,
          qI: 2,

          am: 3,
          ab: 5,
          av: 4,
          m: 0.225,
          b: 0.25,
          v: 0.2,
        },
        statuses: {},
      })
    }

    await t.test('Can\'t go below 0', () => {
      const options = {}
      const scores: JudgeResult[] = [
        { meta: jMeta('1', 'P'), result: { p: 20, nm: 10 }, statuses: {} },
        { meta: jMeta('2', 'P'), result: { p: 12, nm: 10 }, statuses: {} },
        { meta: jMeta('21', 'T'), result: { nb: 4, nm: 10, nv: 4, aqP: 2, aqM: 0, aqR: 2, aqI: 1 }, statuses: {} },
        { meta: jMeta('21', 'T'), result: { nb: 5, nm: 10, nv: 4, aqP: 0, aqM: 2, aqR: 2, aqI: 2 }, statuses: {} },
        { meta: jMeta('31', 'Da'), result: { d: 10.5 }, statuses: {} },
        { meta: jMeta('32', 'Da'), result: { d: 31.22 }, statuses: {} },
        { meta: jMeta('33', 'Db'), result: { d: 35 }, statuses: {} },
        { meta: jMeta('33', 'Db'), result: { d: 39 }, statuses: {} },
      ]
      const result = mod.default.calculateEntry(eMeta, scores, options)
      assert.deepStrictEqual(result, {
        meta: eMeta,
        result: {
          D: 28.93,
          P: 0.8,
          Q: 0.85,
          M: 0,
          R: 0,

          dA: 20.86,
          dB: 37,

          qM: 1,
          qP: 1,
          qR: 2,
          qI: 2,

          am: 10,
          ab: 5,
          av: 4,
          m: 0.925,
          b: 0.25,
          v: 0.2,
        },
        statuses: {},
      })
    })
  })
})
