import { Exchange } from '@urql/core'

// TODO: will work on it as needed
export const grafastExchange: Exchange = ({ client, forward }) => {
  return operations$ => {
    // <-- The ExchangeIO function
    // We receive a stream of Operations from `cacheExchange` which
    // we can modify before...
    const forwardOperations$ = operations$

    // ...calling `forward` with the modified stream. The `forward`
    // function is the next exchange's `ExchangeIO` function, in this
    // case `fetchExchange`.
    const operationResult$ = forward(operations$)

    // We get back `fetchExchange`'s stream of results, which we can
    // also change before returning, which is what `cacheExchange`
    // will receive when calling `forward`.
    return operationResult$
  }
}
