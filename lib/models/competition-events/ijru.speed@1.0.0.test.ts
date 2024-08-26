import assert from 'node:assert'
import test from 'node:test'
import * as mod from './ijru.speed@1.0.0.js'
import type { EntryMeta, EntryResult, JudgeMeta } from '../types.js'
import { RSRWrongJudgeTypeError } from '../../errors.js'

void test('ijru.speed@3.0.0', async t => {
  await t.test('speedJudge', async t => {
    const meta: JudgeMeta = {
      judgeId: '1',
      judgeTypeId: 'S',
      entryId: '1',
      participantId: '1',
      competitionEvent: 'e.ijru.sp.sr.srss.1.30@1.0.0',
    }
    assert.strictEqual(mod.speedJudge({}).id, 'S')

    await t.test('Throws on incorrect meta.judgeTypeId', () => {
      assert.throws(
        () => mod.speedJudge({}).calculateScoresheet({ meta: { ...meta, judgeTypeId: 'Shj' }, tally: { step: 5 } }),
        new RSRWrongJudgeTypeError('Shj', 'S')
      )
    })

    await t.test('calculates a tally scoresheet', () => {
      assert.deepStrictEqual(
        mod.speedJudge({}).calculateScoresheet({ meta, tally: { step: 5 } }),
        { meta, result: { a: 5 }, statuses: {} }
      )
    })

    await t.test('default to 0 for blank scoresheet', () => {
      assert.deepStrictEqual(
        mod.speedJudge({}).calculateScoresheet({ meta, tally: {} }),
        { meta, result: { a: 0 }, statuses: {} }
      )
    })

    await t.test('calculates a mark scoresheet', () => {
      assert.deepStrictEqual(
        mod.speedJudge({}).calculateScoresheet({
          meta,
          marks: [
            { timestamp: Date.now(), sequence: 1, schema: 'step' },
            { timestamp: Date.now(), sequence: 2, schema: 'step' },
            { timestamp: Date.now(), sequence: 3, schema: 'undo', target: 2 },
            { timestamp: Date.now(), sequence: 4, schema: 'step' },
          ],
        }),
        { meta, result: { a: 2 }, statuses: {} }
      )
    })
  })

  await t.test('speedHeadJudge', async t => {
    const meta: JudgeMeta = {
      judgeId: '1',
      judgeTypeId: 'Shj',
      entryId: '1',
      participantId: '1',
      competitionEvent: 'e.ijru.sp.sr.srss.1.30@1.0.0',
    }
    assert.strictEqual(mod.speedHeadJudge({}).id, 'Shj')

    await t.test('Throws on incorrect meta.judgeTypeId', () => {
      assert.throws(
        () => mod.speedHeadJudge({}).calculateScoresheet({ meta: { ...meta, judgeTypeId: 'S' }, tally: { step: 5 } }),
        new RSRWrongJudgeTypeError('S', 'Shj')
      )
    })

    await t.test('calculates a tally scoresheet', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({}).calculateScoresheet({ meta, tally: { step: 5 } }),
        { meta, result: { a: 5, m: 0 }, statuses: {} }
      )
    })

    await t.test('calculates a tally scoresheet with false start', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({}).calculateScoresheet({ meta, tally: { step: 11, falseStart: 2 } }),
        { meta, result: { a: 11, m: 10 }, statuses: {} }
      )
    })

    await t.test('calculates a tally scoresheet with false switches and false start', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({ falseSwitches: 2 }).calculateScoresheet({ meta, tally: { step: 11, falseSwitch: 2, falseStart: 1 } }),
        { meta, result: { a: 11, m: 30 }, statuses: {} }
      )
    })

    await t.test('calculates a tally scoresheet with capped false switches', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({ falseSwitches: 1 }).calculateScoresheet({ meta, tally: { step: 11, falseSwitch: 2 } }),
        { meta, result: { a: 11, m: 10 }, statuses: {} }
      )
    })

    await t.test('calculates a mark scoresheet', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({}).calculateScoresheet({
          meta,
          marks: [
            { timestamp: Date.now(), sequence: 1, schema: 'step' },
            { timestamp: Date.now(), sequence: 2, schema: 'step' },
            { timestamp: Date.now(), sequence: 3, schema: 'undo', target: 2 },
            { timestamp: Date.now(), sequence: 4, schema: 'step' },
          ],
        }),
        { meta, result: { a: 2, m: 0 }, statuses: {} }
      )
    })

    await t.test('calculates a mark scoresheet with false start', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({}).calculateScoresheet({
          meta,
          marks: [
            { timestamp: Date.now(), sequence: 1, schema: 'falseStart' },
            { timestamp: Date.now(), sequence: 2, schema: 'step' },
            { timestamp: Date.now(), sequence: 3, schema: 'step' },
            { timestamp: Date.now(), sequence: 4, schema: 'undo', target: 2 },
            { timestamp: Date.now(), sequence: 5, schema: 'step' },
          ],
        }),
        { meta, result: { a: 2, m: 10 }, statuses: {} }
      )
    })

    await t.test('calculates a mark scoresheet with false switches', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({ falseSwitches: 1 }).calculateScoresheet({
          meta,
          marks: [
            { timestamp: Date.now(), sequence: 1, schema: 'step' },
            { timestamp: Date.now(), sequence: 2, schema: 'step' },
            { timestamp: Date.now(), sequence: 3, schema: 'falseSwitch' },
            { timestamp: Date.now(), sequence: 4, schema: 'undo', target: 2 },
            { timestamp: Date.now(), sequence: 5, schema: 'step' },
          ],
        }),
        { meta, result: { a: 2, m: 10 }, statuses: {} }
      )
    })

    await t.test('calculates a mark scoresheet with capped false switches', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({ falseSwitches: 1 }).calculateScoresheet({
          meta,
          marks: [
            { timestamp: Date.now(), sequence: 1, schema: 'step' },
            { timestamp: Date.now(), sequence: 2, schema: 'step' },
            { timestamp: Date.now(), sequence: 3, schema: 'falseSwitch' },
            { timestamp: Date.now(), sequence: 4, schema: 'undo', target: 2 },
            { timestamp: Date.now(), sequence: 5, schema: 'step' },
            { timestamp: Date.now(), sequence: 6, schema: 'falseSwitch' },
          ],
        }),
        { meta, result: { a: 2, m: 10 }, statuses: {} }
      )
    })
  })

  await t.test('calculateEntry', async t => {
    {
      const jMeta = (jId: string, jTId = 'S'): JudgeMeta => ({
        judgeId: jId,
        judgeTypeId: jTId,
        entryId: '1',
        participantId: '1',
        competitionEvent: 'e.ijru.sp.sr.srss.1.30@1.0.0',
      })
      const eMeta: EntryMeta = {
        entryId: '1',
        participantId: '1',
        competitionEvent: 'e.ijru.sp.sr.srss.1.30@1.0.0',
      }
      const options = { falseSwitches: 3 }
      const scores = [
        mod.speedHeadJudge(options).calculateScoresheet({ meta: jMeta('1', 'Shj'), tally: { step: 11, falseStart: 0, falseSwitch: 0 } }),
        mod.speedJudge(options).calculateScoresheet({ meta: jMeta('2'), tally: { step: 10 } }),
        mod.speedJudge(options).calculateScoresheet({ meta: jMeta('3'), tally: { step: 10 } }),
      ]
      const result = mod.default.calculateEntry(eMeta, scores, options)
      assert.deepStrictEqual(result, {
        meta: eMeta,
        result: { a: 10, m: 0, R: 10 },
        statuses: { withinThree: true },
      })
    }

    const jMeta = (jId: string, jTId = 'S'): JudgeMeta => ({
      judgeId: jId,
      judgeTypeId: jTId,
      entryId: '1',
      participantId: '1',
      competitionEvent: 'e.ijru.sp.sr.srss.1.30@1.0.0',
    })
    const eMeta: EntryMeta = {
      entryId: '1',
      participantId: '1',
      competitionEvent: 'e.ijru.sp.sr.srss.1.30@1.0.0',
    }
    await t.test('With false starts and switches', () => {
      const options = { falseSwitches: 3 }
      const scores = [
        mod.speedHeadJudge(options).calculateScoresheet({ meta: jMeta('1', 'Shj'), tally: { step: 24, falseStart: 1, falseSwitch: 1 } }),
        mod.speedJudge(options).calculateScoresheet({ meta: jMeta('2'), tally: { step: 25 } }),
        mod.speedJudge(options).calculateScoresheet({ meta: jMeta('3'), tally: { step: 26 } }),
      ]
      const result = mod.default.calculateEntry(eMeta, scores, options)
      assert.deepStrictEqual(result, {
        meta: eMeta,
        result: { a: 25.5, m: 20, R: 5.5 },
        statuses: { withinThree: true },
      })
    })

    await t.test('Not within three', () => {
      const options = { falseSwitches: 3 }
      const scores = [
        mod.speedHeadJudge(options).calculateScoresheet({ meta: jMeta('1', 'Shj'), tally: { step: 10, falseStart: 0, falseSwitch: 0 } }),
        mod.speedJudge(options).calculateScoresheet({ meta: jMeta('2'), tally: { step: 15 } }),
        mod.speedJudge(options).calculateScoresheet({ meta: jMeta('3'), tally: { step: 20 } }),
      ]
      const result = mod.default.calculateEntry(eMeta, scores, options)
      assert.deepStrictEqual(result, {
        meta: eMeta,
        result: { a: 17.5, m: 0, R: 17.5 },
        statuses: { withinThree: false },
      })
    })
  })

  await t.test('rankEntries', async t => {
    const meta = (id: string): EntryMeta => ({
      entryId: id,
      participantId: id,
      competitionEvent: 'e.ijru.sp.sr.srss.1.30@1.0.0',
    })

    // eslint-disable-next-line @stylistic/semi
    ; {
      const options = { falseSwitches: 3 }
      const scores: EntryResult[] = [
        {
          meta: meta('1'),
          result: { a: 10, m: 0, R: 10 },
          statuses: { withinThree: true },
        },
        {
          meta: meta('2'),
          result: { a: 20, m: 0, R: 20 },
          statuses: { withinThree: true },
        },
      ]
      const result = mod.default.rankEntries(scores, options)
      assert.deepStrictEqual(result, [
        {
          meta: meta('2'),
          result: { a: 20, m: 0, R: 20, S: 1, N: 100 },
          statuses: { withinThree: true },
        },
        {
          meta: meta('1'),
          result: { a: 10, m: 0, R: 10, S: 2, N: 1 },
          statuses: { withinThree: true },
        },
      ])
    }

    await t.test('with a tie', () => {
      const options = { falseSwitches: 3 }
      const scores = [
        {
          meta: meta('1'),
          result: { a: 10, m: 0, R: 10 },
          statuses: { withinThree: true },
        },
        {
          meta: meta('2'),
          result: { a: 10, m: 0, R: 10 },
          statuses: { withinThree: true },
        },
        {
          meta: meta('3'),
          result: { a: 5, m: 0, R: 5 },
          statuses: { withinThree: true },
        },
      ]
      const result = mod.default.rankEntries(scores, options)
      assert.deepStrictEqual(result, [
        {
          meta: meta('1'),
          result: { a: 10, m: 0, R: 10, S: 1, N: 100 },
          statuses: { withinThree: true },
        },
        {
          meta: meta('2'),
          result: { a: 10, m: 0, R: 10, S: 1, N: 100 },
          statuses: { withinThree: true },
        },
        {
          meta: meta('3'),
          result: { a: 5, m: 0, R: 5, S: 3, N: 1 },
          statuses: { withinThree: true },
        },
      ])
    })
  })
})
