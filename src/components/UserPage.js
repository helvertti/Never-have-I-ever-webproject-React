import React, {useRef, useState} from 'react'
import axios from "axios";
import PropTypes from 'prop-types';

function getToken(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.username;
}

function getTokenID(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.id;
}

const User = () => {
    let username = getToken();
    const [user, setUser] = useState([])
    var error = false;

    const submit = e => {
        e.preventDefault()

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
            const id = getTokenID();

            if(u != null){

                fetch('http://localhost:8081/users/username/update', {
                    method: 'PUT',
                    body: JSON.stringify({ user_id: id, user_name: u }),
                    headers: { 'Content-Type': 'application/json; charset=UTF-8'},
                })
                    .then(res => res.json())
            }

            if(p != null){

                fetch('http://localhost:8081/users/update', {
                    method: 'PUT',
                    body: JSON.stringify({user_id: id, new_password: p}),
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                })
                    .then(res => res.json())
            }
        }

        document.getElementById('result').innerHTML = feedBack();

    }

    function feedBack(){
        if(error) return '<p>The input was wrong. Try something else.</p>';
        return '<p>Information saved.</p>';
    }

    return (
        <div className="container">
            <div>
                <h1>User</h1>
                <form onSubmit={submit}>
                    <p>Username:</p>
                    <input type='text' value={user.name} placeholder={username}
                           onChange={e => setUser({...user, name: e.target.value})}/>
                    <hr/>

                    <p>New password:</p>
                    <input type='password' value={user.password}
                           onChange={e => setUser({...user, password: e.target.value})}/>

                    <p>Password again:</p>
                    <input type='password' value={user.secondPassword}
                           onChange={e => setUser({...user, secondPassword: e.target.value})}/>

                    <hr/>
                    <input type="submit" name="Send" value="Save"/>
                </form>

                <div id="result"></div>
            </div>
        </div>
    )

}

export default User