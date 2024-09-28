import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { execute } from 'grafast'
import { parse } from 'graphql'
import { schema } from '../../urql/graphile/schema'

export const Route = createAPIFileRoute('/api/graphql')({
  GET: async ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('query')
    const variables = url.searchParams.get('variables')

    if (!query) {
      return json({ errors: [{ message: 'Missing query parameter' }] }, { status: 400 })
    }

    return handleGraphQLRequest(query, variables ? JSON.parse(variables) : undefined)
  },
  POST: async ({ request }) => {
    const body = await request.json()
    const { query, variables } = body

    if (!query) {
      return json({ errors: [{ message: 'Missing query in request body' }] }, { status: 400 })
    }

    return handleGraphQLRequest(query, variables)
  },
})

async function handleGraphQLRequest(query: string, variables?: Record<string, any>) {
  try {
    const schemaInstance = await schema
    const result = await execute({
      schema: schemaInstance,
      document: parse(query),
      variableValues: variables,
    })

    return json(result)
  } catch (error) {
    console.error('GraphQL execution error:', error)
    return json({ errors: [{ message: 'An error occurred while processing the GraphQL request' }] }, { status: 500 })
  }
}
