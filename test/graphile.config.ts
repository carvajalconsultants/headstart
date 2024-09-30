import 'postgraphile' // To import the TypeScript types
import { makePgService } from 'postgraphile/adaptors/pg'
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'

const preset: GraphileConfig.Preset = {
  extends: [PostGraphileAmberPreset],
  grafserv: { port: 5678, graphiql: true, websockets: true, watch: true },
  // pgServices: [makePgService({ connectionString: 'postgres:///localhost/origos' })],
  pgServices: [makePgService({ connectionString: 'postgres://zia:zia123@localhost:5432/headstart' })],
}

export default preset
