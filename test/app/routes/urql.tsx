import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { gql } from 'urql'
import client from '../urql'

const CHARITIES_PER_PAGE = 3

export const Route = createFileRoute('/urql')({
  component: Urql,

  // Zod example
  // validateSearch: z.object({
  //   page: z.number().int().nonnegative().catch(0),
  // }),
  validateSearch: search =>
    search as {
      page: number
    },
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ deps: { page } }) => {
    const currentPage = Number(page) || 1

    const result = await client.query(
      gql`
        query allCharities($first: Int!, $offset: Int!) {
          allCharities(first: $first, offset: $offset) {
            nodes {
              id
              name
            }
            totalCount
          }
        }
      `,
      { first: CHARITIES_PER_PAGE, offset: (currentPage - 1) * CHARITIES_PER_PAGE }
    )

    return { ...result, currentPage }
  },
  pendingComponent: () => <div className="text-2xl font-bold text-center mt-8">Loading...</div>,
  errorComponent: ErrorComponent,
})

function Urql() {
  const { data, error, currentPage } = Route.useLoaderData()
  const [page, setPage] = useState(currentPage)
  const router = useRouter()

  const totalPages = Math.ceil((data?.allCharities?.totalCount || 0) / CHARITIES_PER_PAGE)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    router.navigate({ search: { page: newPage } })
  }

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4">Charities</h1>
      {data?.allCharities?.nodes?.length ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.allCharities.nodes.map((charity: any) => (
              <CharityCard key={charity.id} charity={charity} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:bg-gray-300">
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="px-4 py-2 ml-2 bg-blue-500 text-white rounded disabled:bg-gray-300">
              Next
            </button>
          </div>
        </>
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
function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Details:</h2>
          <pre className="bg-red-100 p-3 rounded-md text-sm overflow-x-auto">{JSON.stringify(error, null, 2)}</pre>
        </div>
        <button onClick={() => window.location.reload()} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
          Try Again
        </button>
      </div>
    </div>
  )
}
