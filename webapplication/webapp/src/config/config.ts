import { DomSDF, DomFSA, DomDTMC, DomLTL, DomRegEx, DomMPM, ModuleDTMC, ModuleFSA, ModuleSDF } from './model'

// on the server port should be 7000
// export const PORT = 3000
export const PORT = 7000
export const DEBUG_PORT = 8000

// on the real server:
// export const BASE_URL = `http://cm.ics.ele.tue.nl`
export const BASE_URL = `https://computationalmodeling.info`
export const CONTAINER_BASE_URL = `http://localhost:7999`
// local version
// export const BASE_URL = `http://localhost:${PORT}`


// base path for the application url, without trailing slash, e.g.
// root: ''
// with base cmwb: '/cmwb'
// for regular version:
export const BASE_PATH = '/cmwb'
// for debug version:
// export const BASE_PATH = '/test'

// path to the LSP server
// export const WSLSP_PATH = '/5xie0/wslsp/cmwb'
export const WSLSP_PATH = '/wslsp/cmwb'
export const CONTAINER_WSLSP_PATH = ''

// authentication settings
// special groups
export const GeneralGroup = "general"
export const NoneGroup = "none"
export const QuizGroup = "quiz"

export const configPath = `config/distconfig`


export const BASE_PATH_RESTRICTED = `${BASE_PATH}/restricted`

export const MODELS_PAGE_URL = new Map([
	[DomSDF,  `${BASE_PATH_RESTRICTED}/modules/sdf`],
	[DomFSA,  `${BASE_PATH_RESTRICTED}/modules/fsa`],
	[DomDTMC,  `${BASE_PATH_RESTRICTED}/modules/dtmc`],
	[DomLTL,  `${BASE_PATH_RESTRICTED}/modules/fsa`],
	[DomRegEx,  `${BASE_PATH_RESTRICTED}/modules/fsa`],
	[DomMPM,  `${BASE_PATH_RESTRICTED}/modules/sdf`],
	[ModuleSDF,  `${BASE_PATH_RESTRICTED}/modules/sdf`],
	[ModuleFSA,  `${BASE_PATH_RESTRICTED}/modules/fsa`],
	[ModuleDTMC,  `${BASE_PATH_RESTRICTED}/modules/dtmc`],
])

export const EDITOR_PATH = `${BASE_PATH_RESTRICTED}/editor`
export const VIEWGRAPH_PATH = `${BASE_PATH_RESTRICTED}/artifacts/viewgraph`
export const IMAGEARTIFACT_PATH = `${BASE_PATH_RESTRICTED}/artifacts/imageartifact`
export const DOWNLOADARTIFACT_PATH = `${BASE_PATH_RESTRICTED}/artifacts/downloadartifact`
export const ADMIN_USER_EDIT_PATH = `${BASE_PATH_RESTRICTED}/profile/adminedituser`
export const ADMIN_PATH = `${BASE_PATH_RESTRICTED}/profile/admin`


export const ValidModelNameRegEx = /^[^\<\>\?\%\$\@\*\'\"\\\/\']+$/

// expire the email verification token in 48 hrs
export const SignupTokenExpirySeconds = 48*60*60
// time to wait between password resets 30 min.
export const ResetPasswordTimeoutSeconds = 30*60

// operation timeout; note that the webserver has a timeout of 300sec. on requests
export const OperationTimeout = 100


export const BinaryEncoding = 'base64'

// CANVAS and SCORM
export const CANVAS_ORIGIN = "scorm.canvaslms.com"