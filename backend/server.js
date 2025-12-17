import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

let users = {}
let nextId = 1

app.use(express.json())

app.get('/users/:id', (req, res) => {
  const id = req.params.id
  const user = users[id]
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  
  return res.json(user)
})

app.get('/users', (_, res) => {
  return res.json(Object.values(users))
})

app.post('/users', (req, res) => {
  const { name, email } = req.body
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }
  
  const id = nextId.toString()
  nextId++
  
  const user = {
    id,
    name,
    email,
    createdAt: new Date().toISOString()
  }
  
  users[id] = user
  
  res.status(201).json(user)
})

app.delete('/users/:id', (req, res) => {
  const id = req.params.id
  
  if (!users[id]) {
    return res.status(404).json({ error: 'User not found' })
  }
  
  delete users[id]
  
  return res.status(204).send()
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`)
})

