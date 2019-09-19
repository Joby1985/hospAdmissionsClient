import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdmissionsList from './AdmissionsList';
import AdmissionEdit from './AdmissionEdit';
import { CookiesProvider } from 'react-cookie';

class App extends Component {
  render() {
    return (
      <CookiesProvider>
        <Router>
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/admissions' exact={true} component={AdmissionsList}/>
            <Route path='/admissions/:id' component={AdmissionEdit}/>
          </Switch>
        </Router>
      </CookiesProvider>
    )
  }
}

export default App;