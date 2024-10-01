import { createFileRoute, ErrorComponentProps } from '@tanstack/react-router'
import { gql } from 'urql'
import client from '../urql'

export const Route = createFileRoute('/urql')({
  component: Urql,
  loader: async () => {
    const result = await client.query(
      gql`
        query allCharities {
          allCharities {
            nodes {
              id
              name
            }
          }
        }
      `,
      {}
    )

    return result
  },
  pendingComponent: () => <div className="text-2xl font-bold text-center mt-8">Loading...</div>,
  errorComponent: ErrorComponent,
})

function Urql() {
  const { data, error } = Route.useLoaderData()

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4">Charities</h1>
      {data?.allCharities?.nodes?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.allCharities.nodes.map((charity: any) => (
            <CharityCard key={charity.id} charity={charity} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No charities found.</p>
      )}
      {error && <p className="text-red-500 mt-4">Oh no... {error.message}</p>}
    </div>
  )
}

// Component for rendering individual charity cards
function CharityCard({ charity }: { charity: { id: string; name: string } }) {
  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2 text-white">{charity.name}</h2>
      <p className="text-gray-400">ID: {charity.id}</p>
    </div>
  )
}

// Skeleton component for loading state
function CharityCardSkeleton() {
  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-5 space-y-4 animate-pulse">
      <div className="h-6 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
    </div>
  )
}

// Error component for handling and displaying errors
export default function ErrorComponent({ error, info, reset }: ErrorComponentProps) {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Details:</h2>
          <pre className="bg-red-100 p-3 rounded-md text-sm overflow-x-auto">{JSON.stringify(error, null, 2)}</pre>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Additional Information:</h2>
          <pre className="bg-red-100 p-3 rounded-md text-sm overflow-x-auto">{JSON.stringify(info, null, 2)}</pre>
        </div>
        <button onClick={reset} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
          Try Again
        </button>
      </div>
    </div>
  )
}
