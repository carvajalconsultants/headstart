import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { gql, useSubscription } from 'urql'

const allCharitiesSubscription = gql`
  subscription AllCharities {
    allCharities {
      nodes {
        id
        name
      }
    }
  }
`

const handleSubscription = (prevCharities = [], response) => {
  return response.allCharities.nodes
}

export const Route = createFileRoute('/subscription')({
  component: SubscriptionComponent,
})

function SubscriptionComponent() {
  const [result] = useSubscription({ query: allCharitiesSubscription }, handleSubscription)

  if (!result.data) {
    return <p>No charities available</p>
  }

  return (
    <div>
      <h1>All Charities (Live)</h1>
      <ul>
        {result.data.map(charity => (
          <li key={charity.id}>{charity.name}</li>
        ))}
      </ul>
    </div>
  )
}
