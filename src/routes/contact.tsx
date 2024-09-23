import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: ContactComponent,
  loader: async () => {
    // Simulate fetching data from an API
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { message: 'This message was loaded server-side!' }
  },
})

function ContactComponent() {
  const { message } = Route.useLoaderData()

  return (
    <div>
      <h2>Contact Page</h2>
      <p>{message}</p>
    </div>
  )
}
