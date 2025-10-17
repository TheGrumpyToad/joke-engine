// API utility functions for development and production

export async function callGenerateAPI(category: string, prompt: string) {
  // In development, we'll call the Netlify function directly
  // In production, this will be handled by Netlify's redirect
  const url = '/.netlify/functions/generate'
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        category,
        prompt
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    
    // In development, if the Netlify function isn't available, 
    // provide a helpful error message
    if (process.env.NODE_ENV === 'development') {
      return {
        success: false,
        error: 'Development mode: Netlify function not available. Please build and serve the production version or deploy to Netlify for full functionality.'
      }
    }
    
    throw error
  }
}
