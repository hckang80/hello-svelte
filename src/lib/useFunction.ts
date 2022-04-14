export const { localStorage: storage } = window

export const getItem = <T = string>(key: string): T => {
  try {
    const value = storage.getItem(key)
    return value ? JSON.parse(value) : ''
  } catch {
    return
  }
}

export const setItem = (key: string, value: unknown) => {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    throw new Error('Set not allowed')
  }
}

export const removeItem = (key: string) => {
  try {
    storage.removeItem(key)
  } catch {
    throw new Error('Remove not allowed')
  }
}


export const request = async<T>(url = '', options = {}): Promise<T> => {
  try {
    const response = await fetch(url, options)
    if (response.ok) return await response.json()
    throw new Error('HTTP REQUEST FAILED')
  } catch (error) {
    throw new Error(error)
  }
}
