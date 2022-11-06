import appRoot from 'app-root-path'

// database settings
export const dbName = 'cmwb_models2'
// collection name is 'compmodmodels'
export const passwordDbName = 'cmwb_users2'
// collection name is 'passwordusermodels'
// collection name is 'accessgroupmodels' (?)
export const mongoDbHost = 'mongodb://localhost:27017'
export const containerMongoDbHost = 'mongodb://mongodb:27017'



// email settings
export const MAIL_HOST = 'smtp.tue.nl'
export const MAIL_HOST_PORT = 25

// codegen settings
export const webAppRoot = `${appRoot}`
export const binDir = `${webAppRoot}/bin`
export const codegenBin = `${binDir}/codegen/bin/computational-modeling-codegen`
export const latex2SvgBin = `${appRoot}/bin/latex2svg/latex2svg`
// export const graphvizBin = '/usr/bin/dot'
export const graphvizBin = 'dot'
export const codeGenOutputDir = `${appRoot}/codegenoutput`
export const exercisesDir = `${webAppRoot}/exercises`
export const previewDir = `${codeGenOutputDir}/previewcache`
// export const tempDir = `${codeGenOutputDir}/temp`
export const sdf3analyzeBin = '/home/es-admin/tools/sdf3/sdf3/build/release/Linux/bin/sdf3analyze-sdf'
export const sdf3convertSdfSadfBin = '/home/es-admin/tools/sdf3/sdf3/build/release/Linux/bin/sdf3convert-sdf-sadf'
export const sdf3analyzeFsmSadfBin = '/home/es-admin/tools/sdf3/sdf3/build/release/Linux/bin/sdf3analyze-fsmsadf'

// export const cmtraceBin = 'cmtrace'
export const cmtraceBin = `${binDir}/python/cmtrace`

// analysis settings
export const binLibFsa = `${binDir}/python/finitestateautomata`
export const binLibDtmc = `${binDir}/python/markovchains`
export const binLibSdf = `${binDir}/python/dataflow`
export const binLibMpm = `${binDir}/python/dataflow`

// child processes timeout, larger than OperationTimeout
export const DefaultChildProcessTimeoutSeconds = 125

// static files directory
export const restrictedStaticFilesDir = `${webAppRoot}/static/restricted`
export const publicStaticFilesDir = `${webAppRoot}/static/public`
