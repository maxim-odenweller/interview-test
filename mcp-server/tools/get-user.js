export async function getUser(backendUrl, args) {
  const { id } = args
  
  if (!id) {
    throw new Error('User ID is required')
  }
  
  try {
    const response = await fetch(`${backendUrl}/users/${id}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          content: [
            {
              type: 'text',
              text: `User with ID ${id} not found`,
            },
          ],
        }
      }
      throw new Error(`Backend returned status ${response.status}`)
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
    throw new Error(`Failed to get user: ${error.message}`)
  }
}

