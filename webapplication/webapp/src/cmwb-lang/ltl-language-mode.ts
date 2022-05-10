import * as monaco from "monaco-editor-core"

// import { languages.IMonarchLanguage } from 'monaco-editor-core'
// import ILanguage = monaco.languages.IMonarchLanguage
// import language from "monaco-editor-core"


export const ltlMonarchLanguage = <monaco.languages.IMonarchLanguage> {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',
    keywords: [
      'ltl', 'formula', 'alphabet' , 'where', 'true', 'false', 'and', 'or', 'not', 'G', 'F', 'U', 'X'
    ],
  
    typeKeywords: [
    ],
  
    operators: [
    ],
  
    // we include these common regular expressions
    // symbols:  /[=><!~?:&|+\-*\/\^%]+/,
    symbols:  /[=<!~?:&|+*\/\^%]+/,
  
    // C# style strings
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  
    // The main tokenizer for our languages
    tokenizer: {
      root: [
        // identifiers and keywords
        [/[a-z_$][\w$]*/, { cases: { '@keywords': 'keyword',
                                      '@default': 'identifier' } }],
        [/[A-Z][\w\$]*/, { cases: {
            '@keywords': 'keyword',
            '@default': 'identifier'
          }} ],  // to show class names nicely
  
        // whitespace
        { include: '@whitespace' },
  
        // delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, { cases: { '@operators': 'operator',
                                '@default'  : '' } } ],
  
        // numbers
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/\d+/, 'number'],
  
        // delimiter: after number because of .\d floats
        [/[;,.]/, 'delimiter'],
  
        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-terminated string
        [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],
  
        // characters
        [/'[^\\']'/, 'string'],
        [/(')(@escapes)(')/, ['string','string.escape','string']],
        [/'/, 'string.invalid']
      ],
  
      comment: [
        [/[^\/*]+/, 'comment' ],
        [/\/\*/,    'comment', '@push' ],    // nested comment
        ["\\*/",    'comment', '@pop'  ],
        [/[\/*]/,   'comment' ]
      ],
  
      string: [
        [/[^\\"]+/,  'string'],
        [/@escapes/, 'string.escape'],
        [/\\./,      'string.escape.invalid'],
        [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
      ],
  
      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/,       'comment', '@comment' ],
        [/\/\/.*$/,    'comment'],
        [/--.*->/,    'string'],
      ],
    }, 
  }
    