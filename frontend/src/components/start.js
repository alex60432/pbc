import React from "react";
import { useNavigate } from "react-router-dom";

/**
* retrieve the start page
* 
* @return the start page
*/
export default function Start() {
    return <MainPanel />
}

/**
* create the start page
* 
* @return the start page
*/
function MainPanel() {
    const navigate = useNavigate();

    document.addEventListener("load", (event) => {
        if(document.getElementById('fadetransitionin')!=null){
            document.getElementById('fadetransitionin').classList.add('fade')
        }
    }, 500)

    /**
    * navigate to other pages
    * 
    * @param the page user wish to go to
    */
    function visit(page) {
        document.getElementById('transitionout').classList.add('outswipe')

        setTimeout(() => {
            if (page == "login") {
                navigate("/paint/login/")
            } else {
                navigate("/paint/dash/")
            }
        }, 500);
    }

    // create the page navigation buttons and fade out animation
    return (
        <div id='startallele'>
            <iframe id='bgstart' src='../background'></iframe>
            <img src="../../static/images/titlecard.png" id="titlecard"></img>
            <span className="startpbutton" id="loginbutton" onClick={() => visit("login")}>LOGIN</span>
            <span className="startpbutton" id="startbutton" onClick={() => visit("start")}>START</span>
            <div id="fadetransitionin"></div>
            <div id="transitionout"></div>
        </div>
    )
}
