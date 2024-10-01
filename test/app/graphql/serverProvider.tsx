import { FC, ReactElement } from 'react'
import { Provider } from 'urql'
import client from '../urql'

export const GraphProvider: FC<{ children: ReactElement }> = ({ children }) => <Provider value={client}>{children}</Provider>
