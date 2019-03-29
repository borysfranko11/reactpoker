import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faToolbox,
  faInfoCircle,
  faScrewdriver,
  faCheckCircle,
  faTimesCircle,
  faAddressCard,
  faPhoneSquare,
  faMobileAlt,
  faEdit,
  faUserMinus,
  faUserPlus,
  faMinusCircle,
  faPlusCircle,
  faFileExport,
  faEye
} from '@fortawesome/free-solid-svg-icons';

import { Provider } from 'react-redux';
import store from './store';

import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import NotFound from './components/not-found/NotFound';
import './App.css';
/* Added by Ninja  */
library.add(
  faToolbox,
  faInfoCircle,
  faScrewdriver,
  faCheckCircle,
  faTimesCircle,
  faAddressCard,
  faPhoneSquare,
  faMobileAlt,
  faEdit,
  faUserMinus,
  faUserPlus,
  faMinusCircle,
  faPlusCircle,
  faFileExport,
  faEye
);
// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="ml-5 mr-5">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Route exact path="/not-found" component={NotFound} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;