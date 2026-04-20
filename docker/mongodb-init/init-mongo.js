// Switch to (or create) a database
dbm = db.getSiblingDB("cmwb_models2");
dbu = db.getSiblingDB("cmwb_users2");

// collection name is 'compmodmodels'
//export const passwordDbName = 'cmwb_users2'
// collection name is 'passwordusermodels'
// collection name is 'accessgroupmodels' (?)


// Create collections
dbm.createCollection("compmodmodels");
dbu.createCollection("passwordusermodels");
dbu.createCollection("accessgroupmodels");

// Insert initial data

// a user with password cmwb
dbu.passwordusermodels.insertOne({
    _id: ObjectId('6856c9438394c8b024691500'),
    name: 'cmwb',
    email: 'cmwb@cmwb.org',
    verified: true, 
    verificationToken: 'no-verification-needed',
    verificationTokenCreatedAt: ISODate('2025-06-21T15:01:23.500Z'),
    isAdmin: true,
    group: 'general',
    accessibleGroups: [ 'general' ],
    activeGroup: 'general',
    createdAt: ISODate('2025-06-21T15:01:23.503Z'),
    lastPasswordReset: ISODate('2025-06-21T15:01:23.503Z'),
    id: '6856c9438394c8b024691500',
    __v: 0,
    passwordHash: 'c8e68f9a838fbc4f75b525da87a5c42a878cc49f2733f0073d46c3dab938a0a59d46c0334ce4485784255628e70cb419749fcd27919a911d5e6e3d1725a56bd5',
  }
)


dbm.compmodmodels.insertMany([
  {
    _id: ObjectId('5ffcb12339e6d1564f49fede'),
    name: 'ExampleFSA',
    content: 'finite state automaton Model {\n' +
      '        A initial -- a ----> B final\n' +
      '        B -- a;b --> A\n' +
      '}',
    domain: 'finitestateautomata',
    type: 'public',
    owner: '6856c9438394c8b024691500',
    ownerName: 'admin',
    createdAt: ISODate('2021-01-11T20:12:19.632Z'),
    modifiedAt: ISODate('2021-01-11T20:12:39.059Z'),
    id: '5ffcb12339e6d1564f49fede',
    __v: 0,
    group: 'general'
  },
  {
    _id: ObjectId('5ffcb07039e6d1564f49fedc'),
    name: 'ExampleLTL',
    content: 'ltl formula phi = G ( p => F q) \n' +
      'alphabet {a, b, c, d}\n' +
      'where \n' +
      '    p = {a, b}\n' +
      '    q = {c, d}\n',
    domain: 'lineartemporallogic',
    type: 'public',
    owner: '6856c9438394c8b024691500',
    ownerName: 'admin',
    createdAt: ISODate('2021-01-11T20:09:20.879Z'),
    modifiedAt: ISODate('2021-01-11T20:10:07.064Z'),
    id: '5ffcb07039e6d1564f49fedc',
    __v: 0,
    group: 'general'
  },
  {
    _id: ObjectId('5ffcb14e39e6d1564f49fedf'),
    name: 'ExampleRegEx',
    content: 'regular expression MyRegex = \n' +
      '    (d* + f*)* + \\o + \\e + @AB\n' +
      'where AB = a + b',
    domain: 'regularexpressions',
    type: 'public',
    owner: '6856c9438394c8b024691500',
    ownerName: 'admin',
    createdAt: ISODate('2021-01-11T20:13:02.990Z'),
    modifiedAt: ISODate('2021-03-28T16:20:00.204Z'),
    id: '5ffcb14e39e6d1564f49fedf',
    __v: 0,
    group: 'general'
  },
  {
    _id: ObjectId('5fe2151585b4831678859641'),
    name: "Gambler's Ruin",
    content: '\n' +
      'markov chain GamblersRuin { \n' +
      '        S1[p: 0.0; reward:   0] -- 1 ----> S1 \n' +
      '        S2[p: 0.5; reward: 100] -- 1/2 --> S1\n' +
      '        S2                      -- 1/2 --> S3\n' +
      '        S3[p: 0.5; reward: 200] -- 1/2 --> S2\n' +
      '        S3                      -- 1/2 --> S4\n' +
      '        S4[p: 0.0; reward: 300] -- 1 ----> S4        \n' +
      '}',
    domain: 'markovchains',
    type: 'public',
    owner: '6856c9438394c8b024691500',
    ownerName: 'admin',
    createdAt: ISODate('2020-12-22T15:47:33.023Z'),
    modifiedAt: ISODate('2020-12-22T15:48:46.770Z'),
    id: '5fe2151585b4831678859641',
    __v: 0,
    group: 'general'
  },
  {
    _id: ObjectId('5ffd840aaea0330404543023'),
    name: 'SDFExample',
    content: '\n' +
      'dataflow graph Model {\n' +
      '        A [execution time: 1] ---> B\n' +
      '        B [execution time: 1] - initial tokens: 1 --> A\n' +
      '}',
    domain: 'dataflow',
    type: 'public',
    owner: '6856c9438394c8b024691500',
    ownerName: 'admin',
    createdAt: ISODate('2021-01-12T11:12:10.813Z'),
    modifiedAt: ISODate('2021-01-12T11:12:31.253Z'),
    id: '5ffd840aaea0330404543023',
    __v: 0,
    group: 'general'
  },
  {
    _id: ObjectId('5ff8bbbba4531a479edc0d1d'),
    name: 'MatrixExample',
    content: '\n' +
      'max-plus model Model:\n' +
      '\n' +
      'matrices \n' +
      'A = [\n' +
      '\t[ -inf    2  ]\n' +
      '\t[  1    -inf ]\n' +
      ']\n' +
      '\n' +
      'B = [\n' +
      '    [0]\n' +
      '    [0]\n' +
      ']\n' +
      '\n' +
      'C = [\n' +
      '    [0 0]\n' +
      ' ]\n' +
      '\n' +
      'D = [[-inf]]',
    domain: 'mpmatrix',
    type: 'public',
    owner: '6856c9438394c8b024691500',
    ownerName: 'admin',
    createdAt: ISODate('2021-01-08T20:08:27.695Z'),
    modifiedAt: ISODate('2021-01-08T20:38:26.373Z'),
    id: '5ff8bbbba4531a479edc0d1d',
    __v: 0,
    group: 'general'
  },
  {
    _id: ObjectId('5ffd817faea033040454301d'),
    name: 'EventSequences',
    content: '\n' +
      'max-plus model MPModel:\n' +
      '\n' +
      'matrices\n' +
      '\n' +
      'A (x0 x1) = [[0 1 ] [ 1 0]]\n' +
      '\n' +
      'vector sequences\n' +
      '\n' +
      'v (i1 i2)= [\n' +
      '    [0 0]\n' +
      '    [2 3]\n' +
      '    [5 4]\n' +
      ']\n' +
      '\n' +
      'event sequences\n' +
      'h = [0 2 4 8 12 ]\n' +
      'x = [-inf 10 -inf -inf -inf -inf ]\n',
    domain: 'mpmatrix',
    type: 'public',
    owner: '6856c9438394c8b024691500',
    ownerName: 'admin',
    createdAt: ISODate('2021-01-12T11:01:19.274Z'),
    modifiedAt: ISODate('2021-01-12T11:02:27.645Z'),
    id: '5ffd817faea033040454301d',
    __v: 0,
    group: 'general'
  }
]);

