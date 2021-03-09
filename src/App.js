import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    BrowserRouter as Router,
    Switch, Route, Link
} from 'react-router-dom'

import Add from './components/Add'
import Home from './components/Home'
import List from './components/List'
import Login from './components/Login'
import User from './components/UserPage'
import {Table} from "react-bootstrap";
import './components/Style.css';

function setToken(userToken){
    sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
}

function logout() {
    console.log("Button pressed.");
    sessionStorage.clear();
    window.location.reload(true);
}

const App = () => {
    const token = getToken();

    if(!token){
        return <Login setToken={setToken} />
    }

    const padding = {
        padding: 5
    }

    return (
        <div className="nav">
            <Router>
                <div className="navbar">
                    <ul>
                        <li><Link style={padding} to="/">home</Link></li>
                        <li><Link style={padding} to="/add">add</Link></li>
                        <li><Link style={padding} to="/list">list</Link></li>
                        <li><Link style={padding} to="/user">user</Link></li>
                        <li style={{float: "right"}}><button onClick={logout}>log out</button></li>
                    </ul>
                </div>

                <Switch>
                    <Route path="/add">
                        <Add />
                    </Route>
                    <Route path="/list">
                        <List />
                    </Route>
                    <Route path="/user">
                        <User />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default App
