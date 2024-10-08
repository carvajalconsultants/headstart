import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { useState } from 'react'
import { gql, useMutation } from 'urql'
import { client } from '../graphql/clientProvider'

const ADD_CHARITY_MUTATION = gql`
  mutation AddCharity($input: CreateCharityInput!) {
    createCharity(input: $input) {
      charity {
        id
        name
      }
    }
  }
`

const DELETE_CHARITY_MUTATION = gql`
  mutation DeleteCharity($input: DeleteCharityInput!) {
    deleteCharity(input: $input) {
      charity {
        id
      }
    }
  }
`

const getCharities = createServerFn('GET', async () => {
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
  return result.data.allCharities.nodes
})

export const Route = createFileRoute('/add-charity')({
  component: AddCharity,
  loader: async () => await getCharities(),
  pendingComponent: () => <div className="text-2xl font-bold text-center mt-8">Loading...</div>,
})

function AddCharity() {
  const router = useRouter()
  const charities = Route.useLoaderData()
  const [newCharityName, setNewCharityName] = useState('')

  const [, addCharityMutation] = useMutation(ADD_CHARITY_MUTATION)
  const [, deleteCharityMutation] = useMutation(DELETE_CHARITY_MUTATION)

  const handleAddCharity = async () => {
    const charity = newCharityName.trim()

    if (charity) {
      const result = await addCharityMutation({
        input: {
          charity: {
            name: charity,
          },
        },
      })

      if (result.data) {
        setNewCharityName('')
        router.invalidate()
      } else if (result.error) {
        console.error('Error adding charity:', result.error)
      }
    }
  }

  const handleDeleteCharity = async (id: string) => {
    const result = await deleteCharityMutation({
      input: {
        id,
      },
    })

    if (result.data) {
      router.invalidate()
    } else if (result.error) {
      console.error('Error deleting charity:', result.error)
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add Charity</h1>
      <div style={{ marginBottom: '1rem' }}>
        <input type="text" value={newCharityName} onChange={e => setNewCharityName(e.target.value)} placeholder="Enter charity name" style={{ padding: '0.25rem 0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem', marginRight: '0.5rem' }} />
        <button
          onClick={handleAddCharity}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '0.25rem',
            cursor: 'pointer',
          }}>
          Add Charity
        </button>
      </div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Existing Charities:</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {charities.map((charity: { id: string; name: string }) => (
          <div
            key={charity.id}
            style={{
              backgroundColor: '#1f2937',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: '0.5rem',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white' }}>{charity.name}</h3>
            <button
              onClick={() => handleDeleteCharity(charity.id)}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '0.25rem',
                cursor: 'pointer',
              }}>
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
