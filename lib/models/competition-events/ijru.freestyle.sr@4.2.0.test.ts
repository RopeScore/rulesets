import assert from 'node:assert'
import test from 'node:test'
import * as mod from './ijru.freestyle.sr@4.2.0.js'
import { type JudgeMeta } from '../types.js'
import { RSRWrongJudgeTypeError } from '../../errors.js'
import { markGeneratorFactory } from '../../helpers/helpers.test.js'

void test('ijru.freestyle.sr@4.2.0', async t => {
  await t.test('difficultyJudge', async t => {
    const meta: JudgeMeta = {
      judgeId: '1',
      judgeTypeId: 'Dm',
      entryId: '1',
      participantId: '1',
      competitionEvent: 'e.ijru.fs.sr.srif.1.75@4.0.0',
    }
    const judge = mod.difficultyJudgeFactory('Dm', 'Difficulty - Multiples', { discipline: 'sr' })

    assert.strictEqual(judge({}).id, 'Dm')

    await t.test('Throws on incorrect meta.judgeTypeId', () => {
      assert.throws(
        () => judge({}).calculateTally({ meta: { ...meta, judgeTypeId: 'S' }, marks: [] }),
        new RSRWrongJudgeTypeError('S', 'Dm')
      )
      assert.throws(
        () => judge({}).calculateJudgeResult({ meta: { ...meta, judgeTypeId: 'S' }, tally: { step: 5 } }),
        new RSRWrongJudgeTypeError('S', 'Dm')
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
        { meta, result: { aqM: 0, d: 54.28 }, statuses: {} }
      )
    })

    await t.test('Only accounts for 6 total skills when calculating required elements', () => {
      assert.deepStrictEqual(
        judge({}).calculateJudgeResult({
          meta,
          tally: {
            'diffL0.5': 0,
            diffL1: 10,
            diffL2: 0,
            diffL3: 1,
            diffL4: 0,
            diffL5: 0,
            diffL6: 0,
            diffL7: 0,
            diffL8: 0,
          },
        }),
        { meta, result: { aqM: 2.5, d: 1.84 }, statuses: {} }
      )
      assert.deepStrictEqual(
        judge({}).calculateJudgeResult({
          meta,
          tally: {
            'diffL0.5': 0,
            diffL1: 10,
            diffL2: 0,
            diffL3: 0,
            diffL4: 0,
            diffL5: 0,
            diffL6: 0,
            diffL7: 0,
            diffL8: 0,
          },
        }),
        { meta, result: { aqM: 3, d: 1.5 }, statuses: {} }
      )
      assert.deepStrictEqual(
        judge({}).calculateJudgeResult({
          meta,
          tally: {
            'diffL0.5': 0,
            diffL1: 6,
            diffL2: 0,
            diffL3: 0,
            diffL4: 6,
            diffL5: 0,
            diffL6: 0,
            diffL7: 0,
            diffL8: 0,
          },
        }),
        { meta, result: { aqM: 0, d: 3.96 }, statuses: {} }
      )
    })

    await t.test('Correct default values for empty scoresheet', () => {
      assert.deepStrictEqual(
        judge({}).calculateJudgeResult({ meta, tally: {} }),
        { meta, result: { aqM: 6, d: 0 }, statuses: {} }
      )
    })
  })
})
