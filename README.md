# Lambda Piper
Pipe-And-Filter using lambda functions

------

A very simple, yet powerful architecture, that is also very robust. It consists of any number of components (filters) that transform or filter data, before passing it on via connectors (pipes) to other components. The filters are all working at the same time. The architecture is often used as a simple sequence, but it may also be used for very complex structures.

Use the Pipes and Filters architectural style to divide a larger processing task into a sequence of smaller, independent processing steps (Filters) that are connected by channels (Pipes).

Lambda Piper allows you to create a linear pipeline using AWS Lambda functions. You can pipe several Lambda function with an initial input. Lambda piper will invoke the first function with the initial input, then get the result of that function and feed it as the input to next function and this pipeline continues, finally returning the results of the last function.
