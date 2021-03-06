import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import 'semantic-ui-css/semantic.min.css'
import './App.css';

import { AuthProvider } from './context/auth'
import AuthRoute from './util/AuthRoute'

import MenuBar from './components/MenuBar'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import SinglePost from './pages/SinglePost'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="home-view">
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/post/:postId" component={SinglePost} />
          <Route exact path="/profile/:username" component={Profile} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
