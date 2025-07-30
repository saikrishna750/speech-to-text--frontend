import React from "react";
import { useState, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import { FaCircleStop } from "react-icons/fa6";

const AudioRecorder = (props) => {
    const [isRecording, setIsRecording] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [recordedUrl, setRecordedUrl] = useState('')
    const mediaStream = useRef(null)
    const mediaRecorder = useRef(null)
    const chunks = useRef([])
    const [recordedAudioFile, setRecordedAudioFile] = useState('')
   
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
                const recordedBlob = new Blob(chunks.current, {type: 'audio/mp3'})
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

    return (
        <div className="mt-4">
            record audio
            <h2>{formatTime(seconds)}</h2>
            {isRecording 
            ? <button onClick={stopRecording} className="bg-red-500 text-[22px] flex items-center justify-center test-[60px] rounded-full p-1 text-white w-[40px] h-[40px]">
                 <FaCircleStop/>
            </button>
            : <button onClick={startRecording} className="bg-blue-500 flex items-center justify-center test-[60px] rounded-full p-1 text-white w-[40px] h-[40px]">
                 <FaMicrophone />
            </button>}
            {recordedUrl && <audio controls src={recordedUrl} />}
        </div>
    )
}

export default AudioRecorder