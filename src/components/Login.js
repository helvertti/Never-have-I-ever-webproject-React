import React, {useRef, useState} from 'react'
import axios from "axios";
import PropTypes from 'prop-types';
import './Style.css';
import {Link} from "react-router-dom";

async function loginUser(credentials) {
    return fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

async function checkUser(credentials) {
    const palautus = fetch('http://localhost:8081/users/this', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())

    return palautus;
}

async function getUser(credentials) {
    const palautus = fetch('http://localhost:8081/users/infos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())

    return palautus;
}

function renderToken(){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const Login = ({ setToken }) => {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const [user, setUser] = useState([])
    var error = false;

    const handleSubmit = async e => {
        e.preventDefault();

        const test = await checkUser({
            user_name: username,
            user_password: password
        });

        if(test){

            await (async () => {
                const arr = await getUser({
                    user_name: username
                });

                const token = await loginUser({
                    token: renderToken(),
                    user_name: username,
                    user_id: arr[0].user_id
                });
                setToken(token);
                window.location.reload(true);
            })();
        }else document.getElementById('result').innerHTML = "Virheelliset tunnukset.";
    }

    const handleUser = async e =>{
        e.preventDefault();

        const u = user.name;
        const p = user.password;
        const pS = user.secondPassword;

        error = false;

        if(u == null && p == null){
            error = true;
        }else {

            if (u == null) {
                console.log('Not new name added.');
            } else if (u.length < 3 || !u.match(/^[a-zA-Z]+$/)) {
                console.log('New name invalid. Your new name was: ' + u)
                error = true;
            }

            if (p == null) {
                console.log('No new password added.');
            }else if (p == pS) {
                if (p.length < 3 || !p.match(/^[a-zA-Z]+$/)) {
                    console.log('Password invalid. Your new password was: ' + p)
                    error = true;
                }
            }else error = true;
        }

        if(!error){
            let response = await fetch('http://localhost:8081/users/info', {
                method: 'POST',
                body: JSON.stringify({ user_name: u }),
                headers: { 'Content-Type': 'application/json; charset=UTF-8'},
            });
            let data = await response.json();

            if(!data) {
                fetch('http://localhost:8081/users/add', {
                    method: 'POST',
                    body: JSON.stringify({user_name: u, user_password: p, user_level: 3}),
                    headers: {'Content-Type': 'application/json; charset=UTF-8'},
                })
                    .then(res => res.json())

                document.getElementById('signinRes').innerHTML = "User added.";
                handleReset();
            }else{
                document.getElementById('signinRes').innerHTML = "Name already taken.";
            }

        }else document.getElementById('signinRes').innerHTML = "Input invalid.";
    }

    function handleReset(){
        Array.from(document.querySelectorAll('input')).forEach(
            input => (input.value = '')
        );
        setUser({
            id: '',
            name: '',
            statement: '',
            kieli: ''
        })
    }

    return(
        <div className="login-wrapper">
            <h1 className="title">Never have I ever...</h1>
            <hr/>
            <div className="login-block">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <p><strong>Username:</strong></p>
                    <input type="text" onChange={e => setUserName(e.target.value)}/>
                </label>
                <p></p>
                <label>
                    <p><strong>Password:</strong></p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Log in</button>
                </div>
                <br/>
                <div id="result"></div>
            </form>
            </div>

            <div className="vl"></div>

            <div className="signin-block">
            <h2>Sign up</h2>
            <form onSubmit={handleUser}>

                <p>Username:</p>
                <input type='text' value={user.name}
                       onChange={e => setUser({...user, name: e.target.value})}/>

                <p>New password:</p>
                <input type='password' value={user.password}
                       onChange={e => setUser({...user, password: e.target.value})}/>

                <p>Password again:</p>
                <input type='password' value={user.secondPassword}
                       onChange={e => setUser({...user, secondPassword: e.target.value})}/>

                <div>
                    <br/>
                    <button type="submit">Sign up</button>
                </div>
                <br/>
                <div id="signinRes"></div>
            </form>
            </div>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default Login