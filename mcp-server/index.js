#!/usr/bin/env node

import express from 'express'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

import { getUser } from './tools/get-user.js'
import { getAllUsers } from './tools/get-all-users.js'
import { createUser } from './tools/create-user.js'
import { createUserFinished } from './tools/create-user-finished.js'
import { deleteUser } from './tools/delete-user.js'

const PORT = process.env.PORT || 3001
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3000'

const server = new Server(
  {
    name: 'user-management-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

const handleListTools = async () => {
  return {
    tools: [
      {
        name: 'get_user',
        description: 'Get a user by ID from the backend',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the user to retrieve',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_all_users',
        description: 'Get all users from the backend',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'create_user',
        description: 'Create a new user in the backend',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The name of the user',
            },
            email: {
              type: 'string',
              description: 'The email address of the user',
            },
          },
          required: ['name', 'email'],
        },
      },
      {
        name: 'create_user_finished',
        description: 'Create a new user in the backend (solution implementation)',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The name of the user',
            },
            email: {
              type: 'string',
              description: 'The email address of the user',
            },
          },
          required: ['name', 'email'],
        },
      },
      {
        name: 'delete_user',
        description: 'Delete a user by ID from the backend',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the user to delete',
            },
          },
          required: ['id'],
        },
      },
    ],
  }
}

const handleCallTool = async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'get_user':
        return await getUser(BACKEND_URL, args)
      
      case 'get_all_users':
        return await getAllUsers(BACKEND_URL)
      
      case 'create_user':
        return await createUser(BACKEND_URL, args)
      
      case 'create_user_finished':
        return await createUserFinished(BACKEND_URL, args)
      
      case 'delete_user':
        return await deleteUser(BACKEND_URL, args)
      
      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    }
  }
}

server.setRequestHandler(ListToolsRequestSchema, handleListTools)
server.setRequestHandler(CallToolRequestSchema, handleCallTool)

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }
  next()
})

app.use(express.json())

app.post('/mcp', async (req, res) => {
  try {
    const message = req.body
    
    if (!message || !message.jsonrpc || message.jsonrpc !== '2.0') {
      return res.status(400).json({
        jsonrpc: '2.0',
        id: message?.id || null,
        error: {
          code: -32600,
          message: 'Invalid Request',
        },
      })
    }

    let response
    if (message.method === 'tools/list') {
      response = await handleListTools()
      return res.json({
        jsonrpc: '2.0',
        id: message.id,
        result: response,
      })
    } else if (message.method === 'tools/call') {
      response = await handleCallTool({ params: message.params })
      return res.json({
        jsonrpc: '2.0',
        id: message.id,
        result: response,
      })
    } else if (message.method === 'initialize') {
      return res.json({
        jsonrpc: '2.0',
        id: message.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'user-management-server',
            version: '1.0.0',
          },
        },
      })
    }

    res.json({
      jsonrpc: '2.0',
      id: message.id,
      error: {
        code: -32601,
        message: `Method not found: ${message.method}`,
      },
    })
  } catch (error) {
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body?.id || null,
      error: {
        code: -32603,
        message: error.message,
      },
    })
  }
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`MCP server running on http://0.0.0.0:${PORT}`)
  console.log(`MCP Inspector: Connect to http://localhost:${PORT}/mcp`)
})

