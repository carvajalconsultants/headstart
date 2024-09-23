import { Provider as UrqlProvider } from 'urql'
import client from './client'

export default function UrqlSSRProvider({ children }: React.PropsWithChildren) {
  return <UrqlProvider value={client}>{children}</UrqlProvider>
}
