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
