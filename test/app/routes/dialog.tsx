import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { gql, useQuery } from 'urql'
import { client } from '../graphql/clientProvider'

const charitiesQuery = gql`
  query firstFiveCharities {
    allCharities(first: 5) {
      nodes {
        id
        name
      }
    }
  }
`

export const Route = createFileRoute('/dialog')({
  component: DialogComponent,
})

function DialogComponent() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDialog = () => setIsOpen(!isOpen)

  return (
    <div>
      <button onClick={toggleDialog}>Open Dialog</button>
      {isOpen && <Dialog isOpen={isOpen} toggleDialog={toggleDialog} />}
    </div>
  )
}

function Dialog({ isOpen, toggleDialog }: { isOpen: boolean; toggleDialog: () => void }) {
  const [result] = useQuery({
    query: charitiesQuery,
    pause: !isOpen,
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">First 5 Charities</h2>
        {result.fetching ? <p>Loading...</p> : result.error ? <p>Error: {result.error.message}</p> : <ul>{result.data?.allCharities.nodes.map((charity: { id: string; name: string }) => <li key={charity.id}>{charity.name}</li>)}</ul>}
        <button onClick={toggleDialog} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  )
}
