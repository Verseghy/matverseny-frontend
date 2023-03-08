import { createEffect, createRenderEffect } from 'solid-js'
import { createLocalStore } from './store'
import { usePrefersDark } from '@solid-primitives/media'


export type Theme = 'light' | 'dark'

const [storeTheme, setStoreTheme] = createLocalStore<{theme: Theme | null}>('theme', { theme: null })

export const theme = () => storeTheme.theme ?? 'light'
export const setTheme = (theme: Theme) => setStoreTheme({ theme })

const html = document.querySelector('html')!
createRenderEffect(() => {
  if (storeTheme.theme === 'light') {
    html.classList.remove('dark-theme')
  } else {
    html.classList.add('dark-theme')
  }
})


const prefersDark = usePrefersDark()

if (storeTheme.theme === null) {
  setTheme(prefersDark() ? 'dark' : 'light')
}

createEffect((prev) => {
  prefersDark()
  if (!prev) return true
  setTheme(prefersDark() ? 'dark' : 'light')
  return true
}, false)

setTheme(theme())
