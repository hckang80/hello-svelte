export const request = async<T> (url = '', options = {}): Promise<T> => {
  try {
    const response = await fetch(url, options)
    if (response.ok) return await response.json()
    throw new Error('HTTP REQUEST FAILED')
  } catch (error) {
    console.error(error)
  }
}
