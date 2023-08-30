export class RSRError extends Error {}

export class RSRWrongJudgeTypeError extends RSRError {
  constructor (actual: string, expected: string) {
    super(`Scoresheet for JudgeType ${actual} provided to calculation function for JudgeType ${expected}`)
  }
}
