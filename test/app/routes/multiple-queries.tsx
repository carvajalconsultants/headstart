import { createFileRoute } from '@tanstack/react-router'
import { gql } from 'urql'

export const Route = createFileRoute('/multiple-queries')({
  component: MultipleQueries,
  loader: async ({ context }) => {
    const charitiesResult = await context.client.query(gql`
      query allCharities {
        allCharities(first: 5) {
          nodes {
            id
            name
          }
        }
      }
    `)

    const totalCountResult = await context.client.query(gql`
      query charitiesCount {
        allCharities {
          totalCount
        }
      }
    `)

    return {
      charities: charitiesResult.data.allCharities.nodes,
      totalCount: totalCountResult.data.allCharities.totalCount,
    }
  },
})

function MultipleQueries() {
  const { charities, totalCount } = Route.useLoaderData()

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4">Multiple Queries Example</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Total Charities: {totalCount}</h2>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Charities</h3>
        {charities.map((charity, index) => (
          <div key={charity.id} className="bg-gray-800 shadow-md rounded-lg p-4 mb-2">
            <h4 className="text-white">
              {index + 1}) {charity.name}
            </h4>
          </div>
        ))}
      </div>
    </div>
  )
}
