import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makePgService } from "postgraphile/adaptors/pg";

/** @type {GraphileConfig.Preset} */
const preset = {
  extends: [PostGraphileAmberPreset],
  pgServices: [
    makePgService({
      connectionString: "postgres://zia:zia123@localhost:5432/headstart",
      name: "zia",
    })
  ],
  grafserv: { watch: true },
};

export default preset;
