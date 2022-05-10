# Discrete-Time Markov Chains

The domain of Discrete-Time Markov Chains (DTMC) supports the stochastic analysis of Markov Chain models.
Markov Chains are described in Part B of the reader [5xie0-reader.pdf](RESTRICTED_STATIC_PATH/pdf/5xie0-reader.pdf).

## Example DTMC

The model below is an example of a Markov Chain model.

    markov chain Model {
            A -- 1/2  -> B
            B -- 1/10 -> A
    }

## Syntax DTMC

Markov Chains are a graph-like structure and the discussion about [syntax of graphs](./02_generalsyntax) applies.
The syntax of a Markov Chain always starts with `markov chain <name> {`. It ends with a closing curly bracket `}`.
The core of the description of the DTMC is in the form of transitions `S -- <p> --> T`. Transitions are labelled with a probability that can be written as a fraction of integers, e.g., `2/3` or using decimal representation, such as `0.4`.

State names are combinations of letters, numbers and the underscore character `_` that start with a letter.

Self-transitions on states can be left implicit. If the total outgoing probability mass from a state is smaller than 1 and there is no self-transition in the model, then the remaining probability mass is assumed to be on an implicit self-transition.

States can optionally have annotations that are written between square brackets behind the state name, separated by semicolon, `;`. There are two possible annotations: *initial probability* and *reward*.

- the *initial probabilities* defines the probability to initially be in the annotated state. The annotation is as follows: `S[initial probability: <p>]`, where `<p>` is a probability as a rational fraction or in decimal notation. It can also be shortened as follows: `[p: 1/4]`. If the total specified initial probability mass is lower than 1, then the remaining probability mass is uniformly divided among the states without annotation of initial probability. In particular, if none of the states are annotated, a uniform initial distribution is assumed.
- the *rewards* annotation defines the reward gained when the state is visited. It is specified as follows: `S [reward: 5]`. The reward is an arbitrary positive or negative number specified as a rational fraction or a decimal number. The reward can be shortened as `S[r: 1/3]`. If no reward is specified for a state, it is assumed to be 0.

## Operations DTMC

The following operations can be performed on Markov Chain models.

- *Transient States* - inquires for a number of steps to analyze and determines the sequence of distributions for the given number of steps;
- *Transient Reward* - inquires for a number of steps to analyze and determines the sequence of expected rewards for the given number of steps;
- *Transient Matrix* - inquires for a number of steps and determines the transition matrix corresponding to the given number of steps;
- *Communicating Classes* - determines the equivalence classes of communicating states;
- *Classify Transient Recurrent* - classifies all states as either transient or recurrent;
- *Determine Periodicity* - determines the (a)periodicity of all the recurrent states;
- *Determine MC Type* - determines the type of the Markov Chain, whether it is ergodic, and whether it is a unichain;
- *Hitting Probability* - inquires for a state and determines the probability to hit that state from each of the states of the chain;
- *Reward until Hit* - inquires for a state and determines the expected reward gained until hitting that state from each of the states of the chain;
- *Hitting Probability Set* - inquires for a set of states and determines the probability to hit a state from that set from each of the states of the chain;
- *Reward until Hit Set* - inquires for a set of states and determines the expected reward gained until hitting any state from that set from each of the states of the chain;
- *Limiting Matrix* - computes the (Cezàro) limiting matrix for the Markov Chain;
- *Limiting Distribution* - computes the (Cezàro) limiting distribution for the Markov Chain;
- *Long-run Reward* - computes the long-run expected reward for an ergodic Markov Chain or the long-run expected average reward for a non-ergodic Markov Chain.
- *View Transition Diagram* - opens a separate view on the transition diagram.
