import { execute } from 'grafast'
import { pgl } from '../graphQLRouteHandler'
import { CombinedError, Exchange, Operation, OperationResult } from 'urql'
import { fromPromise, mergeMap, pipe } from 'wonka'
import { schema } from '../graphQLRouteHandler'

export const grafastExchange: Exchange = () => ops$ => {
  return pipe(
    ops$,
    mergeMap(operation => fromPromise(runGrafastQuery(operation)))
  )
}

async function runGrafastQuery(operation: Operation): Promise<OperationResult> {
  try {
    const schemaInstance = await pgl.getSchema();
    console.log(schemaInstance);

    const result = await execute({
      schema: schemaInstance,
      document: operation.query,
      variableValues: operation.variables ?? {},
    })

    if (!result || typeof result !== 'object' || !('data' in result)) {
      throw new Error('Unexpected result format from execute')
    }

    const { data, errors, extensions } = result

    console.log('GRAFAST EXCHANGE RESULT :', result)

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
    console.error('Error in runGrafastQuery:', error)

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
