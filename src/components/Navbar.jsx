import React from "react";
import { Link } from "react-router-dom";

function Navbar(){

    return (
        <nav className="px-14 h-16 fixed top-0 right-0 left-0" style={{backgroundColor:'#13131c', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h1 className=" text-2xl font-bold text-white">
              Speech-to-text
            </h1>
            <ul style={{color:'white', display:'flex',listStyleType:'none', gap:'18px'}}>
                <li>
                    <Link to="/" className="hover:text-cyan-400 font-medium ">Home</Link>
                </li>
                <li>
                    <Link to="/transcriptions" className="hover:text-cyan-400 font-medium ">Transcriptions</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar