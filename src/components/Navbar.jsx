import React from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { useState } from "react";
import '../index.css'

const Navbar = () => {
    const [isClicked, setIsClicked] = useState(false)

    const displayHam = () => {
        setIsClicked(prev => !prev)
    }

    const closeHam = () => {
        setIsClicked(false)
    }

    return (
        <>
            <nav className="border-b border-gray-700 px-14 h-16 fixed top-0 right-0 left-0 w-screen flex flex-col justify-between items-center bg-black">
                <div className="mt-1 md:mt-2 flex flex-row w-screen items-center justify-between p-2 md:px-10 lg:px-14">
                    <h1 className=" text-2xl font-bold text-black  bg-[linear-gradient(45deg,_orangered,_gold)] bg-clip-text text-transparent">
                        Speech-to-text
                    </h1>
                    <button onClick={displayHam} className="h hamburger md:hidden self-end">
                        <GiHamburgerMenu className="h-[25px] w-[25px] text-white"/>
                    </button>

                    <div className="hidden md:block">
                        <ul className=" text-white flex items-center list-none gap-5">
                            <li>
                                <Link to="/" className="hover:text-blue-500 text-lg font-medium text-white">Home</Link>
                            </li>
                            <li>
                                <Link to="/transcriptions" className="hover:text-blue-500 font-medium text-lg text-white">Transcriptions</Link>
                            </li>
                        </ul>
                    </div>
                </div>


                {isClicked 
                && ( <div className="bg-neutral-900 w-[80vw] ml-auto rounded-sm border border-gray-600 md:hidden p-3">
                    <button onClick={displayHam}>
                        <ImCross className="w-[10px] h-[10px] text-white mb-3"/>
                    </button>
                    <ul className="text-white flex flex-col items-start list-none gap-1">
                        <li onClick={closeHam}>
                            <Link to="/" className="hover:text-blue-500 text-sm text-white">Home</Link>
                        </li>
                        <li onClick={closeHam}>
                            <Link to="/transcriptions" className="hover:text-blue-500 text-sm text-white">Transcriptions</Link>
                        </li>
                    </ul>
                </div>)}
            </nav>
            
        </>      
    )
}

export default Navbar