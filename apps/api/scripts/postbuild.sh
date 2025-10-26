#!/bin/bash

if [[ "$NODE_ENV" == "production" ]]; then
  echo "Skipping postbuild for NODE_ENV=$NODE_ENV"
  exit 0
fi

#### Transfer api schema to types package
SCHEMA_PATH=../web/src/@types/schema.d.ts

cp dist/api.d.ts $SCHEMA_PATH

# Delete source map reference line
sed '$d' $SCHEMA_PATH > $SCHEMA_PATH.tmp && mv $SCHEMA_PATH.tmp $SCHEMA_PATH

# Transform to global d.ts syntax
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' 's|export declare const api: import("hono/hono-base").HonoBase<{},|type ApiSchema = import("hono").Hono<{},|' $SCHEMA_PATH
else
    # Linux
    sed -i 's|export declare const api: import("hono/hono-base").HonoBase<{},|type ApiSchema = import("hono").Hono<{},|' $SCHEMA_PATH
fi

# Remove the export type ApiSchema line
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' '/^export type ApiSchema = typeof api;$/d' $SCHEMA_PATH
else
    # Linux
    sed -i '/^export type ApiSchema = typeof api;$/d' $SCHEMA_PATH
fi

# Run prettier
pnpm prettier --write $SCHEMA_PATH

# Add Api namespace with Error type
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    cat >> $SCHEMA_PATH << 'EOF'

declare namespace Api {
  type Error = {
    error: string;
  };
}
EOF
else
    # Linux
    cat >> $SCHEMA_PATH << 'EOF'

declare namespace Api {
  type Error = {
    error: string;
  };
}
EOF
fi

# Add header comment
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' '1i\
// NOTE: File automatically generated, do not edit
' $SCHEMA_PATH
else
    # Linux
    sed -i '1i// NOTE: File automatically generated, do not edit' $SCHEMA_PATH
fi
#### End transfer
