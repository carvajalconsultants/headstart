import { execute } from 'grafast'
import { CombinedError, Exchange, Operation, OperationResult } from 'urql'
import { fromPromise, mergeMap, pipe } from 'wonka'

// TODO: If we import from ./pgl then it doesn't show the result
// TODO: If we make custom schema and query then it works.
// import { schema } from './pgl'
import { schema } from './schema'

export const grafastExchange: Exchange =
  ({ forward }) =>
  ops$ => {
    return pipe(
      ops$,
      mergeMap(operation => fromPromise(runGrafastQuery(operation)))
    )
  }

async function runGrafastQuery(operation: Operation): Promise<OperationResult> {
  try {
    const schemaInstance = await schema
    const result = await execute({
      schema: schemaInstance,
      document: operation.query,
      variableValues: operation.variables ?? {},
    })

    if (!result || typeof result !== 'object' || !('data' in result)) {
      throw new Error('Unexpected result format from execute')
    }

    const { data, errors, extensions } = result

    console.log('result :', result)

    if (errors && errors.length > 0) {
      return {
        operation,
        data,
        error: new CombinedError({ graphQLErrors: [...errors] }),
        extensions,
        stale: false,
        hasNext: false,
      }
    }

    return {
      operation,
      data,
      error: undefined,
      extensions,
      stale: false,
      hasNext: false,
    }
  } catch (error) {
    return {
      operation,
      data: undefined,
      error: new CombinedError({
        networkError: error instanceof Error ? error : new Error(String(error)),
      }),
      extensions: undefined,
      stale: false,
      hasNext: false,
    }
  }
}
