import React, {useEffect, useState} from "react";
import { Table } from 'react-bootstrap'
import {BrowserRouter as Router} from "react-router-dom";
import axios from "axios";

const List = () => {

    const [notes, setNotes] = useState([])
    const [showAll, setShowAll] = useState(true)

    useEffect(() => {
        axios
            .get('http://localhost:8081/neverever')
            .then(response => {
                setNotes(response.data)
            })
    }, [])

    const notesToShow = showAll
        ? notes.filter(note => note.kieli == "ENG")
        : notes.filter(note => note.kieli == "FIN")

    return(
        <div className="container">

            <h1>Never have I ever...</h1>
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'FIN' : 'ENG' }
                </button>
            </div>
            <ul>
                {notesToShow.map((note, i) =>
                    <Table>
                        <tbody>
                        <tr>
                            <td>
                                <p>{note.id}</p>
                            </td>
                            <td>
                                <p>{note.statement}</p>
                            </td>
                            <td style={{float: "right"}}>
                                <button onClick={() =>
                                    fetch('http://localhost:8081/neverever/' + note.id, {
                                        method: 'DELETE'
                                    }).then(response => {
                                        window.location.reload(true);
                                    })}
                                >Delete</button>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                )}
            </ul>

        </div>
    )
}

export default List