import preset from '../../../graphile.config'
import * as postgraphile from 'postgraphile'

// Our PostGraphile instance:
export const pgl = postgraphile.postgraphile(preset)

export const schema = pgl.getSchema()
