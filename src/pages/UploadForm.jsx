import React from 'react';
import {useState, useEffect, useRef} from 'react'
import {v4 as uuidv4} from 'uuid'
import axios from 'axios'
import '../index.css'

function UploadForm(){
    const [audio, setAudio] = useState(null)
    const [transcript, setTranscript] = useState('')
    const inputValueRef = useRef(null)
    const [isLoading, setLoading] = useState(false)

    const onChangeFile = event => {
        setAudio(event.target.files[0])
    } 

    const getTranscription = async () => {
        const response = await axios.get("http://localhost:3000/transcript")
        const data = await response.data
        console.log(`gsggsggsg: ${data}`)
        setTranscript(data)
    }

    const handleAudioSubmit = async () =>{
        setLoading(true)
        setTranscript('')
        const id = uuidv4()
        if (!audio){
            return alert ("please choose audio file")
        }
        let formData = new FormData();
        formData.append('audio',audio)
        formData.append('id',id)
        console.log(formData)
        try{
            const response = await axios.post('http://localhost:3000/upload',formData)
            alert('upload successful')
        }
        catch (err) {
            console.error(`upload Error: ${err}`)
            alert('upload failed')
        }
        await getTranscription()
        setAudio('')
        setLoading(false)
        inputValueRef.current.value = null
    }

    return (
        <>  
            <div className=' bg-white pt-24 flex flex-col justify-start items-center'>
                <div>
                    <input 
                        ref ={inputValueRef}
                        onChange = {onChangeFile}
                        id="audiofile" 
                        accept='audio/*' 
                        type="file" 
                        className="border border-dark mt-3" 
                    />
                    <button className='btn bg-blue-500 text-white ml-3 px-6 py-1 rounded-sm' onClick={handleAudioSubmit}>submit</button>
                </div>
                <div className='p-3 m-10 mt-20 border border-grey h-[40vh] shadow-md rounded-lg w-[80%]'>
                    <p className=' text-center '>your transcription</p>
                    {isLoading ? <p>transcripting...</p>
                     : (transcript !== "" && <p className='p-10 text-center'>{transcript} </p>) }
                </div>
            </div>
        </>
    )
}

export default UploadForm