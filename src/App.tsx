import type { Component } from 'solid-js'
import { Route, Router, Routes } from '@solidjs/router'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import { CreateTeam, JoinTeam, ManageTeam } from './pages/Teams'
import WaitPage from './pages/Wait'
import { SocketServiceSingleton } from './services/socket'
import { AuthService } from './services/auth'
import { TeamService } from './services/team'
import { JWTService } from './services/fetch'
import CompetitionPage from './pages/Competition'
import EndPage from './pages/End'

export const authService = new AuthService(import.meta.env.VITE_IAM_BASE_URL, import.meta.env.VITE_MATHCOMPETITION_BASE_URL)
export const socketService = new SocketServiceSingleton(import.meta.env.VITE_MATHCOMPETITION_BASE_WS_URL)
export const teamService = new TeamService(import.meta.env.VITE_MATHCOMPETITION_BASE_URL)
export const jwtService = new JWTService()

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
          <Route path="/competition" component={CompetitionPage} />
          <Route path="/end" component={EndPage} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
