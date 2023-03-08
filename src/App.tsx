import type { Component } from 'solid-js'
import { Route, Router, Routes } from '@solidjs/router'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register';

const App: Component = () => {
  return (
    <main>
      <Router>
        <Routes>
          <Route path="/" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
