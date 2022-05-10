# Regular Languages and Automata

The domain of languages and automata encompasses three concrete models, **finite state automata**, **regular expressions** and **linear temporal logic**. They are described separately below.

## Regular Expressions (RegEx)

Regular expressions are discussed in Section A.2 of the reader [5xie0-reader.pdf](RESTRICTED_STATIC_PATH/pdf/5xie0-reader.pdf).

### Example

    regular expression re = a + b* . d

### Syntax RegEx

The syntax of a regular expression always starts with `regular expression <name> =`. After that, the actual regular expression is written.
Regular expressions are constructed from the following primitives and operators (see the reader for their explanations):

- the empty set, which is denoted by `\o`;
- the empty word, which is denoted by `\e`;
- a symbol from the alphabet is either written by a single upper or lower case letter, such as `a` or `Z`, or an arbitrary sequence of characters, placed between single or double quotes, e.g., `'.'` or `"'"`;
- the union of two or more expressions is written by placing the `+` symbol between them;
- the concatenation of two or more expressions is written by placing the `.` symbol between them;
- the Kleene closure of a regular expression is written with the `*` symbol behind it.
- for &omega;-regular expressions, the indefinite repetition of a regular expression is written with the `**` symbols behind it.
- parentheses can be used to group expressions, e.g., `(a+b)**`; without parentheses, the order of priority of operators is: Kleene star. &omega; repetition, concatenation, union.

`where` clauses can be used to introduce short hand to avoid a lot of repetition of similar subexpressions. It is used as in the following example.

    regular expression number = @Digit . @Digit* . '.' . @Digit . @Digit*
    where Digit = '0' + '1' +'2' +'3' +'4' +'5' +'6' +'7' +'8' +'9'

 `where` is added after the expression, followed by a list of definitions of the form `<name> = <regular expression>`. `@` followed by the name of a definitions refers to the regular expression of the definition. The regular expressions can in turn use references to their definitions, but definitions cannot be cyclic.

### Operations RegEx

In the workbench, regular expressions support the following operations.

- *Convert to FSA*, which converts the regular expression to a non-deterministic finite state automaton that accepts the same language.
- *Convert &omega; Regular Expression to NBA* - converts an &omega;-regular expression to a non-deterministic B&uuml;chi automaton (NBA) that accepts the same language;

### Finite State Automata (FSA)

Finite State Automata (also called Finite Automata, or FA) on finite words are discussed in Section A.2 of the reader [5xie0-reader.pdf](RESTRICTED_STATIC_PATH/pdf/5xie0-reader.pdf). Finite State Automata on infinite words, called $\omega$-automata, or Büchi automata, are discussed in Section A.4 of that reader.

### Example FSA

    finite state automaton Model {
            S [initial] -- a ----> T [final]
            T -- a;b --> S
    }

### Syntax FSA

Finite State Automata are a graph-like structure and the discussion about [syntax of graphs](./02_generalsyntax) applies.
The syntax of a finite state automaton always starts with `finite state automaton <name> {`. It ends with a closing curly bracket `}`.
The core of the description of the FSA is in the form of transitions `S -- a --> T`. Transitions are labelled with symbols from the alphabet of the FSA (`a` in the example). A transition without a symbol represents an $\epsilon$ transition. A transition can be labelled with multiple symbols separated by commas, for example `S -- a, b, # --> T`. This is a short-hand notation for a transition for each of the symbols. In this case, `#` can be used for an $\epsilon$ transition.

Symbol names are combinations of letters, numbers and the underscore character `_` that start with a letter. Additionally, arbitrary symbol names can be written by enclosing the name with single or double quotation marks.

State names follow the same requirements, but have the additional possibility of using tuple-like (such as `(S,T)`) or set-like (such as `{S,t}`) notation. These can also be mixed arbitrarily, recursively, so that `({A,B},{X,Y})` is also a valid state name. **It is important to note that in the set-like notation, state names are still compared literally** `{A,B}` is not the same as `{B,A}`

States can have different annotations to denote if the state is an initial state or a final (accepting) state.
For example, `S [initial; final]` denotes that `S` is both an initial state and a final state. Annotations are separated by semicolon `;`. `final` can be abbreviated to `f`. `initial` can be abbreviated to `i` and the enclosing square brackets are optional, so `S f;i` is also valid. Annotations do not need to be repeated every time a state is mentioned, but can be added anywhere.

Generalized acceptance conditions can be specified by adding a label after the `final` label, e.g., `S final[A]`, `T final[A,B]` defines two acceptance sets A = {`S`,`T`} and B = {`T`}. If the model has additional final states that are not labelled with a named acceptance set, then those states together also form a separate acceptance set.

Occasionally there is a need to add states to an FSA that have no adjacent transitions. In that case, unconnected states can be added by adding the keyword `states` at the end of the description followed by a list of states (possibly including annotations), such as in the following model.

    finite state automaton A {
        S --> T
        states U V W f;i
    }

### Operations FSA

The following operations can be performed on FSA models.

- *Convert to DFA* - converts a non-deterministic automaton (NFA) to a deterministic automaton (DFA);
- *Eliminate $\epsilon$* - eliminates all $\epsilon$ transitions from an NFA;
- *Make Complete* - make the automaton complete, by adding transitions and a state where needed to make sure that every states has an outgoing transition for every symbol of the alphabet; non-deterministic automata (NFA) are first converted to a DFA.
- *Check for Emptiness* - analyze if the language defined by the automaton, interpreted as an automaton on finite words is empty or not;
<!-- - *Synchronous Product* - compute the synchronous product between two automata on finite words. Automata are **allowed** to take transitions without synchronization on symbols that are not present in the alphabet of the other automaton; -->
- *Synchronous Product* - compute the synchronous product between two automata on finite words. Automata are **not allowed** to take transitions without synchronization on symbols that are not present in the alphabet of the other automaton;
<!-- - *Synchronous Product NBA* - compute the synchronous product between two automata on infinite words. Automata are **allowed** to take transitions without synchronization on symbols that are not present in the alphabet of the other automaton; -->
- *Complement* - compute the complement of the automaton on finite words;
- *Check Word Acceptance* - analyze if a given word is accepted by the automaton on finite words;
- *Check Determinism* - check if the automaton is deterministic;
- *Determine Alphabet* - determine the alphabet of the automaton;
- *Check Language Inclusion* - check if the language of one automaton on finite words is included in the language of another automaton;
- *Minimize* - minimize an automaton. Tries to find a smaller automaton that accepts the same language. Note that it does not necessarily give the smallest possible automaton that accepts the same language;
- *Relabel States* - replace the state labels of an automaton with labels of the form `S` followed by a number;
- *Convert to Regular Expression* - converts the automaton on finite words into a regular expression that defines the same language.

#### Operations NBA

The following operations can be performed on FSA models that represent B&uuml;chi automata.

- *Check for Emptiness NBA* - analyze if the language defined by the automaton, interpreted as an automaton on infinite words is empty or not;
- *Synchronous Product NBA* - compute the synchronous product between two automata on infinite words. Automata are **not allowed** to take transitions without synchronization on symbols that are not present in the alphabet of the other automaton;
- *Minimize* - minimize an automaton. Tries to find a smaller automaton that accepts the same language. Note that it does not necessarily give the smallest possible automaton that accepts the same language;


## Linear Temporal Logic (LTL)

Linear Temporal Logic is discussed in Section A.5 of the reader [5xie0-reader.pdf](RESTRICTED_STATIC_PATH/pdf/5xie0-reader.pdf).

### Example LTL

    ltl formula phi =  G a => X ((not a) U b)

### Syntax LTL

The syntax of LTL formulas always starts with `ltl formula <name> =`. After that, the actual formula is written.
LTL formulas are constructed from the following primitives and operators (see the reader):

- the literals, `true` and `false`;
- atomic propositions, e.g., `p`;
- conjunctions, formulas joined by the keyword `and`, e.g., `p and q and r`;
- disjunctions, formulas joined by the keyword `or`, e.g., `p or q and r`;
- the until operator `U`, e.g., `p U q`;
- the release operator `R`, e.g., `p R q`;
- the next operator `X`, e.g., `X p`;
- the eventually operator `F`, e.g., `F p`;
- the always operator `G`, e.g., `G p`;
- the negation operator `not`, e.g., `not X q`;
- the implication `=>`, e.g., `p => X not p`.
- parentheses can be used to group expressions, e.g., `p and (q or r)`; without parentheses, the order of priority of operators is: negation, always, eventually, next, implication (which is right-associative), release, until, conjunction, disjunction.

The formula is optionally followed by a definition of the alphabet considered for the language of the formula, for example:

    alphabet {a, b, c}

If no alphabet is explicitly specified, the alphabet is assumed to consist of all symbols mentioned in the definition.

Finally, an optional `where` clause can be used to introduce the atomic propositions. It uses the syntax as in the following example.

    where 
        p = {a, b}
        q = {c}

The example above defines the àtomic proposition `p` to refer to the set of symbols including `a` and `b`.
If an atomic proposition `p` in a formula is not defined in the `where` clause, it is assumed to be defined as `p = {p}`.

### Operations LTL

In the workbench, LTL formulas support a single operation, `convert to FSA`, which converts the formula to a non-deterministic finite state automaton that accepts the same language.
