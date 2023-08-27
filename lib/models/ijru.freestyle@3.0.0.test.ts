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
})
