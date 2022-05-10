# Dataflow and Max-Plus Linear Systems

The domain of dataflow and max-plus linear support performance analysis of deterministic timed discrete-event models. It is discussed in Part C of the reader [5xie0-reader.pdf](RESTRICTED_STATIC_PATH/pdf/5xie0-reader.pdf).
It includes two concrete types of models. One type are dataflow models. The other includes max-plus linear models.

## Dataflow Models

The following is an example of a dataflow model.

    dataflow graph Model {
        inputs i
        outputs o

        i --> A
        A[1] ---> B
        B[2.5] - initial tokens: 1 --> A
        B --> o
    }

    input signals
    i = [-inf, 0, 5, 10]
    i2= [0.0, 2.0, 4.0, 6.0]

### Syntax of Dataflow Models

Dataflow models are a graph-like structure and the discussion about [syntax of graphs](./02_generalsyntax) applies.
The syntax of a dataflow model always starts with `dataflow graph <name> {`. It ends with a closing curly bracket `}`.
If the graph has inputs, they can be declared as: 

`inputs <input1>, <input2>, ...`

If the graph has outputs, they can be declared as:

`outputs <output1>, <output2>, ...`

The core of the description of the dataflow model is in the form of dependencies `A -- <annotations> --> B`. `A` is either an actor or an input. `B` is either an actor or an output.

Actors can be followed by a specification of the firing duration. Actors without firing duration specification have a default duration of 0. The specification needs to be added only once with an arbitrary mention of the actor. The specification has the form `[execution time: <d>]`, or it can be shortened to `[<d>]`.

Optional `<annotations>` is one or more of the following, separated by `;`

- `initial tokens: <n>` declares that the channel has `n` initial tokens; it can be shortened to just `<n>`
- `production rate: <n>` declares the production rate of the producing actor onto the channel for a multi-rate graph
- `consumption rate: <n>` declares the consumption rate of the consuming actor from the channel for a multi-rate graph
- `name: <channelname>` gives the channel a name

The specification of the dataflow graph is optionally followed by the definition of input signals that can be offered to the inputs of the graph. An input signal is specified as follows.

`<name> = [ t1, t2, t3, ...]`
where `t1`, `t2`,`t3`, are time stamps, which can be written is integers or floating point numbers. The value can also be `-inf` to denote the value minus infinity.

`<name>` is a name for the signal. If it corresponds to the name of an input of the dataflow graph it may be automatically coupled. Alternative signals may be defined that can later be assigned to inputs of the dataflow graph.

### Operations on Dataflow Models

The work bench supports the following operations on dataflow models.

- *Repetition Vector* - Determines the repetition vector of a multi-rate dataflow graph;
- *Check Deadlock* - Checks if the graph deadlocks or not;
- *Throughput* - Computes the maximum throughput of the graph. The result is expressed in the number of iterations per time unit. For a single-rate graph this is equal to the number of firings per time unit for each of the actors;
- *Latency* - Computes the latency of the graph w.r.t. a given period &mu;, which needs to be provided and needs to be at least the reciprocal of the maximum throughput. The latency is reported as two matrices. One that provides the latency for every combination of input and output, and one that provides the latency for the initial state for every combination of an output and an initial token in the graph.
- *Convert to Single-Rate* - Converts a multi-rate graph to a single-rate graph;
- *State-Space Matrices* - Computes the max-plus state-space representation of the dataflow graph;
- *Make State-Matrix Model* - Determines the max-plus state matrix that expresses the relation between the time stamps of the initial tokens between iterations of the dataflow graph. The result is created as a new (scratch) model;
- *Make State-Space Matrices Model* - Determines the state-space representation in the form of a new max-plus model;
- *Gantt Chart* - Create a Gantt chart of the dataflow graph for a given number of iterations, initial state and inputs. The number of iterations is mandatory, initial state and input signals are optional. If no initial state is provided, it is assumed that all initial tokens are available at time 0.
The input traces can, optionally, be specified using one of the following methods. First, they can be specified explicitly as, for instance,
`i1=[-inf,0],i2=[-inf,-inf]`
Names can be omitted, in which case they will be mapped to the graph's inputs in order of definition of the inputs. Then the specification looks like this:
`[-inf,0],[-inf,-inf]`
Assignments of the following form are also allowed:
`i=i1` if `i1` is an event sequence defined in the model and `i` is an input of the model.

## Max-Plus Linear Models

Besides dataflow models. One can also make max-plus-linear models. A max-plus model can include any number of the following elements:

- *max-plus matrices*
- *vector sequences*
- *event sequences*

### Syntax

The overall syntax is as follows.

    max-plus model <name>:

    matrices 
    <matrix definitions>

    vector sequences
    <vector sequence definitions>

    event sequences
    <event sequence definitions>

#### Matrix Definitions

Matrices are defined like the following example.

    A (x1, x2) = [
        [ -inf    2  ]
        [  1    -inf ]
    ]

`A` in the example is the name of the matrix. For state-space matrices, the names `A`, `B`, `C` and `D` are used. The name of the matrix is optionally followed by a sequence of labels for the matrix rows/columns. The labels help to understand the interpretation of the matrices, for example the relation between a dataflow graph and the corresponding matrix.

- for an N&times;N square matrix one can provide N labels that are used for both rows and columns.
- for an N&times;M (possibly non-square) matrix one can provide N+M labels, first the row labels, followed by the column labels.

The matrix is specified row by row as in the example above. Elements may be separated by commas or white space.

#### Vector Sequence Definitions

The syntax for vector sequences follows the following example

    x (a, b) =
    [
        [ 0, -inf ],
        [ -inf,  0 ],
        [ 1, 1 ],
        [ 3, 3 ],
    ]

The syntax is similar to the syntax of matrices, but is interpreted as a sequence of vectors. The (optional) labels can specify names for the elements of the vectors.

#### Event Sequence Definitions

The following is an example of the specification of an event sequence

    h = [-inf 6 10 14 18 22 26 30 34]

### Operations on Max-Plus Models

The following operations are supported on max-plus models

- *Largest Eigenvalue* - Determines the largest eigenvalue of the (first) matrix defined in the model;
- *Eigenvectors* - determines all (generalized) eigenvalues and eigenvectors of a square matrix defined in the model;
- *Precedence Graph* - convert a square matrix defined in the model to an precedence graph;
- *Convert to Precedence Graph Image* - convert a square matrix defined in the model to an precedence graph image;
- *Convolution Analysis* - Compute the convolution between two selected event sequences in the model. The names of the two event sequences in the model need to be provided as a comma-separated list;
- *Convolution Transformation* - Compute the convolution between two selected event sequences in the model - store the result as a new model;
- *Delay Sequence* - compute a delayed version of an event sequence where the sequence is delayed by a given number of samples; the name of the sequence and the number of samples to delay need to be provided;
- *Scale Sequence* - compute a scaled event sequence, where a given real-valued constant is added to all time stamps; the name of the event sequence and the constant to be added need to be provided;
- *Maximum Analysis*- Compute the maximum of the provided event sequences in the model; more than two event sequences may be provided;
- *Maximum Transformation*- Compute the maximum of selected event sequences in the model - store the result as a new model;
- *Compute Output Vector Trace of State-Space* - compute the sequence of output vectors for a state-space model for given initial state and sequence of input vectors; the vectors contain the combined information from the vectors $u(k)$, $x(k+1)$ and $y(k)$;
- *Compute Output Vector Trace of State-Space Transform* - compute the sequence of output vectors for a state-space model for given initial state and sequence of input vectors - store the result as a new model;
- *Visualize Vector Trace* - make a graphical vector trace for selected vector sequences and event sequences in the model.
