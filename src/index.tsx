/* @refresh reload */
import { render } from 'solid-js/web'
import 'katex/dist/katex.min.css'

import './index.css'
import './colors.scss'
import App from './App'

const root = document.getElementById('root');
render(() => <App />, root!);
