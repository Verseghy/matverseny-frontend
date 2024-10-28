import { createRenderEffect, untrack } from 'solid-js'
import { createLocalStore } from './store'
import { usePrefersDark } from '@solid-primitives/media'


export type Theme = 'light' | 'dark' | 'auto'

const [storeTheme, setStoreTheme] = createLocalStore<{theme: Theme}>('theme', { theme: 'auto' })

export const theme = () => storeTheme.theme == 'auto' ? getPrefersDark() : storeTheme.theme
export const setTheme = (theme: Theme) => setStoreTheme({ theme })
const html = document.querySelector('html')!

createRenderEffect(() => {
  switch (storeTheme.theme) {
    case 'dark':
      html.classList.remove('force-light-theme')
      html.classList.add('force-dark-theme')
      break
    case 'light':
      html.classList.remove('force-dark-theme')
      html.classList.add('force-light-theme')
      break
    case 'auto':
      html.classList.remove('force-dark-theme')
      html.classList.remove('force-light-theme')
      break
  }
})

const prefersDark = usePrefersDark()
const getPrefersDark = () => untrack(prefersDark) ? 'dark' : 'light'
