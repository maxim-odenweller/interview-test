export async function createUserFinished(backendUrl, args) {
  const { name, email } = args
  
  if (!name || !email) {
    throw new Error('Name and email are required')
  }
  
  try {
    const response = await fetch(`${backendUrl}/users`, {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create user')
    }
    
    const user = await response.json()
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(user),
        },
      ],
    }
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`)
  }
}

