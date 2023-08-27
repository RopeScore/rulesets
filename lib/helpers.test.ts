import { calculateTally, clampNumber, formatFactor, isObject, roundTo, roundToCurry, roundToMultiple } from './helpers.js'
import assert from 'node:assert'
import test from 'node:test'
import type { Mark } from './models/types.js'

void test('helpers', async t => {
  await t.test('isObject', async t => {
    assert.strictEqual(isObject(5), false)
    assert.strictEqual(isObject(''), false)
    assert.strictEqual(isObject('hi'), false)
    assert.strictEqual(isObject(false), false)
    assert.strictEqual(isObject(true), false)
    assert.strictEqual(isObject(null), false)
    assert.strictEqual(isObject(undefined), false)
    assert.strictEqual(isObject([]), false)
    assert.strictEqual(isObject({}), true)
  })

  await t.test('roundToMultiple', async t => {
    await t.test('rounds to multiple of 0.5', () => {
      assert.strictEqual(roundToMultiple(5.4, 0.5), 5.5)
    })
    await t.test('rounds to whole number', () => {
      assert.strictEqual(roundToMultiple(5.4, 1), 5)
      assert.strictEqual(roundToMultiple(5.5, 1), 6)
      assert.strictEqual(roundToMultiple(5.6, 1), 6)
    })
  })

  await t.test('roundTo', async t => {
    assert.strictEqual(roundTo(5.555, 2), 5.56)
    assert.strictEqual(roundTo(5.555, 0), 6)
  })

  await t.test('roundToCurry', async t => {
    assert.strictEqual(roundToCurry(2)(5.555), '5.56')
    assert.strictEqual(roundToCurry(0)(5.555), '6')
  })

  await t.test('clampNumber', async t => {
    await t.test('min', () => {
      assert.strictEqual(clampNumber(5, { min: 6 }), 6)
      assert.strictEqual(clampNumber(6, { min: 6 }), 6)
      assert.strictEqual(clampNumber(7, { min: 6 }), 7)
    })
    await t.test('max', () => {
      assert.strictEqual(clampNumber(5, { max: 6 }), 5)
      assert.strictEqual(clampNumber(6, { max: 6 }), 6)
      assert.strictEqual(clampNumber(7, { max: 6 }), 6)
    })
    await t.test('step', () => {
      assert.strictEqual(clampNumber(5.4, { step: 1 }), 5)
      assert.strictEqual(clampNumber(5.5, { step: 1 }), 6)
      assert.strictEqual(clampNumber(5.6, { step: 1 }), 6)
    })
    await t.test('step interacting with min/max', () => {
      assert.strictEqual(clampNumber(5.4, { min: 6, step: 1 }), 6)
      assert.strictEqual(clampNumber(5.4, { min: 5, step: 1 }), 5)
      assert.strictEqual(clampNumber(5.4, { min: 5, step: 0.5 }), 5.5)

      assert.strictEqual(clampNumber(5.6, { max: 5, step: 1 }), 5)
      assert.strictEqual(clampNumber(5.6, { max: 6, step: 1 }), 6)
      assert.strictEqual(clampNumber(5.6, { max: 6, step: 0.5 }), 5.5)
    })
  })

  await t.test('formatFactor', async t => {
    assert.strictEqual(formatFactor(1), '±0 %')
    assert.strictEqual(formatFactor(0.9), '-10 %')
    assert.strictEqual(formatFactor(1.1), '+10 %')
  })

  await t.test('calculateTally', async t => {
    await t.test('Should return tally for a TallyScoresheet', () => {
      const tally = { entPlus: 2, entMinus: 1 }
      assert.deepStrictEqual(calculateTally({ judgeId: '1', tally }), tally)
    })

    await t.test('Should return tally for MarkScoresheet', () => {
      const marks: Array<Mark<string>> = [
        { sequence: 0, schema: 'formPlus', timestamp: 1 },
        { sequence: 1, schema: 'formCheck', timestamp: 15 },
        { sequence: 2, schema: 'formPlus', timestamp: 30 }
      ]
      const tally = {
        formPlus: 2,
        formCheck: 1
      }
      assert.deepStrictEqual(calculateTally({ judgeId: '1', marks }), tally)
    })

    await t.test('Should return tally for MarkScoresheet with undo marks', () => {
      const marks: Array<Mark<string>> = [
        { sequence: 0, schema: 'formPlus', timestamp: 1 },
        { sequence: 1, schema: 'formCheck', timestamp: 15 },
        { sequence: 2, schema: 'formPlus', timestamp: 30 },
        { sequence: 3, schema: 'undo', timestamp: 45, target: 2 }
      ]
      const tally = {
        formPlus: 1,
        formCheck: 1
      }
      assert.deepStrictEqual(calculateTally({ judgeId: '1', marks }), tally)
    })
  })
})
