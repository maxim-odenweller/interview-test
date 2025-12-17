export async function deleteUser(backendUrl, args) {
  const { id } = args
  
  if (!id) {
    throw new Error('User ID is required')
  }
  
  try {
    const response = await fetch(`${backendUrl}/users/${id}`, {
      method: 'DELETE',
    })
    
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
    
    return {
      content: [
        {
          type: 'text',
          text: `User with ID ${id} deleted successfully`,
        },
      ],
    }
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`)
  }
}

