import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
* go to the start page
*/
export default function Nopage() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/paint/start/")
    }, []);
    return (
        <p></p>
    )
}
