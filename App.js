import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import JobList from './components/JobList';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login">
            <Login setToken={setToken} />
          </Route>
          <Route path="/" component={() => <JobList token={token} />} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
