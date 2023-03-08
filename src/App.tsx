import type { Component } from 'solid-js'
import { Route, Router, Routes } from '@solidjs/router'
import LandingPage from './pages/LandingPage'

const App: Component = () => {
  return (
    <main>
      <Router>
        <Routes>
          <Route path="/" component={LandingPage} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
