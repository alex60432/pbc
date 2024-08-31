import React from "react";
import { useState, useEffect } from "react";
import { Slider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

/**
* retrieve the puzzle page
* 
* @return the puzzle page
*/
export default function Puzzle() {
    return <MainPanel />
}

/**
* create the puzzle page
* 
* @return the puzzle page
*/
function MainPanel() {
    const navigate = useNavigate();
    const location = useLocation();
    const puzname = location.state;
    const [complete, setcomplete] = useState(false)
    const [moused, setmoused] = useState(false)
    const [size, setsize] = useState(130);
    const [grid, setgrid] = useState(2);
    const [leave, setleave] = useState(false);
    const [anstable, setanstable] = useState([['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']]);
    const [numtable, setnumtable] = useState([['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']]);
    const [curnumtable, setcurnumtable] = useState([['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']]);
    const [savetable, setsavetable] = useState([['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']]);
    const [allcol, setallcol] = useState([])
    const [current, setcurrent] = useState('')
    
    //map the color penals users will use to solve the puzzle
    const colmap = allcol.map((data) => {

        //set a signal to display a additional penal on top of a color penal 
        //to notify the user that the color is currently being used if it is currently being used
        var displaying = 'none'
        if (data[0] == current) {
            displaying = 'block'
        }

        return (
            //color penal 
            <div className="color" onClick={() => setcurrent(data[0])} id={'idsol'.concat(data[0])} key={'sol'.concat((data[0]))}>
                <div className="colorcolor" style={{ backgroundColor: data[0] }}></div>
                <div className="numpenal">
                    <div>
                        <p>{data[1]}</p>

                        {/* additional penal that will be display if the color in the ppenal is currently used */}
                        <div className="curdiv" style={{ display: displaying }}>
                            <p>Currently</p>
                            <p>Using</p>
                        </div>

                    </div>
                </div>
            </div>
        )
    })

    /**
    * change width of the grid line
    * 
    * @param  val - the level of the gird outline thickness level, ranging from 0(non existant) to 2 (very thick)
    */
    function outlinecha(val) {
        setgrid(val / 50 * val / 50 * 2)
    }

    /**
    * change size of a pixel grid
    * 
    * @param  val - the level of the gird size level, ranging from 0 (small) to 99 (big)
    */
    function scaled(val) {
        var changeval = val / 100;
        setsize(130 * changeval)
    }

    /**
    * change color on the puzzle board when pen is down, this runs when mouse is clicking the puzzle board
    * 
    * @param row - the id (index) of the row of the square that changes color 
    * @param cell - the id (index) of the column of the square that changes color 
    */
    function changecanpass(row, cell) {
        var pencolor = current.toString()
        var copy = [...savetable]

        //change color of the grids on puzzle board that the pen is clicking on
        for (let index = 0; index < copy.length; index++) {
            for (let i = 0; i < copy[0].length; i++) {
                if (row == index && cell == i) {

                    //if correct, remove the number on the grid and color in the grid
                    if (pencolor == anstable[index][i]) {
                        var numtablecopy = curnumtable
                        numtablecopy[index][i] = ''
                        setcurnumtable(numtablecopy)

                    //if incorrect, the number remain on the grid, color in the grid, but show also show the correct color as outline of the grid
                    } else {
                        var numtablecopy = curnumtable
                        numtablecopy[index][i] = numtable[row][cell]
                        setcurnumtable(numtablecopy)
                    }
                    copy[index][i] = pencolor
                }
            }
        }

        //count the number of correct color on the puzzle board and determine if the puzzle has been completed
        setsavetable(copy)
        var corrcount = 0
        for (let index = 0; index < copy.length; index++) {
            for (let i = 0; i < copy[0].length; i++) {
                if (copy[index][i] == anstable[index][i]) {
                    corrcount = corrcount + 1
                }
            }
        }
        if (corrcount == anstable.length * anstable[0].length) {
            setcomplete(true)
        } else {
            setcomplete(false)
        }
    }

    /**
    * change color on the puzzle board when pen is down, this runs when mouse is being dragged across the puzzle board
    * 
    * @param row - the id (index) of the row of the square that changes color 
    * @param cell - the id (index) of the column of the square that changes color 
    */
    function changecan(row, cell) {

        if (moused) {
            var pencolor = current.toString()
            var copy = [...savetable]

            //change color of the grids on puzzle board that the pen is being dragged on
            for (let index = 0; index < copy.length; index++) {
                for (let i = 0; i < copy[0].length; i++) {
                    if (row == index && cell == i) {

                        //if correct, remove the number on the grid and color in the grid
                        if (pencolor == anstable[index][i]) {
                            var numtablecopy = curnumtable
                            numtablecopy[index][i] = ''
                            setcurnumtable(numtablecopy)

                        //if incorrect, the number remain on the grid, color in the grid, (but the puzzle board will also show the correct color as outline of the grid due to mismatch of color)
                        } else {
                            var numtablecopy = curnumtable
                            numtablecopy[index][i] = numtable[row][cell]
                            setcurnumtable(numtablecopy)
                        }
                        copy[index][i] = pencolor
                    }
                }
            }

            //count the number of correct color on the puzzle board and determine if the puzzle has been completed
            setsavetable(copy)
            var corrcount = 0
            for (let index = 0; index < copy.length; index++) {
                for (let i = 0; i < copy[0].length; i++) {
                    if (copy[index][i] == anstable[index][i]) {
                        corrcount = corrcount + 1
                    }
                }
            }
            if (corrcount == anstable.length * anstable[0].length) {
                setcomplete(true)
            } else {
                setcomplete(false)
            }
        }
    }

    //create the pixel canvas (puzzle board)
    const pixelcanvas = savetable.map((data, rowindex) => {
        const rows = data.map((subdata, cellindex) => {
            if (subdata == '') {
                return (
                    <div id={'row'.concat(rowindex.toString()).concat('cell'.concat(cellindex.toString()))} onMouseDown={() => changecanpass(rowindex, cellindex)} onMouseEnter={() => changecan(rowindex, cellindex)} key={'cell'.concat(cellindex.toString())} className="cvgrid" style={{ width: size.toString().concat('px'), height: size.toString().concat('px') }}>
                        <div className="outtercolor" style={{ marginLeft: grid.toString().concat('%'), marginTop: grid.toString().concat('%'), backgroundColor: anstable[rowindex][cellindex], width: (100 - (grid * 2)).toString().concat('%'), height: (100 - (grid * 2)).toString().concat('%') }}>
                            <div className="paintinnercolor" style={{ backgroundColor: '#FFFFFF', width: '100%', height: '100%' }}>
                                <p style={{ fontSize: (size / 2).toString().concat('px') }}>{curnumtable[rowindex][cellindex]}</p>
                            </div>
                        </div>

                    </div>
                )
            } else if (subdata != anstable[rowindex][cellindex]) {
                return (
                    <div id={'row'.concat(rowindex.toString()).concat('cell'.concat(cellindex.toString()))} onMouseDown={() => changecanpass(rowindex, cellindex)} onMouseEnter={() => changecan(rowindex, cellindex)} key={'cell'.concat(cellindex.toString())} className="cvgrid" style={{ width: size.toString().concat('px'), height: size.toString().concat('px') }}>
                        <div className="outtercolor" style={{ marginLeft: grid.toString().concat('%'), marginTop: grid.toString().concat('%'), backgroundColor: anstable[rowindex][cellindex], width: (100 - (grid * 2)).toString().concat('%'), height: (100 - (grid * 2)).toString().concat('%') }}>
                            <div className="paintinnercolor" style={{ backgroundColor: subdata, width: '70%', height: '70%', marginLeft: '15%', marginTop: '15%' }}>
                                <p style={{ fontSize: (size / 3.5).toString().concat('px'), opacity: '1', color: anstable[rowindex][cellindex] }}>{curnumtable[rowindex][cellindex]}</p>
                            </div>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div id={'row'.concat(rowindex.toString()).concat('cell'.concat(cellindex.toString()))} onMouseDown={() => changecanpass(rowindex, cellindex)} onMouseEnter={() => changecan(rowindex, cellindex)} key={'cell'.concat(cellindex.toString())} className="cvgrid" style={{ width: size.toString().concat('px'), height: size.toString().concat('px') }}>
                        <div className="outtercolor" style={{ marginLeft: grid.toString().concat('%'), marginTop: grid.toString().concat('%'), backgroundColor: anstable[rowindex][cellindex], width: (100 - (grid * 2)).toString().concat('%'), height: (100 - (grid * 2)).toString().concat('%') }}>
                            <div className="paintinnercolor" style={{ backgroundColor: subdata, width: '100%', height: '100%' }}>
                            </div>
                        </div>
                    </div>
                )
            }
        })
        return (
            <div id={'row'.concat(rowindex.toString())} key={'row'.concat(rowindex.toString())}>
                {rows}
            </div>
        )
    })

    /**
    * save the progress of a incomplete puzzle
    */
    function gosave() {

        //turn a array of color on the puzzle board in to a string so that it can be accepted by the database
        var strcopy = ''
        for (let index = 0; index < savetable.length; index++) {
            for (let i = 0; i < savetable[0].length; i++) {
                strcopy = strcopy + (savetable[index][i])
                strcopy = strcopy + ('!')
            }
            strcopy = strcopy + ('|')
        }

        //save the new puzzle in a local save model in the backend
        fetch('http://127.0.0.1:8000/backend/savelocalpuz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                progress: strcopy,
                name: puzname
            })
        }).then((Response) => Response.json()).then((data) => {

            //check if the puzzle is already done, will only run if a user is running this page in another window
            if(data=="comp"){
                goback(true)
            }

            //a penal will notify the user of the successful save.
            document.querySelector('.saveconfirm').style.display = "block";
            document.querySelector('.savequit').style.display = "none";
        })
    }

    /**
    * submit a completed puzzle
    */
    function gosubmit() {             
        goback(true)
    }

    /**
    * return from all the extra penals (the save, submit, quit penals)
    * 
    * @param leave - a boolean value that represent whether the program should go to the dash board and quit the puzzle page
    */
    function goback(leave) {
        document.querySelector('.maincanv').style.filter = "blur(0px)";
        document.querySelector('.distance').style.display = "none";
        document.querySelector('.saveconfirm').style.display = "none";
        document.querySelector('.savequit').style.display = "none";
        document.querySelector('.submitconfirm').style.display = "none";
        if (leave) {
            document.getElementById('transitionout').classList.add('outswipe')
            setTimeout(() => {
                navigate("/paint/dash/")
            }, 500);
        }
    }


    return (
        
        //create the page and all of its components 
        <div className='all'>
            <Check setcurnumtable={setcurnumtable} navigate={navigate} puzname={puzname} setcurrent={setcurrent} setnumtable={setnumtable} setallcol={setallcol} setanstable={setanstable} setsavetable={setsavetable} />
            <div className='maincanv' onMouseUp={() => setmoused(false)}>

                {/* the list of color penals the user need to use and the control penal to manupulate the board */}
                <div className='leftsidecreate'>
                    <div className='colorPicker taller'>
                        {colmap}
                    </div>
                    <div className='controlPenal shorter'>
                        <div className='empty'></div>
                        <Controls goback={goback} complete={complete} savetable={savetable} scaled={scaled} outlinecha={outlinecha} setleave={setleave} puzname={puzname} />
                    </div>
                </div>

                {/* the puzzle board */}
                <div className='createCanvas' onMouseDown={() => setmoused(true)}>
                    <div className='canmove' style={{ width: (size * (savetable[0].length + 3)).toString().concat('px'), height: (size * (savetable.length + 3)).toString().concat('px') }}>
                        <div className='cancenter' style={{ borderWidth: ((grid)).toString().concat('px') }}>
                            {pixelcanvas}
                        </div>
                    </div>
                </div>
            </div>

            <div className='distance'>

                {/* the penal letting user know the save have been successful */}
                <div className='saveconfirm'>
                    <h1>YOUR PROGRESS HAS BEEN SAVED</h1>
                    <button onClick={() => goback(leave)} className="savebutton">COOL</button>
                </div>

                {/* the quit penal */}
                <div className='savequit'>
                    <h1>DO YOU WISH TO SAVE</h1>
                    <button onClick={() => gosave()} className="savebutton">YES</button>
                    <button onClick={() => goback(true)} className="savebutton">NO</button>
                </div>

                {/* the penal letting user know the submit have been successful */}
                <div className='submitconfirm'>
                    <h1>YOUR WORK HAS BEEN SUBMITTED</h1>
                    <button onClick={() => gosubmit()} className="savebutton">COOL</button>
                </div>
            </div>

            {/* swiping animation played whenentering or exioting the page */}
            <div id="transitionin"></div>
            <div id="transitionout"></div>
        </div>
    )
}

/**
* handle leave, submit, and exit
*
* @param  complete - a boolean value indicating whether the puzzle has been completed 
* @param  savetable - the user's current progress of the puzzle, a list of color, 
*                     each corresponding to the color of a cell on the puzzle board
* @param  puzname - the name of the puzzle
*
* @return the control penal
*/
function Controls({ goback,complete, savetable, scaled, outlinecha, setleave, puzname }) {

    /**
    * handle leave, submit, and exit
    *
    * @param  savetable - the user's current progress of the puzzle, a list of color, 
    *                     each corresponding to the color of a cell on the puzzle board
    * @param  order - an id indicating which of the three (save, complete, and exit) button is clicked
    * @param  puzname - the name of the puzzle
    */
    function handlepenalrequest(savetable, order, setleave, puzname) {

        //turn a array of color on the puzzle board in to a string so that it can be accepted by the database
        var strcopy = ''
        for (let index = 0; index < savetable.length; index++) {
            for (let i = 0; i < savetable[0].length; i++) {
                strcopy = strcopy + (savetable[index][i])
                strcopy = strcopy + ('!')
            }
            strcopy = strcopy + ('|')
        }

        //handle saving, display the save confirm penal
        if (order == 1) {
            setleave(false)
            document.querySelector('.maincanv').style.filter = "blur(10px)";
            document.querySelector('.distance').style.display = "grid";
            document.querySelector('.saveconfirm').style.display = "block";
            document.querySelector('.savequit').style.display = "none";
            document.querySelector('.submitconfirm').style.display = "none";
            fetch('http://127.0.0.1:8000/backend/savelocalpuz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    progress: strcopy,
                    name: puzname
                })
            }).then((Response) => Response.json()).then((data) => {

                //check if the puzzle is already done, will only run if a user is running this page in another window
                if(data=="comp"){
                    goback(true)
                }

            })
        }

        //handle exit button, display the exit penal
        if (order == 2) {
            setleave(true)
            document.querySelector('.maincanv').style.filter = "blur(10px)";
            document.querySelector('.savequit').style.display = "block";
            document.querySelector('.distance').style.display = "grid";
            document.querySelector('.saveconfirm').style.display = "none";
            document.querySelector('.submitconfirm').style.display = "none";

        }

        //handle submit button, display the submit confirm penal
        if (order == 3) {
            fetch('http://127.0.0.1:8000/backend/donelocalpuz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: puzname
                })
            }).then((Response) => Response.json()).then((data) => {

                //check if the puzzle is already done, will only run if a user is running this page in another window
                if(data=="comp"){
                    goback(true)
                }

            })
            document.querySelector('.maincanv').style.filter = "blur(10px)";
            document.querySelector('.distance').style.display = "grid";
            document.querySelector('.submitconfirm').style.display = "block";
            document.querySelector('.savequit').style.display = "none";
            document.querySelector('.saveconfirm').style.display = "none";
        }
    }

    return (
        <div>

            {/* control for the scale (size) of the grid */}
            <div className='controlcont' id="scale">
                <p>Scale</p>
                <Slider defaultValue={100} max={100} min={10} onChange={(e, val) => scaled(val)} aria-label="Default" sx={{
                    width: 100,
                    float: 'right',
                    marginRight: '20px',
                    color: '#FFE4C4',
                    '& .MuiSlider-thumb': {
                        backgroundColor: '#FFE4C4',
                        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                            boxShadow: 'inherit',
                        },
                        '&::before': {
                            display: 'none',
                        },
                    },
                }} />
            </div>

            {/* control for the thickness of grid outline */}
            <div className='controlcont' id="gridoutline">
                <p>Outline</p>
                <Slider defaultValue={50} onChange={(e, val) => outlinecha(val)} aria-label="Default" step={50} sx={{
                    width: 100,
                    float: 'right',
                    marginRight: '20px',
                    color: '#FFE4C4',
                    '& .MuiSlider-thumb': {
                        backgroundColor: '#FFE4C4',
                        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                            boxShadow: 'inherit',
                        },
                        '&::before': {
                            display: 'none',
                        },
                    },
                    '& .MuiSlider-track': {
                        color: '#FFE4C4',
                    },
                    '& .MuiSlider-rail': {
                        backgroundColor: '#FFE4C4',
                    },
                }} />
            </div>

            {/* control for saving and submition of the puzzle and exiting the page */}
            <div id="savesubmit">
                <Returnbut savetable={savetable} setleave={setleave} puzname={puzname} complete={complete} handlepenalrequest={handlepenalrequest} />
            </div>
        </div>
    )
}

/**
* create buttons that enables saving and submition of the puzzle and exiting the page
*
* @param  savetable - the user's current progress of the puzzle, a list of color, 
*                     each corresponding to the color of a cell on the puzzle board
* @param  puzname - the name of the puzzle
* @param  complete - a boolean value indicating whether the puzzle has been completed 
*
* @return save, exit, and complets button
*/
function Returnbut({ savetable, setleave, puzname, complete, handlepenalrequest }) {
    if (complete) {
        return (
            <div>
                <button className="controlbutton controlline" onClick={() => handlepenalrequest(savetable, 3, setleave, puzname)} style={{ display: 'block', height: "20px !important", fontSize:"40px"}} ref={(e) => e && e.style.setProperty("height", "90px", "important")}>COMPLETE</button>
            </div>
        )
    } else {
        return (
            <div>
                <button className="controlbutton controlline" onClick={() => handlepenalrequest(savetable, 1, setleave, puzname)} style={{ display: 'block' }}>SAVE</button>
                <button className="controlbutton controlline" onClick={() => handlepenalrequest(savetable, 2, setleave, puzname)}>EXIT</button>
            </div>
        )
    }
}

/**
* check if the user got to this page by the correct way (through the dashboard page) and get all needed information from the backend
*
* @param  puzname - the name of the puzzle
*/
function Check({ setcurnumtable, navigate, puzname, setnumtable, setcurrent, setallcol, setanstable, setsavetable }) {
    useEffect(() => {
        
        //go to dashboard if the user came to this page vis url
        if (puzname == null) {
            navigate("/paint/dash/")

        //if the user came to this page through the dashboard page, retrive all nessassary information about the puzzle
        } else {
            fetch('http://127.0.0.1:8000/backend/getpuzbyname', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: puzname
                })
                
            }).then((Response) => Response.json()).then((data) => {

                //go back to dash if the puzzle has already been completed by the user
                //users will not get here through conventional mean, 
                //this piece of code will only run if user complete the puzzle in another tab while the puzzle detail penal is open
                if (data == 'back') {
                    navigate("/paint/dash/")
                } else {

                    //get the table of puzzle answer
                    var colist = data[0].split('|').slice(0, data[0].split('|').length - 1)
                    var newanstable = []
                    for (var i = 0; i < colist.length; i++) {
                        newanstable.push(colist[i].split('!').slice(0, colist[i].split('!').length - 1))
                    }
                    setanstable(newanstable)

                    //get the current user progress in the puzzle
                    var newsavetable = []
                    var savelist = data[1].split('|').slice(0, data[1].split('|').length - 1)
                    for (var i = 0; i < savelist.length; i++) {
                        newsavetable.push(savelist[i].split('!').slice(0, savelist[i].split('!').length - 1))
                    }
                    setsavetable(newsavetable)

                    //get the list of colors needed to complete the puzzle
                    var isin = 0
                    var colcount = 1
                    var newcol = []
                    for (var i = 0; i < newanstable.length; i++) {
                        for (var j = 0; j < newanstable[0].length; j++) {
                            isin = 0
                            for (var k = 0; k < newcol.length; k++) {
                                if (newcol[k][0] == newanstable[i][j]) {
                                    isin = isin + 1
                                }
                            }
                            if (isin == 0) {
                                newcol.push([newanstable[i][j], colcount])
                                colcount = colcount + 1
                            }
                        }
                    }
                    setallcol(newcol)
                    setcurrent(newcol[0][0])

                    //turn the answer in to a number table that will be displayed on the puzzle board to help user solve the puzzle
                    var newnum = []
                    for (var i = 0; i < newanstable.length; i++) {
                        newnum.push([])
                        for (var j = 0; j < newanstable[0].length; j++) {
                            for (var k = 0; k < newcol.length; k++) {
                                if (newcol[k][0] == newanstable[i][j]) {
                                    newnum[i].push(newcol[k][1])
                                }
                            }
                        }
                    }
                    var curnum = structuredClone(newnum)
                    setcurnumtable(curnum)
                    setnumtable(newnum)
                }

                //animate a swipe in effect upon loading in the data
                document.getElementById('transitionin').classList.add('inswipe')

            })
        }
    }, []);
}

