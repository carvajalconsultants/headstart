import { Provider as UrqlProvider } from 'urql'
import client from '../utils/client'

export default function UrqlSSRProvider({ children }: React.PropsWithChildren) {
  return <UrqlProvider value={client}>{children}</UrqlProvider>
}
