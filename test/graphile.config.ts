import "postgraphile"; // To import the TypeScript types
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makePgService } from "postgraphile/adaptors/pg";

const preset: GraphileConfig.Preset = {
  extends: [PostGraphileAmberPreset],
  grafserv: { port: 5678 },
  pgServices: [makePgService({ connectionString: "postgres:///localhost/origos" })],
};

export default preset;