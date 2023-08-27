import assert from 'node:assert'
import test from 'node:test'
import * as mod from './ijru.speed@3.0.0.js'

void test('ijru.speed@3.0.0', async t => {
  await t.test('speedJudge', async t => {
    assert.strictEqual(mod.speedJudge({}).id, 'S')

    await t.test('calculates a tally scoresheet', () => {
      assert.deepStrictEqual(
        mod.speedJudge({}).calculateScoresheet({ judgeId: '1', tally: { step: 5 } }),
        { judgeId: '1', judgeTypeId: 'S', result: { a: 5 } }
      )
    })

    await t.test('default to 0 for blank scoresheet', () => {
      assert.deepStrictEqual(
        mod.speedJudge({}).calculateScoresheet({ judgeId: '1', tally: {} }),
        { judgeId: '1', judgeTypeId: 'S', result: { a: 0 } }
      )
    })

    await t.test('calculates a mark scoresheet', () => {
      assert.deepStrictEqual(
        mod.speedJudge({}).calculateScoresheet({
          judgeId: '1',
          marks: [
            { timestamp: Date.now(), sequence: 1, schema: 'step' },
            { timestamp: Date.now(), sequence: 2, schema: 'step' },
            { timestamp: Date.now(), sequence: 3, schema: 'undo', target: 2 },
            { timestamp: Date.now(), sequence: 4, schema: 'step' }
          ]
        }),
        { judgeId: '1', judgeTypeId: 'S', result: { a: 2 } }
      )
    })
  })

  await t.test('speedHeadJudge', async t => {
    assert.strictEqual(mod.speedHeadJudge({}).id, 'Shj')

    await t.test('calculates a tally scoresheet', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({}).calculateScoresheet({ judgeId: '1', tally: { step: 5 } }),
        { judgeId: '1', judgeTypeId: 'Shj', result: { a: 5, m: 0 } }
      )
    })

    await t.test('calculates a tally scoresheet with false start', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({}).calculateScoresheet({ judgeId: '1', tally: { step: 11, falseStart: 2 } }),
        { judgeId: '1', judgeTypeId: 'Shj', result: { a: 11, m: 10 } }
      )
    })

    await t.test('calculates a tally scoresheet with false switches and false start', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({ falseSwitches: 2 }).calculateScoresheet({ judgeId: '1', tally: { step: 11, falseSwitch: 2, falseStart: 1 } }),
        { judgeId: '1', judgeTypeId: 'Shj', result: { a: 11, m: 30 } }
      )
    })

    await t.test('calculates a tally scoresheet with capped false switches', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({ falseSwitches: 1 }).calculateScoresheet({ judgeId: '1', tally: { step: 11, falseSwitch: 2 } }),
        { judgeId: '1', judgeTypeId: 'Shj', result: { a: 11, m: 10 } }
      )
    })

    await t.test('calculates a mark scoresheet', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({}).calculateScoresheet({
          judgeId: '1',
          marks: [
            { timestamp: Date.now(), sequence: 1, schema: 'step' },
            { timestamp: Date.now(), sequence: 2, schema: 'step' },
            { timestamp: Date.now(), sequence: 3, schema: 'undo', target: 2 },
            { timestamp: Date.now(), sequence: 4, schema: 'step' }
          ]
        }),
        { judgeId: '1', judgeTypeId: 'Shj', result: { a: 2, m: 0 } }
      )
    })

    await t.test('calculates a mark scoresheet with false start', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({}).calculateScoresheet({
          judgeId: '1',
          marks: [
            { timestamp: Date.now(), sequence: 1, schema: 'falseStart' },
            { timestamp: Date.now(), sequence: 2, schema: 'step' },
            { timestamp: Date.now(), sequence: 3, schema: 'step' },
            { timestamp: Date.now(), sequence: 4, schema: 'undo', target: 2 },
            { timestamp: Date.now(), sequence: 5, schema: 'step' }
          ]
        }),
        { judgeId: '1', judgeTypeId: 'Shj', result: { a: 2, m: 10 } }
      )
    })

    await t.test('calculates a mark scoresheet with false switches', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({ falseSwitches: 1 }).calculateScoresheet({
          judgeId: '1',
          marks: [
            { timestamp: Date.now(), sequence: 1, schema: 'step' },
            { timestamp: Date.now(), sequence: 2, schema: 'step' },
            { timestamp: Date.now(), sequence: 3, schema: 'falseSwitch' },
            { timestamp: Date.now(), sequence: 4, schema: 'undo', target: 2 },
            { timestamp: Date.now(), sequence: 5, schema: 'step' }
          ]
        }),
        { judgeId: '1', judgeTypeId: 'Shj', result: { a: 2, m: 10 } }
      )
    })

    await t.test('calculates a mark scoresheet with capped false switches', () => {
      assert.deepStrictEqual(
        mod.speedHeadJudge({ falseSwitches: 1 }).calculateScoresheet({
          judgeId: '1',
          marks: [
            { timestamp: Date.now(), sequence: 1, schema: 'step' },
            { timestamp: Date.now(), sequence: 2, schema: 'step' },
            { timestamp: Date.now(), sequence: 3, schema: 'falseSwitch' },
            { timestamp: Date.now(), sequence: 4, schema: 'undo', target: 2 },
            { timestamp: Date.now(), sequence: 5, schema: 'step' },
            { timestamp: Date.now(), sequence: 6, schema: 'falseSwitch' }
          ]
        }),
        { judgeId: '1', judgeTypeId: 'Shj', result: { a: 2, m: 10 } }
      )
    })
  })

  await t.test('calculateEntry', async t => {
    {
      const options = { falseSwitches: 3 }
      const scores = [
        mod.speedHeadJudge(options).calculateScoresheet({ judgeId: '1', tally: { step: 11, falseStart: 0, falseSwitch: 0 } }),
        mod.speedJudge(options).calculateScoresheet({ judgeId: '2', tally: { step: 10 } }),
        mod.speedJudge(options).calculateScoresheet({ judgeId: '3', tally: { step: 10 } })
      ]
      const result = mod.default.calculateEntry({ entryId: '1' }, scores, options)
      assert.deepStrictEqual(result, {
        entryId: '1',
        result: { a: 10, m: 0, R: 10 },
        flags: { withinThree: true }
      })
    }

    await t.test('With false starts and switches', () => {
      const options = { falseSwitches: 3 }
      const scores = [
        mod.speedHeadJudge(options).calculateScoresheet({ judgeId: '1', tally: { step: 24, falseStart: 1, falseSwitch: 1 } }),
        mod.speedJudge(options).calculateScoresheet({ judgeId: '2', tally: { step: 25 } }),
        mod.speedJudge(options).calculateScoresheet({ judgeId: '3', tally: { step: 26 } })
      ]
      const result = mod.default.calculateEntry({ entryId: '1' }, scores, options)
      assert.deepStrictEqual(result, {
        entryId: '1',
        result: { a: 25.5, m: 20, R: 5.5 },
        flags: { withinThree: true }
      })
    })

    await t.test('Not within three', () => {
      const options = { falseSwitches: 3 }
      const scores = [
        mod.speedHeadJudge(options).calculateScoresheet({ judgeId: '1', tally: { step: 10, falseStart: 0, falseSwitch: 0 } }),
        mod.speedJudge(options).calculateScoresheet({ judgeId: '2', tally: { step: 15 } }),
        mod.speedJudge(options).calculateScoresheet({ judgeId: '3', tally: { step: 20 } })
      ]
      const result = mod.default.calculateEntry({ entryId: '1' }, scores, options)
      assert.deepStrictEqual(result, {
        entryId: '1',
        result: { a: 17.5, m: 0, R: 17.5 },
        flags: { withinThree: false }
      })
    })
  })

  await t.test('rankEntries', async t => {
    {
      const options = { falseSwitches: 3 }
      const scores = [
        {
          entryId: '1',
          result: { a: 10, m: 0, R: 10 },
          flags: { withinThree: true }
        },
        {
          entryId: '2',
          result: { a: 20, m: 0, R: 20 },
          flags: { withinThree: true }
        }
      ]
      const result = mod.default.rankEntries(scores, options)
      assert.deepStrictEqual(result, [
        {
          entryId: '2',
          result: { a: 20, m: 0, R: 20, S: 1, N: 100 },
          flags: { withinThree: true }
        },
        {
          entryId: '1',
          result: { a: 10, m: 0, R: 10, S: 2, N: 1 },
          flags: { withinThree: true }
        }
      ])
    }

    await t.test('with a tie', () => {
      const options = { falseSwitches: 3 }
      const scores = [
        {
          entryId: '1',
          result: { a: 10, m: 0, R: 10 },
          flags: { withinThree: true }
        },
        {
          entryId: '2',
          result: { a: 10, m: 0, R: 10 },
          flags: { withinThree: true }
        },
        {
          entryId: '3',
          result: { a: 5, m: 0, R: 5 },
          flags: { withinThree: true }
        }
      ]
      const result = mod.default.rankEntries(scores, options)
      assert.deepStrictEqual(result, [
        {
          entryId: '1',
          result: { a: 10, m: 0, R: 10, S: 1, N: 100 },
          flags: { withinThree: true }
        },
        {
          entryId: '2',
          result: { a: 10, m: 0, R: 10, S: 1, N: 100 },
          flags: { withinThree: true }
        },
        {
          entryId: '3',
          result: { a: 5, m: 0, R: 5, S: 3, N: 1 },
          flags: { withinThree: true }
        }
      ])
    })
  })
})
