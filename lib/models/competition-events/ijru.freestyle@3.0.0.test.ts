import assert from 'node:assert'
import test from 'node:test'
import * as mod from './ijru.freestyle@3.0.0.js'

void test('ijru.freestyle@3.0.0', async t => {
  await t.test('L', async t => {
    for (const [level, points] of [
      [0, 0],
      [0.5, 0.12],
      [1, 0.15],
      [2, 0.23],
      [3, 0.34],
      [4, 0.51],
      [5, 0.76],
      [6, 1.14],
      [7, 1.71],
      [8, 2.56]
    ]) {
      await t.test(`should calculate correct score for L(${level})`, () => {
        assert.strictEqual(mod.L(level), points)
      })
    }
  })

  await t.test('ijruAverage', async t => {
    await t.test('Should return single number', () => {
      assert.strictEqual(mod.ijruAverage([1]), 1)
    })

    await t.test('Should average two numbers', () => {
      assert.strictEqual(mod.ijruAverage([1, 3]), 2)
    })

    await t.test('Should average the closest two of three numbers, when the lower two are closest', () => {
      assert.strictEqual(mod.ijruAverage([1, 10, 3]), 2)
    })

    await t.test('Should average the closest two of three numbers, when the higher two are closest', () => {
      assert.strictEqual(mod.ijruAverage([1, 10, 8]), 9)
    })

    await t.test('Should average the highest two of three numbers, when the numbers are equidistant', () => {
      assert.strictEqual(mod.ijruAverage([1, 1 + 3, 1 + 3 + 3]), 5.5)
    })

    await t.test('Should average all except highest and lowest for four numbers', () => {
      assert.strictEqual(mod.ijruAverage([119, 114, 111, 118]), 116)
    })

    await t.test('Should average all except highest and lowest for five numbers', () => {
      assert.strictEqual(mod.ijruAverage([119, 114, 131, 111, 118]), 117)
    })
  })
})
