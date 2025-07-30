import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios'
import { MdDelete } from "react-icons/md";

const Transcriptions = () => {
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

    const onDeleteTranscript = async (id) => {
        console.log(`id from frontend ${id}`)
        try{
            const response = await axios.delete(`http://localhost:3000/delete/${id}`)
            const data = await response.data 
            console.log(data.message)
        }
        catch (error){
            console.log(error)
        }

        setHistory(prev => (prev.filter(each => each.id !== id)))
    }

    return (
        <>
            <div className="bg-gray-950 min-h-screen ">
                <h1 className="pt-20 pb-6 text-center text-white text-bold text-2xl font-normal">Transcriptions</h1>
                    {isloading 
                        ? <p className="mt-20 text-center text-white text-lg">loading...</p> 
                        : (history.length === 0 
                    ? <p className="text-center text-2xl md:text-3xl mt-8">No Transcriptions Yet</p>
                    : (<ul className="text-black pb-10">
                            {history.map((each) => (
                                <li className ='bg-gray-900 flex flex-row justify-between items-center m-1 mx-3 px-3 py-2 md:mx-18 md:px-10 py-3 border border-gray-600 rounded-sm shadow-sm' key={each.id}> 
                                    <p className="mr-5 text-neutral-300">{each.transcription}</p> 
                                    <button onClick={() => onDeleteTranscript(each.id)} className="text white pt-2 self-start">
                                        <MdDelete className="w-[20px] h-[20px] text-white"/>
                                    </button>
                                </li>
                            ) )}
                    </ul>))}
                    
            </div>
        </>
    )
}

export default Transcriptions