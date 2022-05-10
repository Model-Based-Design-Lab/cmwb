# General notes on syntax

## Graph Structures

All three domains use models that are represented by a graph structure, i.e., as vertices (nodes), which have names, and edges between two vertices.
In models, they are represented by an arrow:

    S1 ----> S2

The length of the arrow (number of '`-`' symbols) is irrelevant. `S1` is the source vertex and `S2` is the target vertex. Depending on the context, vertices and.or edges may have annotations that are added between square brackets, for example:

    S1 [...] -- [...] --> S2 [...]

White space can be added freely.

Multiple edges can be written in a list, typically, but not necessarily, starting on a new line

    S1 ----> S2
    S1 ----> S3
    S2 ----> S2

If a vertex occurs multiple times, e.g., `S1` above, annotations need to be written only once, for an arbitrary instance of the vertex.

Occasionally a syntax allows the use of string literals. They can be written with either single quote delimiters or double quote delimiters, for example `'#'`, or `"'"`.

## Comments

Comments can be added to models using the common single line `//` and multiline `/* ... */` patterns.
When `//` appears in a model, all input starting from `//` till the end of the line in which it occurs is considered a comment and ignored for the model.
When `/*` appears in a model, all input starting from `/*` up to and including the first following occurrence of `*/` is considered a comment and ignored for the model.
