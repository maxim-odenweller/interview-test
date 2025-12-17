export async function getAllUsers(backendUrl) {
  try {
    const response = await fetch(`${backendUrl}/users`)
    
    if (!response.ok) {
      throw new Error(`Backend returned status ${response.status}`)
    }
    
    const users = await response.json()
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(users),
        },
      ],
    }
  } catch (error) {
    throw new Error(`Failed to get all users: ${error.message}`)
  }
}

