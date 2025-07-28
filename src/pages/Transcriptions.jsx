import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios'

function Transcriptions() {
    const [history, setHistory] = useState([])
    const [isloading, setLoading] = useState(true)

    useEffect(()=>{
        const getTranscriptions = async () => {
            const response = await axios.get('http://localhost:3000/history')
            const data = await response.data
            // console.log(data)
            setHistory(data)
            setLoading(false)
        }
        getTranscriptions()
    }, [])

    // const displayHistory = () => (
    //     <ul>
    //         {history.map((each, index) => (
    //             <li key={index}> {each} </li>
    //         ) )}
    //     </ul>
    // )

    // console.log(`history: ${history}`)

    return (
        <>
            <h1 className="pt-20 text-center">Transcriptions</h1>
            {isloading 
                ? <p className="mt-20 text-center">loading...</p> 
                : (<ul>
                    {history.map((each, index) => (
                        <li className ='py-2 px-10' key={index}> {each} </li>
                    ) )}
                </ul>)}
        </>
    )
}

export default Transcriptions