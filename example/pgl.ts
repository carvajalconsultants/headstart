import { postgraphile } from "postgraphile";
import preset from "./graphile.config";

// Our PostGraphile instance:
export const pgl = postgraphile(preset);
