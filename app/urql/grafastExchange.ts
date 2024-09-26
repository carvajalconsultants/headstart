import { CombinedError, Exchange, Operation, OperationResult } from '@urql/core'
import { execute } from 'grafast'
import { fromPromise, mergeMap, pipe } from 'wonka'
import { schema } from './graphile/schema'

console.log('Importing schema:', schema)

export const grafastExchange: Exchange = () => ops$ => {
  return pipe(
    ops$,
    mergeMap(operation => fromPromise(runGrafastQuery(operation)))
  )
}

async function runGrafastQuery<T>(operation: Operation<T>): Promise<OperationResult<T>> {
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

    if (errors && errors.length > 0) {
      return {
        operation,
        data: data as T,
        error: new CombinedError({ graphQLErrors: [...errors] }),
        extensions,
        stale: false,
        hasNext: false,
      }
    }

    return {
      operation,
      data: data as T,
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
