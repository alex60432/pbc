import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route}from 'react-router-dom';
import Login from './login';
import Puzzle from "./puzzle";
import Start from "./start";
import Dash from "./dash";
import Visit from "./visit";
import Nopage from "./nopage";
import Create from "./create";
import Comp from "./background";
export default function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path='paint/background/' element={<Comp/>}/>  
                <Route path='paint/start/' element={<Start/>}/>
                <Route path='paint/login/' element={<Login/>}/>
                <Route path='paint/dash/*' element={<Dash/>}/>
                <Route path='paint/visit/*' element={<Visit/>}/>
                <Route path='paint/solve/*' element={<Puzzle/>}/>
                <Route path='paint/create/*' element={<Create/>}/>
                <Route path='*' element={<Nopage/>}/>
            </Routes>
        </BrowserRouter>
        );
}

const container=document.getElementById('app');
const root=createRoot(container);
root.render(<App/>);
