import { DomDTMC, DomFSA, DomLTL, DomMPM, DomRegEx, DomSDF } from "../../config/model";
import { typePublic } from "../modelsdbinterface";

export const ExampleModels = [
    {
        "name": "Eggs - Box",
        "content": "dataflow graph Eggs {\n    inputs i\n    outputs o\n    \n    i        -- consumption rate: 4 -----------------------> Clean\n    Clean[1] -- production rate: 4; consumption rate: 10 --> Box\n    Box      -- initial tokens: 1 ------------------------> Box\n    Box[1]   -- production rate: 10 -----------------------> o\n}\n\ninput signals\ni = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]",
        "type": typePublic,
        "domain": DomSDF,
        "owner": "1",
        "ownerName": "TU/e",
        "group": "general"
    },
    {
        "name": "Wireless Channel Decoder",
        "content": "dataflow graph C1_WCD {\n    inputs i\n    outputs o\n    i       -------> Sh\n    Sh[4]   -- 1 --> Sh\n    Sh      -------> DM\n    DM[3]   -- 1 --> DM\n    DM      -------> CE\n    CE[3]   -- 1 --> CE\n    CE      -- 2 --> DM         // change n here\n    DM      -------> DC\n    DC[1]   -- 1 --> DC\n    DC      -------> o\n}\n\ninput signals \ni=[0, 4, 8, 12, 16, 20]\n",
        "type": typePublic,
        "domain": DomSDF,
        "owner": "1",
        "ownerName": "TU/e",
        "group": "general"
    },
    {
        "name": "Video Decoder",
        "content": "dataflow graph VideoDecoder {\n    VLD[2] ---> IDCT[3]\n    VLD - initial tokens: 1 --> VLD\n    IDCT - initial tokens: 1 --> IDCT\n    VLD -- consumption rate: 4 -> MC[7]\n    IDCT -- consumption rate: 4 -> RC[2]\n    MC ---> RC\n    RC - initial tokens: 1 --> MC\n\n}",
        "type": typePublic,
        "domain": DomSDF,
        "owner": "1",
        "ownerName": "TU/e",
        "group": "general"
    },
    {
        "name": "Manufacturing System",
        "content": "dataflow graph LittleXCPS {\n\n    inputs inBottoms, inTops\n    outputs out\n\n    // inputs\n    inBottoms -------> InB\n    inTops    -------> InT\n\n    // input coordination tops and bottoms\n    InB[0]   -------> Pass1 \n    Pass1[1] -- 1 --> InT\n    InT[0]   -------> Pass2 \n    Pass2[1] -------> InB\n\n    // bottom piece pipeline\n    InB      -------> BB   \n    BB[4]    -------> Rot  \n    Rot[2]   -- 1 --> PaP  \n    PaP[3]   -------> Exit \n    BB       -------> Exit\n    PaP      -------> Rot\n\n    // top piece pipeline\n    InT      -------> BT\n    BT[7]    -------> PaP\n\n    // the output\n    Exit[6] ---> out\n}\n\ninput signals\ninBottoms = [0, 0, 3, 4, 7]  \ninTops = [0,1,4,5,6]",
        "type": typePublic,
        "domain": DomSDF,
        "owner": "1",
        "ownerName": "TU/e",
        "group": "general"
    },
    {
        "name": "A Max-Plus Matrix",
        "content": "\nmax-plus model MPModel:\nmatrices\nA =\n[\n	[ -inf   -inf  -10  7 15]\n	[ 1 -inf -inf -inf 3 ]\n    [-inf 3 -inf -inf -inf]\n    [-inf -4 5 -inf 20]\n    [-inf -inf -inf -inf -1]\n]",
        "type": typePublic,
        "domain": DomMPM,
        "owner": "1",
        "ownerName": "TU/e",
        "group": "general"
    },
    {
        "name": "A Markov-Chain",
        "content": "markov chain Model {\n    A[p: 0.9] -- 1/2  -> B\n    A -- 1/2  -> A\n    B -- 1 -> C\n    C -- 1/2 -> C\n    C -- 1/2 -> A\n}",
        "type": typePublic,
        "domain": DomDTMC,
        "owner": "1",
        "ownerName": "TU/e",
        "group": "general"
    },
    {
        "name": "WLAN",
        "content": "finite state automaton WLAN {\n    S1 initial; final -- s --> S1\n    S1 --- h ---> S2\n    S2 --- p ---> S3\n    S3 --- p ---> S3\n    S3 --- c ---> S1\n\n    S2 --- # ---> S1\n    S3 --- # ---> S1\n}",
        "type": typePublic,
        "domain": DomFSA,
        "owner": "1",
        "ownerName": "TU/e",
        "group": "general"
    },
    {
        "name": "Always p then eventually q",
        "content": "ltl formula phi = G ( p => F q) \nalphabet {a, b, c, d}\nwhere \n    p = {a, b}\n    q = {c, d}\n",
        "type": typePublic,
        "domain": DomLTL,
        "owner": "1",
        "ownerName": "TU/e",
        "group": "general"
    },
    {
        "name": "An Omega Regular Expression",
        "content": "regular expression Test = (c+d)* . (a+b)**\n",
        "type": typePublic,
        "domain": DomRegEx,
        "owner": "1",
        "ownerName": "TU/e",
        "group": "general"
    },
    {
        "name": "A Regular Expression",
        "content": "regular expression MyRegex = \n    (d* + f*)* + \\o + \\e + @AB\nwhere AB = a + b",
        "type": typePublic,
        "domain": DomRegEx,
        "owner": "1",
        "ownerName": "TU/e",
        "group": "general"
    }
]




