import { createLocalStore } from "./store"


export type Theme = 'light' | 'dark'

const [storeTheme, setStoreTheme] = createLocalStore<{theme: Theme}>('theme', { theme: 'light' })

export const theme = () => {
  return storeTheme.theme
}

const html = document.querySelector('html')!

export const setTheme = (theme: Theme) => {
  setStoreTheme({ theme })

  if (theme === 'light') {
    html.classList.remove('dark-theme')
  } else {
    html.classList.add('dark-theme')
  }

}

setTheme(theme())
