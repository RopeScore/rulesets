import { type OverallModel, type CompetitionEventModel } from '../lib/models/types.js'
import { type Overall, type CompetitionEvent } from '../lib/preconfigured/types.js'
import { type Ruleset } from '../lib/rulesets/types.js'
import { cEvtFromPath, globImport } from './generate-lists.js'

let exitCode = 0
function printError (path: string, message: string) {
  exitCode = 1
  console.error(`lib/${path}: line 1, col 1, Error - ${message}`)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function printWarning (path: string, message: string) {
  console.error(`lib/${path}: line 1, col 1, Warning - ${message}`)
}

async function run () {
  const cEvtModels = await globImport<CompetitionEventModel>('models/competition-events/*.ts', true)
  const overallModels = await globImport<OverallModel>('models/overalls/*.ts', true)
  const competitionEvents = await globImport<CompetitionEvent>('preconfigured/competition-events/**/*.ts', true)
  const overalls = await globImport<Overall>('preconfigured/overalls/**/*.ts', true)
  const rulesets = await globImport<Ruleset>('rulesets/*.ts', true)

  // Validate that id's match file names
  for (const [p, model] of [cEvtModels, overallModels, competitionEvents, overalls, rulesets].map(o => Object.entries(o)).flat()) {
    if (!('id' in model) || model.id == null) printError(p, 'Default export does not contain an id property')
    else if (cEvtFromPath(p) !== model.id) printError(p, `Filename doesn't match id property on default export: ${model.id}`)
  }

  // Validate that ids are unique within a category
  for (const categoryModels of [
    [...Object.entries(cEvtModels), ...Object.entries(overallModels)],
    [...Object.entries(competitionEvents), ...Object.entries(overalls)],
    Object.entries(rulesets),
  ]) {
    for (const [p, model] of categoryModels) {
      const dupes = categoryModels.filter(([_, m]) => m.id === model.id).map(([p]) => `lib/${p}`)
      if (dupes.length > 1) printError(p, `Multiple models with the same ID exists at: ${dupes.join(', ')}`)
    }
  }

  // validate that all dependencies exist for preconfigured overalls
  const cEvts = Object.values(competitionEvents)
  for (const [p, overall] of Object.entries(overalls)) {
    for (const cEvt of overall.competitionEvents) {
      const model = cEvts.find(m => m.id === cEvt)
      if (model == null) printError(p, `Configured component competition event ${cEvt} does not exist`)
    }
  }

  // validate that ruleset contains all models referenced by preconfigured
  for (const [p, ruleset] of Object.entries(rulesets)) {
    for (const preConf of ruleset.competitionEvents) {
      const modelIdx = ruleset.competitionEventModels.findIndex(m => m.id === preConf.modelId)
      if (modelIdx === -1) printError(p, `Model ${preConf.modelId} is not present in ruleset's competitionEventModels but is used by competitionEvent ${preConf.id}`)
    }

    for (const preConf of ruleset.overalls) {
      const modelIdx = ruleset.overallModels.findIndex(m => m.id === preConf.modelId)
      if (modelIdx === -1) printError(p, `Model ${preConf.modelId} is not present in ruleset's overallModels but is used by overall ${preConf.id}`)
    }
  }
}

run()
  .then(() => process.exit(exitCode))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
