bun run build

# Not sure what is removing the runtime bundle from the dependency, we manually add it here.
# We should find a better solution to this.
cp -rp node_modules/ruru/bundle ./.output/server/node_modules/ruru/.

node .output/server/index.mjs

# Until crossws is updated in vinxi (probably to 0.3.1), we have to use node.
#bun .output/server/index.mjs
