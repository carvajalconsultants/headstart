import { ssrExchange } from 'urql'

// TODO Does TSR have a better way to set this?
const isServerSide = typeof window === 'undefined';

export const ssr = ssrExchange({
    isClient: !isServerSide,
})
  