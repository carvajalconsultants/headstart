// Types are temporary as we're gonna use codegen 👿

type Charity = {
  id: string
  name: string
}

type CharitiesEdge = {
  cursor: string
  node: Charity
}

export type CharitiesData = {
  charities: {
    edges: CharitiesEdge[]
  }
}
