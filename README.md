# Task

## Start

### Run app

`docker compose up --build`

### MCP inspector

`npx @modelcontextprotocol/inspector@0.18.0`

- Transport Type -> Streamable HTTP
- URL -> [http://localhost:3001/mcp](http://localhost:3001/mcp)
- Connection Type -> Via Proxy
- Connect > Tools > List Tools

## Implementation

- Implement create-user function in create-user.js

Example curl:

```
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```
