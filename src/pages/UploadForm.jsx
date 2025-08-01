import React from 'react';
import {useState, useEffect, useRef} from 'react'
import {v4 as uuidv4} from 'uuid'
import axios from 'axios'
import '../index.css'
import { API_BASE_URL } from '../config';
import { FaMicrophone } from "react-icons/fa";
import { FaCircleStop } from "react-icons/fa6";
import { MdUploadFile } from "react-icons/md";


function UploadForm(){
    const [audio, setAudio] = useState(null)
    const [transcript, setTranscript] = useState('')
    const inputValueRef = useRef(null)
    const [isLoading, setLoading] = useState(false)


    const [isRecording, setIsRecording] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [recordedUrl, setRecordedUrl] = useState('')
    const mediaStream = useRef(null)
    const mediaRecorder = useRef(null)
    const chunks = useRef([])
   
    //record audio
    const startRecording = async () =>{
        setIsRecording(true)
        setRecordedUrl('')
        try{
            setSeconds(0)
            const stream = await navigator.mediaDevices.getUserMedia({audio: true})
            mediaStream.current = stream 
            mediaRecorder.current = new MediaRecorder(stream)
            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0){
                    chunks.current.push(event.data)
                }
            }
            const timer = setInterval(()=>{
                    setSeconds(prev => prev + 1)
                }, 1000)

            mediaRecorder.current.onstop = async () => {
                const recordedBlob = new Blob(chunks.current, {type: 'audio/webm'})
                //convert to file
                if (recordedBlob.size <= 0 && recordedBlob){
                    return (alert("No audio has recorded! Please record again"))
                }
                const audioFile = new File([recordedBlob], 'recording.webm', {
                    type: 'audio/webm',
                    lastModified: Date.now(),
                })
                setAudio(audioFile)

                const url = URL.createObjectURL(recordedBlob)
                setRecordedUrl(url)
                chunks.current = []
                clearTimeout(timer)
            }
            mediaRecorder.current.start()
        }
        catch (error) {
            console.log(error)
            alert(error)
        }
    }

    const stopRecording = async () => {
        setIsRecording(false)
        if (mediaRecorder.current){
            mediaRecorder.current.stop()
            mediaStream.current.getTracks.forEach(track => {track.stop()})
        }
        clearInterval(timer)
    }

    const formatTime = (totalSeconds) =>{
        let hours = Math.floor(totalSeconds/3600)
        let minutes = Math.floor((totalSeconds % 3600)/60)
        let secs = Math.floor(totalSeconds%60)
        hours = hours < 10 ? hours = `0${hours}` : hours  
        minutes = minutes < 10 ? minutes = `0${minutes}` : minutes 
        secs = secs < 10 ? secs = `0${secs}` : secs
        
        return `${hours}:${minutes}:${secs}`
    }

    //upload audio file
    const onChangeFile = event => {
        setAudio(event.target.files[0])
    } 

    const getTranscription = async () => {
        const response = await axios.get(`${API_BASE_URL}/transcript`)
        const data = await response.data
        setTranscript(data)
    }

    const handleAudioSubmit = async () =>{
        setTranscript('')
        const id = uuidv4()
        if (!audio){
            return alert ("please choose audio file")
        }
        setLoading(true)
        let formData = new FormData();
        formData.append('audio',audio)
        formData.append('id',id)
        console.log(formData)
        try{
            const response = await axios.post(`${API_BASE_URL}/upload`,formData)
            // alert('upload successful')
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
            <div className='bg bg-white pt-24 flex flex-col justify-start items-center'>
                <h1 className='mt-5 md:mt-3 text-[26px] md:text-[32px] text-center font-medium text-white'>Speech-to-Text Conversion </h1>
                <p className='mt-3 mb-6 text-zinc-500 text-center w-[80%]'>Convert your spoken audio into accurate and structured text using advanced speech recognition technology. </p>
                <div className='max-w-[90%]'>
                    <div className='border border-gray-500 rounded-lg p-5 py-10 md:p-10 bg-blur/50'>
                        <div className='bg-white rounded-md'>
                            <button>
                                <input 
                                ref ={inputValueRef}
                                onChange = {onChangeFile}
                                id="audiofile" 
                                accept='audio/*' 
                                type="file" 
                                className=" rounded-lg p-2" 
                            />
                            </button>
                        </div>

                        {isRecording 
                            ? (
                            <div onClick={stopRecording} className="bg-white mt-4 flex items-center justify-start rounded-lg border">
                                <button className=" text-[22px] flex items-center justify-center test-[60px] rounded-full p-1 text-black w-[40px] h-[40px]">
                                    <FaCircleStop/>
                                </button>
                                <h2 className='self-center text-center'>{formatTime(seconds)}</h2> 
                            </div>
                        )
                        : (
                            <div onClick={startRecording}  className="bg-white mt-4 flex items-center justify-start rounded-lg border">                
                                <button className=" flex items-center justify-center test-[60px] rounded-full p-1 text-black w-[40px] h-[40px]">
                                    <FaMicrophone />
                                </button>
                               
                                <p className='self-center  text-center'>Record Audio</p>
                            </div>
                        )}
                        
                    </div>
                    
                   
                    <div className='mt-4 flex flex-row items-center justify-center '>
                        {recordedUrl && <audio className='max-w-[90%] h-[34px] md:h-[38px] ' controls src={recordedUrl} />}
                    </div>


                    <div className='flex flex-row justify-center items-center m-4 pb-4'>
                         <button className='bg-[linear-gradient(45deg,_orangered,_gold)]  hover:scale-105 btn text-center text-white ml-3 px-6 pt-2 pb-1 rounded-sm font-meidum ' onClick={handleAudioSubmit}>Transcribe</button>
                    </div>
                   
                </div>

                {transcript !== '' ? <p className=' text-center text-white font-medium text-lg'>your transcription</p>: null}
                                    
                {isLoading 
                ? <p className='text-white p-6 m-1  text-lg text-center w-[80%]'>transcripting...</p>
                : (transcript !== "" && <p className='p-3 md:p-6 m-2 mb-20 font-medium border border-gray-300 bg-white shadow-md rounded-lg w-[80%] p-10 text-black text-center'>{transcript} </p>)
                }
            </div>
        </>
    )
}

export default UploadForm 

