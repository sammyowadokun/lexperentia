export const loadState = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)
    console.log('Loading from localStorage:', key, saved)
    return saved ? JSON.parse(saved) : fallback
  } catch (error) {
    console.error(`Failed to load state for ${key}:`, error)
    return fallback
  }
}

export const saveState = (key, state) => {
  try {
    console.log('Saving to localStorage:', key, state)
    localStorage.setItem(key, JSON.stringify(state))
  } catch (error) {
    console.error(`Failed to save state for ${key}:`, error)
  }
}