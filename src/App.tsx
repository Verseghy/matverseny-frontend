import type { Component } from 'solid-js'
import { Route, Router, Routes } from '@solidjs/router'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import { CreateTeam, JoinTeam, ManageTeam } from './pages/Teams'
import WaitPage from './pages/Wait'
import { SocketServiceSingleton } from './services/socket'
import { AuthService } from './services/auth'

export const authService = new AuthService('http://localhost:3001')
export const socketService = new SocketServiceSingleton('http://localhost:3002')

const App: Component = () => {
  return (
    <main>
      <Router>
        <Routes>
          <Route path="/" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/team">
            <Route path="/" component={JoinTeam} />
            <Route path="/create" component={CreateTeam} />
            <Route path="/manage" component={ManageTeam} />
          </Route>
          <Route path="/wait" component={WaitPage} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
