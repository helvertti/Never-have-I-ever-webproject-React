import React, {useRef, useState} from 'react'
import axios from "axios";
import PropTypes from 'prop-types';

function getToken(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.username
}

const Add = () => {
    const [notes, setNotes] = useState([])
    var error = false;
    const token = getToken();

    const submit = e => {
        e.preventDefault()

        const id = notes.id;
        const n = token;
        const s = notes.statement;
        const k = notes.kieli.toUpperCase();

        error = false;
        document.getElementById('result').innerHTML = '';

        if(s.length < 5 && !s.match(/^[a-zA-Z]+$/)){
            console.log('Statement invalid. Your content was: ' + s)
            error = true;
        }

        if(k != 'ENG' && k != 'FIN'){
            console.log('Wrong type of input. Your input was: ' + k)
            error = true;
        }

        document.getElementById('result').innerHTML = feedBack();

        if(!error){
            fetch('http://localhost:8081/neverever/add', {
                method: 'POST',
                body: JSON.stringify({ name: n, statement: s, kieli: k }),
                headers: { 'Content-Type': 'application/json' },
            })
                .then(res => res.json())
                .then(json => setNotes(json.id, json.n, json.s, json.k))

            handleReset();
        }
    }

    function handleReset(){
        Array.from(document.querySelectorAll('input')).forEach(
            input => (input.value = '')
        );
        setNotes({
            id: '',
            name: '',
            statement: '',
            kieli: ''
        })
    }

    function feedBack(){
        if(error) return '<p>The input was wrong. Try something else.</p>';
        return '<p>Content added.</p>';
    }

    return(
        <div className="container">
           <div>
               <h1>Add note</h1>
               <form onSubmit={submit}>
               <p>Give name:</p>
               <input type='text' value={token} />

               <p>Give statement:</p>
               <input type='text' value={notes.statement}
                onChange={e => setNotes({...notes, statement: e.target.value})}/>

               <p>Give language: (ENG/FIN)</p>
               <input type='text' value={notes.kieli}
               onChange={e => setNotes({...notes, kieli: e.target.value})}/>

               <input type="submit" name="Send" />
               </form>

               <div id="result"></div>
           </div>
        </div>
    )
}

export default Add