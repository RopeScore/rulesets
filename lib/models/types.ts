import { isObject } from '../helpers'

export interface JudgeType<Schema extends string> {
  /**
   * This should be unique for the model, but may be the same as a judge used
   * in another model. FOr example it could be D for a Difficulty judge.
   */
  id: string
  /**
   * This is the human readable name for the judge type,
   * such as Athlete Presentation
   */
  name: string
  /**
   * Field
   */
  fieldDefinitions: Readonly<Array<JudgeFieldDefinition<Schema>>>
  /**
   * This takes a judge scoresheet, and summarises it into a judge score.
   */
  calculateScoresheet: (scoresheet: Scoresheet<Schema>) => JudgeResult
}

export type JudgeTypeGetter<Schema extends string = string, Option extends string = string> = (options: Partial<Record<Option, unknown>>) => Readonly<JudgeType<Schema>>

export interface JudgeFieldDefinition<Schema extends string> {
  /**
   * an unique identifier for this field to identify it's marks or tally.
   * Multiple judge types can however be using this field with the same schema,
   * if they all judge the same thing.
   */
  schema: Schema
  /**
   * The human readable name of the field, such as "Level 8"
   */
  name: string
  /** the minimum value for this field, if not set the value is not capped */
  min?: number
  /** the maximum value for this field, if not set the value is not capped */
  max?: number
  /**
   * the allowed step increment for this field, for example if this is set to
   * 0.5 only values with a 0.5 increment is allowed (such as 0, 0.5, 1, 1.5...)
   * whereas setting it to 1 would only allow steps of 1 (0, 1, 2...)
   */
  step?: number
}

export type ScoreTally<Schema extends string = string> = Partial<Record<Schema, number>>

export interface MarkBase<Schema extends string> {
  /**
   * Unix epoch timestamp in milliseconds when this mark was recorded
   */
  readonly timestamp: number
  /**
   * Each new mark that's made increments this by one, the first mark should
   * have sequence 1 - it is used to identify missing marks (holey mark streams)
   * or to target a specific mark with an undo mark.
   */
  readonly sequence: number
  /**
   * This identifies the type of mark and generally matches up with the schema
   * of a JudgeFieldDefinition. However a mark stream/array can contain
   * additional marks with schemas that are unknown to the scoring model, if so
   * these will be ignored.
   */
  readonly schema: Schema | 'clear' | 'undo'
}

export interface GenericMark<Schema extends string> extends MarkBase<Schema> {
  /**
   * An optional numeric value for this field, usage is model dependent but in
   * general leaving this undefined will use a value of 1.
   */
  readonly value?: number
}
export function isGenericMark (x: unknown): x is GenericMark<string> { return isObject(x) && x.timestamp === 'numer' && x.sequence === 'number' && x.schema === 'string' }

/**
 * A clear mark tells the model to ignore any previous marks.
 */
export interface ClearMark extends MarkBase<string> {
  readonly schema: 'clear'
}
export function isClearMark (x: unknown): x is ClearMark { return isObject(x) && x.schema === 'clear' }

/**
 * A mark that targets a previous marks and undoes it. Cannot target a 'clear'
 * mark or other 'undo' mark.
 */
export interface UndoMark extends MarkBase<string> {
  readonly schema: 'undo'
  /** The sequence of the marks that this undoes */
  readonly target: number
}
export function isUndoMark (x: unknown): x is UndoMark { return isObject(x) && x.schema === 'undo' }

export type Mark<Schema extends string> = GenericMark<Schema> | UndoMark | ClearMark

export interface MarkScoresheet<Schema extends string> {
  judgeId: string
  marks: Readonly<Array<Mark<Schema>>>
}
export function isMarkScoresheet <Schema extends string = string> (scoresheet: unknown): scoresheet is MarkScoresheet<Schema> {
  return isObject(scoresheet) && 'marks' in scoresheet
}

export interface TallyScoresheet<Schema extends string> {
  judgeId: string
  tally: Readonly<ScoreTally<Schema>>
}
export function isTallyScoresheet <Schema extends string = string> (scoresheet: unknown): scoresheet is TallyScoresheet<Schema> {
  return isObject(scoresheet) && 'tally' in scoresheet
}

export type Scoresheet<Schema extends string> = MarkScoresheet<Schema> | TallyScoresheet<Schema>

export interface JudgeResult {
  judgeId: string
  judgeTypeId: string
  result: Record<string, number>
  // TODO: messages/warnings/metadata?
}

export interface EntryResult {
  entryId: string
  result: Record<string, number>
  // TODO: messages/warnings/metadata?
}

export interface CalculateEntryMeta {
  entryId: string // TODO: meta is arbitrary and set by the implementer?
}

export interface ModelOptionBase<Option extends string> {
  id: Option
  name: string
  type: string
}

export interface ModelOptionBoolean<Option extends string> extends ModelOptionBase<Option> {
  type: 'boolean'
}

export interface ModelOptionEnum<Option extends string> extends ModelOptionBase<Option> {
  type: 'enum'
  enum: unknown[]
}

export interface ModelOptionNumber<Option extends string> extends ModelOptionBase<Option> {
  type: 'enum'
  min?: number
  max?: number
  step?: number
}

export type ModelOption<Option extends string> = ModelOptionBoolean<Option> | ModelOptionEnum<Option> | ModelOptionNumber<Option>

// TODO: optional panel configuration
export interface CompetitionEventModel<Schema extends string = string, Option extends string = string> {
  /**
   * Takes the form <rulebook-identifer>.<model-name>@<version>
   */
  id: `${string}.${string}@${string}`
  name: string
  options: Readonly<Array<ModelOption<Option>>>

  judges: Array<JudgeTypeGetter<Schema, Option>>

  previewTable: TableDefinitionGetter<Option>
  resultTable: TableDefinitionGetter<Option>

  calculateEntry: (meta: CalculateEntryMeta, judgeResults: Readonly<Array<Readonly<JudgeResult>>>, options: Partial<Record<Option, unknown>>) => EntryResult | undefined
  /**
   * Note that this generally adds some property to the result indicating the
   * rank, the index/order of the array should not be used to show the rank.
   * The array should however be sorted so that you can simply loop over it and
   * get them sorted by rank for displaying.
   * @param results the return values of multiple calculateEntry calls
   * @returns
   */
  rankEntries: (results: Readonly<Array<Readonly<EntryResult>>>, options: Partial<Record<Option, unknown>>) => EntryResult[]
}

export type TableDefinitionGetter<Option extends string> = (options: Partial<Record<Option, unknown>>) => TableDefinition

export interface TableDefinition {
  groups?: TableHeaderGroup[][]
  headers: TableHeader[]
}

export interface TableHeader {
  text: string
  key: string
  formatter?: (n: number) => string
  color?: 'red' | 'green' | 'gray'
  component?: string // TODO: use competitionEntryId? Some other ID?
}

export interface TableHeaderGroup {
  text: string
  key: string
  color?: 'red' | 'green' | 'gray'
  rowspan?: number
  colspan?: number
}
