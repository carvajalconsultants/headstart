import preset from "./graphile.config";
import postgraphile from "postgraphile";

// Our PostGraphile instance:
export const pgl = postgraphile(preset);
