import React from "react";
import { useState, useEffect, useRef } from "react";
import { Add } from "@material-ui/icons";
import { TextField, Slide } from "@mui/material";
import { Snackbar } from "@mui/material";
import { Close } from "@material-ui/icons";
import { KeyboardArrowDown } from "@material-ui/icons";
import { Slider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { RemoveCircle } from "@material-ui/icons";
import { AddCircle } from "@material-ui/icons";
import { toPng } from 'html-to-image';

/**
* retrieve the create page
* 
* @return the create page
*/
export default function Create() {
    return <MainPanel />
}

/**
* create the create page
* 
* @return the create page
*/
function MainPanel() {

    const navigate = useNavigate();
    const location = useLocation();
    const [startdate, setstartdate] = useState(location.state)
    const [distribution, setdistribution] = useState([['_______', '_______', '_______', '_______', '_______'],
    ['_______', '_______', '_______', '_______', '_______'],
    ['_______', '_______', '_______', '_______', '_______'],
    ['_______', '_______', '_______', '_______', '_______'],
    ['_______', '_______', '_______', '_______', '_______']]);
    const [moused, setmoused] = useState(false)
    const [screen, setscreen] = useState(0);
    const [colorlist, setcolorlist] = useState([]);
    const [color, setcolor] = useState('');
    const [des, setdes] = useState('');
    const [pen, setpen] = useState(0);
    const [message, setmessage] = useState('');
    const [current, setcurrent] = useState('FFFFFF');
    const [size, setsize] = useState(130);
    const [grid, setgrid] = useState(2);
    const [subtit, setsubtit] = useState('');
    const imgRef = useRef(null);
    const [save, setsave] = useState('');
    const [leave, setleave] = useState(false);
    const [open, setopen] = useState(false);
    const [newest, setnew] = useState('');
    const [eraonoroff, setonoroff] = useState('off');
    const [img, setimg] = useState();


    console.log(distribution)
    console.log(startdate)
    //check if the user have arrived at this page through the dashboard page, move to the dashboard page if not
    //get information about saved puzzle if yes
    useEffect(() => {
        if (location.state == null) {
            navigate("/paint/dash/")
        } else {
            document.getElementById('transitionin').classList.add('inswipe')
        }
        console.log(location.state)
        if (location.state != true) {
            fetch("/backend/getsavepuz" + "?puzdate=" + startdate).then((Response) => Response.json()).then((data) => {
                if(data=="back"){
                    navigate("/paint/dash/")
                }else{
                    var colist = data.split('|').slice(0, data.split('|').length - 1)
                    var newanstable = []
                    var newcolorlist = []
                    var isin=0
                    for (var i = 0; i < colist.length; i++) {
                        newanstable.push(colist[i].split('!').slice(0, colist[i].split('!').length - 1))
                    }
                    setdistribution(newanstable)
                    console.log(data)
                    for (var i = 0; i < newanstable.length; i++) {
                        for (var j = 0; j < newanstable[i].length; j++) {
                            isin = 0
                            for (var k = 0; k < newcolorlist.length; k++) {
                                if (newcolorlist[k] == newanstable[i][j].slice(1, newanstable[i][j].length)) {
                                    isin = isin + 1
                                }
                            }
                            if (newanstable[i][j]!="_______"&&isin == 0) {
                                newcolorlist.push(newanstable[i][j].slice(1, newanstable[i][j].length))
                            }
                        }
                    }
                    setcolorlist(newcolorlist)
                }
            })
        }
    }, []);

    //if no saved puzzle is opened (the user is creating a new puzzle), set puzzle name to empty to show the backend 
    //function the puzzle is not yet saved
    if (startdate == true) {
        setstartdate(0);
    }

    /**
    * change the color penal to the add color panel
    */
    function changeSelect() {
        setcolor('')
        setnew('')
        setscreen(1)
        for (let index = 0; index < colorlist.length; index++) {
            document.querySelector('#id'.concat(index.toString().concat(' .panelleftcolor'))).style.display = 'block';
        }
    }

    /**
    * change the add color panel to rhe color penal
    */
    function changeAdd() {
        setnew('')
        setcolor('')
        setscreen(0)
    }

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
    * change size of the pen
    * 
    * @param  val - the level of the gird thickness level, ranging from 0 (diameter of 1 px) to 4 (diameter of 9 px)
    */
    function chapen(val) {
        setpen(val / 25)
    }

    /**
    * create a pop up penal and send a warning message
    * 
    * @param  text - the text that would be written in the pop up penal
    */
    function messagepop(text) {
        if (open == true) {
            setopen(false)
            setTimeout(() => {
                setmessage(text)
                setopen(true)
            }, 200)
        } else {
            setmessage(text)
            setopen(true)
        }
    }

    /**
    * remove a color form the list of all currently used color, remove it from the board, changing the color to white (background color)
    * 
    * @param  e - the event of clicking the remove button on the color penal
    * @param  id - the id of the color being removed
    */
    function removelist(e, id) {
        setonoroff('off')
        e.stopPropagation()

        //set the current color to something else 
        //set it to a adjecent color if there is one, set it to white (empty), if no color is left
        if (id != 0) {
            setcurrent(colorlist[id - 1].toString())
        } else if (colorlist.length != 1) {
            setcurrent(colorlist[id + 1].toString())
        } else {
            setcurrent('')
        }

        //remove all of the color being removed on puzzle board
        var setwhite = colorlist[id].toString()
        setcolorlist([...colorlist.slice(0, id), ...colorlist.slice(id + 1)])
        var copy = [...distribution]
        for (let i = 0; i < copy.length; i++) {
            for (let j = 0; j < copy[0].length; j++) {
                if (copy[i][j] == '#'.concat(setwhite)) {
                    copy[i][j] = '_______'
                }
            }
        }
        console.log(copy)
        setdistribution(copy)
    }

    /**
    * change the current color penal to change color panel
    * 
    * @param  e - the event of clicking the Change Screen button on the color penal
    * @param  id - the id of the color panel being changed
    */
    function Changescreen(e, id) {
        e.stopPropagation()
        document.querySelector(id.toString().concat(' .panelright')).style.display = 'none';
        for (let index = 0; index < colorlist.length; index++) {
            document.querySelector('#id'.concat(index.toString().concat(' .panelleftcolor'))).style.display = 'block';
        }
        changeAdd()
        document.querySelector(id.concat(' .panelleftcolor')).style.display = 'none';
    }

    /**
    * change the change color panel to current color penal 
    * 
    * @param  id - the id of the change color panel being changed to current color penal 
    */
    function Colscreen(id) {
        setcolor('')
        setnew('')
        if (colorlist[parseInt(id.slice(3, 4))].toString() == current) {
            document.querySelector(id.toString().concat(' .panelright')).style.display = 'block';
        }
        document.querySelector(id.concat(' .panelleftcolor')).style.display = 'block';
    }

    /**
    * change the color the pen is painting with
    * 
    * @param  name - the name of the color being selected
    */
    function changecurrent(name) {
        setcurrent(name)
        setonoroff('off')
    }

    console.log(colorlist)
    //map the color penals wish to use to create the puzzle
    const colmap = colorlist.map((data) => {

        //set a signal to display a additional penal on top of a color penal 
        //to notify the user that the color is currently being used if it is currently being used
        var displaying = 'none'
        if (data.toString() == current) {
            displaying = 'block'
        }

        return (
            //color penal (shows one of the colors being used and allow user to manupulate the color)
            <div className="color" onClick={() => changecurrent(data.toString())} id={'id'.concat(colorlist.indexOf(data).toString())} key={colorlist.indexOf(data)} style={{ backgroundColor: '#'.concat(data) }}>

                {/* additional penal that will be display if the color in the ppenal is currently used */}
                <div className="panelright" style={{ display: displaying }}>
                    <p>Currently</p>
                    <p>Using</p>
                </div>

                {/* buttons user intract with */}
                <div className="panelleftcolor" >
                    <h2 className="listcolorname">#{data}</h2>
                    {/* Change color Button */}
                    <button onClick={(e) => Changescreen(e, '#id'.concat(colorlist.indexOf(data).toString()))} className="colorButton colorinlist">Change</button>
                    {/* Remove color Button */}
                    <button onClick={(e) => removelist(e, colorlist.indexOf(data))} className="colorButton colorinlist">Remove</button>
                </div>

                {/* Change color penal */}
                <div className="panelchangecolor" onClick={(e) => e.stopPropagation()}>
                    {/* preview panel, small panel that give a preview of the color change */}
                    <div className="panelshowside">
                        <div className="colpre newcha" style={{ backgroundColor: '#'.concat(data) }}>
                            <div className="colpre smalltop" style={{ backgroundColor: '#'.concat(data) }}></div>
                            <div className="colpre smallmid"><KeyboardArrowDown fontSize="small" className="arrow" /></div>
                        </div>
                    </div>

                    {/* buttons and text boxes user intract with */}
                    <div className='ui'>
                        <p className="mark">#</p>
                        {/* new color name text field */}
                        <TextField onChange={(e) => handle(e, '#id'.concat(colorlist.indexOf(data).toString()))} id='color' defaultValue={data.toString()} placeholder="Hex Code" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { display: 'inline', paddingLeft: '5px', fontSize: 15, marginLeft: '5px', width: '100px', borderRadius: '5px', borderStyle: 'solid', borderColor: '#2A2622', borderWidth: '4px' } }} onInput={(e) => { e.target.value = e.target.value.toString().slice(0, 6) }} />
                        {/* new color submit button */}
                        <button onClick={() => colchange(colorlist.indexOf(data))} className="colorButton">Submit</button>
                        {/* cancel change color button */}
                        <button onClick={() => Colscreen('#id'.concat(colorlist.indexOf(data).toString()))} className="colorButton">Cancel</button>
                    </div>
                </div>
            </div>
        )
    })

    /**
    * change the color on the board and in the color penal
    * 
    * @param id - the id of the color being changed
    */
    function colchange(id) {

        //check if the color inputted is valid, else print error message in pop up window
        //check if the color inputted is in a hex format, expand the hex number as it might be condensed (using 3 number instead of 6)
        const pattern = /^([0-9A-F]{3}){1,2}$/i;
        if (''.concat(newest) != '' && pattern.test(newest.color.slice(0, newest.color.length))) {
            var expand = ''
            for (let index = 0; index < newest.color.length; index++) {
                expand = expand.concat(newest.color.slice(index, index + 1))
                expand = expand.concat(newest.color.slice(index, index + 1))
            }

            //check if the color inputted is already in use in another color penal
            var changeornot = true;
            for (let index = 0; index < colorlist.length; index++) {
                if (colorlist[index].toUpperCase() == newest.color.slice(0, newest.color.length).toUpperCase() || colorlist[index].toUpperCase() == expand.toUpperCase()) {
                    changeornot = false;
                }
            }

            //if the color inputted is valid, change color and go back
            if (changeornot) {
                var oldval = colorlist[id].toString()
                Colscreen('#id'.concat(id))

                //if the color inputted is condensed, set all color already on the puzzle board to the inputted color 
                if (newest.color.length == 6) {
                    var newobj = newest.color.slice(0, newest.color.length).toUpperCase()
                    setonoroff('off')
                    setcurrent(newest.color.slice(0, newest.color.length).toUpperCase())
                    var copy = [...distribution]
                    for (let i = 0; i < copy.length; i++) {
                        for (let j = 0; j < copy[0].length; j++) {
                            if (copy[i][j] == '#'.concat(oldval)) {
                                copy[i][j] = '#'.concat(newest.color.slice(0, newest.color.length).toUpperCase())
                            }
                        }
                    }

                //if the color inputted is condensed, set all color already on the puzzle board to the expended inputted color 
                } else {
                    var oldval = colorlist[id].toString()
                    var newobj = expand.toUpperCase()
                    setonoroff('off')
                    setcurrent(expand.toUpperCase())
                    var copy = [...distribution]
                    for (let i = 0; i < copy.length; i++) {
                        for (let j = 0; j < copy[0].length; j++) {
                            if (copy[i][j] == '#'.concat(oldval)) {
                                copy[i][j] = '#'.concat(expand.toUpperCase())
                            }
                        }
                    }
                }

                //change the color in the color penal
                var newcolorlist = [...colorlist.slice(0, id), newobj, ...colorlist.slice(id + 1)]
                setcolorlist(newcolorlist)
                setdistribution(copy)

                //error message for using the same color
            } else {
                messagepop('Please use a different color')
            }
            //error message for using invalid input
        } else {
            messagepop('Please enter a valid hex code')
        }
    }

    /**
    * add a new color to the list of colors available to use
    */
    function addtolist() {

        //check if the color inputted is valid, else print error message in pop up window
        //check if the color inputted is in a hex format, expand the hex number as it might be condensed (using 3 number instead of 6)
        const pattern = /^([0-9A-F]{3}){1,2}$/i;
        if (''.concat(newest) != '' && pattern.test(newest.color.slice(0, newest.color.length))) {
            var expand = ''
            for (let index = 0; index < newest.color.length; index++) {
                expand = expand.concat(newest.color.slice(index, index + 1))
                expand = expand.concat(newest.color.slice(index, index + 1))
            }

            //check if the color inputted is already in use in another color penal
            var addornot = true;
            for (let index = 0; index < colorlist.length; index++) {
                if (colorlist[index].toUpperCase() == newest.color.slice(0, newest.color.length).toUpperCase() || expand.toUpperCase() == colorlist[index].toUpperCase()) {
                    addornot = false;
                }
            }

            //if the color inputted is valid, add color and go back
            if (addornot) {
                changeAdd();
                if (newest.color.length == 6) {
                    var newobj = newest.color.slice(0, newest.color.length).toUpperCase()
                } else {
                    var newobj = expand.toUpperCase()
                }
                setonoroff('off')
                setcurrent(newobj.toString())
                setcolorlist([...colorlist, newobj])

                //error message for using the same color
            } else {
                messagepop('Please use a different color')
            }
            //error message for using invalid input
        } else {
            messagepop('Please enter a valid hex code')
        }
    }

    /**
    * change the result color in the preview panels to the new color
    * 
    * @param id - the id of the color being changed
    * @param newc - the color to change into
    */
    function assign(id, newc) {
        var newcolor = ''
        newcolor = '#'.concat(newc.color.slice(0, newc.color.length))
        if (id == '-1') {
            document.querySelector('#preview').style.backgroundColor = newcolor;
        } else {
            document.querySelector(id.concat(' .newcha')).style.backgroundColor = newcolor;
        }
    }

    /**
    * handle the changes in the change/add color text field
    * 
    * @param e - the text change event 
    * @param id - the id of the color being changed/added
    */
    function handle(e, id) {
        const newc = { color }
        newc[e.target.id] = e.target.value
        setnew(newc)
        const pattern = /^([0-9A-F]{3}){1,2}$/i;
        if (pattern.test(newc.color.slice(0, newc.color.length))) {
            assign(id, newc)
            setcolor(newc)
        }

    }

    //close the pop up alarm
    const handleClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setopen(false)
    }

    // create the close button on the pop up alarm
    const action = (
        <React.Fragment>
            <button id="popbut" aria-label="close" onClick={handleClose} >
                <Close id="popic" />
            </button>
        </React.Fragment>
    );

    //create the pixel canvas (puzzle board)
    const pixelcanvas = distribution.map((data, rowindex) => {
        const rows = data.map((subdata, cellindex) => {
            if (subdata == '_______') {
                return (
                    <div id={'row'.concat(rowindex.toString()).concat('cell'.concat(cellindex.toString()))} onMouseDown={() => changecanpass(rowindex, cellindex)} onMouseEnter={() => changecan(rowindex, cellindex)} key={'cell'.concat(cellindex.toString())} className="cvgrid" style={{ width: size.toString().concat('px'), height: size.toString().concat('px') }}><div className="innercolor" style={{ marginLeft: grid.toString().concat('%'), marginTop: grid.toString().concat('%'), backgroundColor: '#FFFFFF', width: (100 - (grid * 2)).toString().concat('%'), height: (100 - (grid * 2)).toString().concat('%') }}></div></div>
                )
            } else {
                return (
                    <div id={'row'.concat(rowindex.toString()).concat('cell'.concat(cellindex.toString()))} onMouseDown={() => changecanpass(rowindex, cellindex)} onMouseEnter={() => changecan(rowindex, cellindex)} key={'cell'.concat(cellindex.toString())} className="cvgrid" style={{ width: size.toString().concat('px'), height: size.toString().concat('px') }}><div className="innercolor" style={{ marginLeft: grid.toString().concat('%'), marginTop: grid.toString().concat('%'), backgroundColor: subdata, width: (100 - (grid * 2)).toString().concat('%'), height: (100 - (grid * 2)).toString().concat('%') }}></div></div>
                )
            }
        })
        return (
            <div id={'row'.concat(rowindex.toString())} key={'row'.concat(rowindex.toString())}>
                {rows}
            </div>
        )
    })

    //create row of add/remove column button, only create the remove column buttons if there are a good number of columns (5 columns)
    const row = distribution[0].map((data, rowindex) => {
        if (distribution[0].length > 5)
            if (rowindex == distribution[0].length - 1) {
                return (
                    <span className='groupbut' key={'group'.concat(rowindex)}>
                        <span key={'add'.concat(rowindex)} className="adding" onClick={() => addco(rowindex)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><AddCircle className="buttoncanv" /></span>
                        <span key={'rm'.concat(rowindex)} className="removing" onClick={() => removeco(rowindex)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><RemoveCircle className="buttoncanv" /></span>
                        <span key={'add'.concat(rowindex + 1)} className="adding" onClick={() => addco(rowindex + 1)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><AddCircle className="buttoncanv" /></span>
                    </span>
                )
            } else {
                return (
                    <span className='groupbut' key={'group'.concat(rowindex)}>
                        <span key={'add'.concat(rowindex)} className="adding" onClick={() => addco(rowindex)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><AddCircle className="buttoncanv" /></span>
                        <span key={'rm'.concat(rowindex)} className="removing" onClick={() => removeco(rowindex)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><RemoveCircle className="buttoncanv" /></span>
                    </span>
                )
            }
        else {
            if (rowindex == distribution[0].length - 1) {
                return (
                    <span className='groupbut' key={'group'.concat(rowindex)}>
                        <span key={'add'.concat(rowindex)} className="adding" onClick={() => addco(rowindex)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><AddCircle className="buttoncanv" /></span>
                        <span key={'rm'.concat(rowindex)} className="removing" style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}></span>
                        <span key={'add'.concat(rowindex + 1)} className="adding" onClick={() => addco(rowindex + 1)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><AddCircle className="buttoncanv" /></span>
                    </span>
                )
            } else {
                return (
                    <span className='groupbut' key={'group'.concat(rowindex)}>
                        <span key={'add'.concat(rowindex)} className="adding" onClick={() => addco(rowindex)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><AddCircle className="buttoncanv" /></span>
                        <span key={'rm'.concat(rowindex)} className="removing" style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}></span>
                    </span>
                )
            }
        }
    })

    //create columns of add/remove row button, only create the remove row buttons if there are a good number of rows (5 rows)
    const col = distribution.map((data, rowindex) => {
        if (distribution.length > 5)
            if (rowindex == distribution.length - 1) {
                return (
                    <span className='groupbut' key={'group'.concat(rowindex)}>
                        <span key={'add'.concat(rowindex)} className="adding" onClick={() => addro(rowindex)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><AddCircle className="buttoncanv" /></span>
                        <span key={'rm'.concat(rowindex)} className="removing" onClick={() => removero(rowindex)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><RemoveCircle className="buttoncanv" /></span>
                        <span key={'add'.concat(rowindex + 1)} className="adding" onClick={() => addro(rowindex + 1)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><AddCircle className="buttoncanv" /></span>
                    </span>
                )
            } else {
                return (
                    <span className='groupbut' key={'group'.concat(rowindex)}>
                        <span key={'add'.concat(rowindex)} className="adding" onClick={() => addro(rowindex)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><AddCircle className="buttoncanv" /></span>
                        <span key={'rm'.concat(rowindex)} className="removing" onClick={() => removero(rowindex)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><RemoveCircle className="buttoncanv" /></span>
                    </span>
                )
            }
        else {
            if (rowindex == distribution.length - 1) {
                return (
                    <span className='groupbut' key={'group'.concat(rowindex)}>
                        <span key={'add'.concat(rowindex)} className="adding" onClick={() => addro(rowindex)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><AddCircle className="buttoncanv" /></span>
                        <span key={'rm'.concat(rowindex)} className="removing" style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}></span>
                        <span key={'add'.concat(rowindex + 1)} className="adding" onClick={() => addro(rowindex + 1)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><AddCircle className="buttoncanv" /></span>
                    </span>
                )
            } else {
                return (
                    <span className='groupbut' key={'group'.concat(rowindex)}>
                        <span key={'add'.concat(rowindex)} className="adding" onClick={() => addro(rowindex)} style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}><AddCircle className="buttoncanv" /></span>
                        <span key={'rm'.concat(rowindex)} className="removing" style={{ width: (size / 2).toString().concat('px'), height: (size / 2).toString().concat('px') }}></span>
                    </span>
                )
            }
        }
    })

    /**
    * remove a row from the puzzle board
    * 
    * @param id - the id (index) of the row being removed
    */
    function removero(id) {
        var copy = [...distribution]
        copy = [...copy.slice(0, id), ...copy.slice(id + 1, copy.length)]
        setdistribution(copy)
    }

    /**
    * add a row to the puzzle board
    * 
    * @param id - the id of the row being added
    */
    function addro(id) {
        var copy = [...distribution]
        var newrow = []
        for (let index = 0; index < copy[0].length; index++) {
            newrow = [...newrow, '_______']
        }
        copy = [...copy.slice(0, id), newrow, ...copy.slice(id, copy.length)]
        setdistribution(copy)
    }

    /**
    * remove a column from the puzzle board
    * 
    * @param id - the id (index) of the column being removed
    */
    function removeco(id) {
        var copy = [...distribution]
        for (let index = 0; index < copy.length; index++) {
            copy[index] = [...copy[index].slice(0, id), ...copy[index].slice(id + 1, copy[index].length)]
        }
        setdistribution(copy)
    }

    /**
    * add a column to the puzzle board
    * 
    * @param id - the id of the column being added
    */
    function addco(id) {
        var copy = [...distribution]
        for (let index = 0; index < copy.length; index++) {
            copy[index] = [...copy[index].slice(0, id), '_______', ...copy[index].slice(id, copy[index].length)]
        }
        setdistribution(copy)
    }

    /**
    * change color on the puzzle board when pen is down, this runs when mouse is clicking the puzzle board
    * 
    * @param row - the id (index) of the row of the square that changes color 
    * @param cell - the id (index) of the column of the square that changes color 
    */
    function changecanpass(row, cell) {
        var pencolor = current.toString()

        //fill in color on the puzzle board in accordance to pen color and size
        var copy = [...distribution]
        for (let index = 0; index < copy.length; index++) {
            for (let i = 0; i < copy[0].length; i++) {
                if ((row + pen) >= index && (row - pen) <= index && (cell + pen) >= i && (cell - pen) <= i) {
                    if(eraonoroff.toString() == 'on'){
                        copy[index][i] = "_______"
                    }else{
                        copy[index][i] = '#'.concat(pencolor)
                    }
                }
            }
        }
        setdistribution(copy)
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

            //fill in color on the puzzle board in accordance to pen color and size
            var copy = [...distribution]
            for (let index = 0; index < copy.length; index++) {
                for (let i = 0; i < copy[0].length; i++) {
                    if ((row + pen) >= index && (row - pen) <= index && (cell + pen) >= i && (cell - pen) <= i) {
                        if(eraonoroff.toString() == 'on'){
                            copy[index][i] = "_______"
                        }else{
                            copy[index][i] = '#'.concat(pencolor)
                        }
                    }
                }
            }
            setdistribution(copy)
        }
    }

    /**
    * tell the program the user wants to use eraser rather than the pen when painting
    */
    function setera() {
        setcurrent('era')
        setonoroff('on')
    }

    /**
    * handle changes in submission title text field
    * 
    * @param e - the text change event 
    */
    function subhandle(e) {
        const newsub = { save }
        newsub[e.target.id] = e.target.value
        setsubtit(newsub)
    }

    /**
    * handle changes in save title text field
    * 
    * @param e - the text change event 
    */
    function savehandle(e) {
        const news = { save }
        news[e.target.id] = e.target.value
        setsave(news)
    }

    /**
    * handle changes in submission description text field
    * 
    * @param e - the text change event 
    */
    function deshandle(e) {
        const newd = { save }
        newd[e.target.id] = e.target.value
        setdes(newd)
    }

    /**
    * submit a puzzle user is done creating
    */
    function submitreal() {

        //check if there are error in data inputted, if there is no name or no description, submit fails and a error pop up is shown
        if (subtit.subtit == null || subtit.subtit.toString() == '') {
            messagepop('Please enter a name to submit')
        } else if (des.des == null || des.des == '') {
            messagepop('Please enter a description of the puzzle')
        } else {

            //turn a array of color on the puzzle board, in to a string so that it can be accepted by the database
            // also determine the size of puzzle
            var strcopy = ''
            var score = 0
            for (let index = 0; index < distribution.length; index++) {
                for (let i = 0; i < distribution[0].length; i++) {
                    if (distribution[index][i] == '_______') {
                        strcopy = strcopy + '#FFFFFF'
                    } else {
                        strcopy = strcopy + (distribution[index][i])
                    }
                    strcopy = strcopy + ('!')
                    score = score + 1
                }
                strcopy = strcopy + ('|')
            }

            //save the new puzzle in the backend
            const formData = new FormData();
            formData.enctype = "multipart/form-data"
            formData.append('score', score);
            formData.append('name', subtit.subtit.toString());
            formData.append('describe', des.des.toString());
            formData.append('img', img);
            formData.append('ans', strcopy);
            formData.append('startdate', startdate);

            fetch('http://127.0.0.1:8000/backend/addnewsubmit', {
                method: 'POST',
                headers: {},
                body: formData
            }).then((Response) => Response.json()).then((data) => {

                //if the puzzle have a repeated name or is a complete copy of another puzzle, submittion upload will fail and warning message will be given in a pop up
                //if there is no issue, submission will bw successful and a penal will notify the user of the submission.
                if (data == 'redo') {
                    messagepop('This puzzle already exists, please make something different')
                } else if (data == 'rename') {
                    messagepop('A puzzle with this title already exists, please name it something different')
                }else if (data == 'back') {
                    goback(true)
                } else {
                    document.querySelector('#submit').style.display = "none";
                    document.querySelector('.submitconfirm').style.display = "block";
                }
            })
        }
    }

    /**
    * save a puzzle user is not done creating, this puzzle will only be avilible to the user that created it
    */
    function savereal() {

        //check if there are error in data inputted, if there is no name, submit fails and a error pop up is shown
        if (save.save == null || save.save.toString() == '') {
            messagepop('Please enter a name for the save')
        } else {

            //turn a array of color on the puzzle board, in to a string so that it can be accepted by the database
            var strcopy = ''
            for (let index = 0; index < distribution.length; index++) {
                for (let i = 0; i < distribution[0].length; i++) {
                    strcopy = strcopy + (distribution[index][i])
                    strcopy = strcopy + ('!')
                }
                strcopy = strcopy + ('|')
            }

            //save the new puzzle in a local save model in the backend
            const formData = new FormData();
            formData.enctype = "multipart/form-data"
            formData.append('title', save.save.toString());
            formData.append('localans', strcopy);
            formData.append('img', img);
            formData.append('startdate', startdate);

            console.log(formData.get('startdate'))
            fetch('http://127.0.0.1:8000/backend/addnewsave', {
                method: 'POST',
                headers: {},
                body: formData
            }).then((Response) => Response.json()).then((data) => {

                //if the puzzle have a repeated name as another locally saved puzzle, submittion upload will fail and warning message will be given in a pop up
                //if there is no issue, submission will bw successful and a penal will notify the user of the save.
                if (data == false) {
                    messagepop('A save with this title already exists, please name it something different')
                }else if (data == "back") {
                    goback(true)
                } else {
                    setstartdate(data)
                    document.querySelector('#savepanel').style.display = "none";
                    document.querySelector('.saveconfirm').style.display = "block";
                }
            })
        }
    }

    /**
    * handle quitting the save, submit, and quit penals
    * 
    * @param leave - a boolean value that represent whether the program should go to the dash board and quit the create page
    */
    function goback(leave) {

        //quit all the additional penal (extra penals used to handle save, submit, and quit) on screen,and return to a unblured view of the puzle board
        document.querySelector('.maincanv').style.filter = "blur(0px)";
        document.querySelector('.distance').style.display = "none";
        document.querySelector('#savepanel').style.display = "none";
        document.querySelector('.saveconfirm').style.display = "none";
        document.querySelector('.savequit').style.display = "none";
        document.querySelector('#submit').style.display = "none";
        document.querySelector('.submitconfirm').style.display = "none";

        //go back to dash board
        if (leave) {
            document.getElementById('transitionout').classList.add('outswipe')
            setTimeout(() => {
                navigate("/paint/dash/")
            }, 500);
        }
    }

    /**
    * open the save penal
    */
    function gotosave() {
        document.querySelector('#savepanel').style.display = "block";
        document.querySelector('.savequit').style.display = "none";
    }

    return (

        //create the page and all of its components 
        <div className='all'>
            <div className='maincanv' onMouseUp={() => setmoused(false)}>

                <div className='leftsidecreate'>

                    {/* the list of color penals the user wishes to use and manipulate, also add the add new color penal */}
                    <div className='colorPicker'>
                        {colmap}
                        <Addnew screen={screen} handle={handle} addtolist={addtolist} changeAdd={changeAdd} changeSelect={changeSelect} />
                    </div>

                    {/* the panel for tools the user have to manipulate the puzzle board */}
                    <div className='controlPenal'>
                        <div className='empty'></div>
                        <Controls setleave={setleave} setimg={setimg} grid={grid} imgRef={imgRef} eraonoroff={eraonoroff} setera={setera} outlinecha={outlinecha} scaled={scaled} chapen={chapen} />
                    </div>
                </div>

                {/* the puzzle board, and the buttons to add or remove rows or columns of the grid */}
                <div className='createCanvas' onMouseDown={() => setmoused(true)}>
                    <div className='canmove' style={{ width: (size * (distribution[0].length + 3)).toString().concat('px'), height: (size * (distribution.length + 3)).toString().concat('px') }}>
                        <div id='buttonrow' style={{ marginBottom: (size * (distribution.length + 1)).toString().concat('px') }}>
                            {row}
                        </div>
                        <div id='buttoncol' style={{ marginRight: (size * (distribution[0].length + 1)).toString().concat('px') }}>
                            {col}
                        </div>
                        <div ref={imgRef} className='cancenter' style={{ borderWidth: ((grid) * size / 70).toString().concat('px') }}>
                            {pixelcanvas}
                        </div>
                    </div>
                </div>
            </div>

            {/* the pop up, used to display warning messages */}
            <Snackbar autoHideDuration={6000} TransitionComponent={Slide} message={message} action={action} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} ContentProps={{
                sx: {
                    borderColor: '#2A2622',
                    border: 7,
                    borderRadius: 15,
                    background: 'bisque',
                    mb: 50,
                    fontSize: 20,
                    color: '#2A2622',
                    margin: 0,
                    overflow: 'hidden',
                }
            }}></Snackbar>

            {/* the penals for save submit or quit, displayed at the center of the screen */}
            <div className='distance'>

                {/* the save penal */}
                <div id='savepanel'>
                    <h1>SAVE AS</h1>
                    <TextField onChange={(e) => savehandle(e)} id='save' defaultValue={save} placeholder="name" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { display: 'inline', paddingLeft: '5px', fontSize: 30, marginLeft: '25px', width: '365px', borderRadius: '5px', borderStyle: 'solid', borderColor: '#2A2622', borderWidth: '4px' } }} onInput={(e) => { e.target.value = e.target.value.toString().slice(0, 50) }} />
                    <button onClick={() => savereal()} className="savebutton">SAVE</button>
                    <button onClick={() => goback(leave)} className="savebutton">QUIT</button>
                </div>

                {/* the penal letting user know the save have been successful */}
                <div className='saveconfirm'>
                    <h1>YOUR PROGRESS HAS BEEN SAVED</h1>
                    <button onClick={() => goback(leave)} className="savebutton">COOL</button>
                </div>

                {/* the quit penal */}
                <div className='savequit'>
                    <h1>DO YOU WISH TO SAVE</h1>
                    <button onClick={() => gotosave()} className="savebutton">YES</button>
                    <button onClick={() => goback(true)} className="savebutton">NO</button>
                </div>

                {/* the submit penal */}
                <div id='submit'>
                    <h1>SUBMIT AS</h1>
                    <TextField onChange={(e) => subhandle(e)} id='subtit' defaultValue={subtit} placeholder="name" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { display: 'inline', paddingLeft: '5px', fontSize: 30, marginLeft: '25px', width: '365px', borderRadius: '5px', borderStyle: 'solid', borderColor: '#2A2622', borderWidth: '4px' } }} onInput={(e) => { e.target.value = e.target.value.toString().slice(0, 50) }} />
                    <TextField onChange={(e) => deshandle(e)} id='des' defaultValue={des} placeholder="Add a Description " variant="standard" multiline rows={12} InputProps={{ disableUnderline: true, }} inputProps={{ style: { marginTop: '20px', display: 'inline', paddingTop: '10px', paddingLeft: '5px', fontSize: 30, marginLeft: '25px', width: '365px', borderRadius: '5px', borderStyle: 'solid', borderColor: '#2A2622', borderWidth: '4px' } }} />
                    <button onClick={() => submitreal()} className="savebutton">SUBMIT</button>
                    <button onClick={() => goback(false)} className="savebutton">QUIT</button>
                </div>

                {/* the penal letting user know the submit have been successful */}
                <div className='submitconfirm'>
                    <h1>YOUR WORK HAS BEEN SUBMITTED</h1>
                    <button onClick={() => goback(true)} className="savebutton">COOL</button>
                </div>
            </div>

            {/* swiping animation played whenentering or exioting the page */}
            <div id="transitionin"></div>
            <div id="transitionout"></div>
        </div>
    )
}

/**
* create the add new color penal
* 
* @param  screen - id marking whether the user is on color add penal or color select penal
*
* @return the add new color penal
*/
function Addnew({ handle, addtolist, changeSelect, changeAdd, screen }) {
    if (screen == 0) {
        return <Addcol changeSelect={changeSelect} />
    } else {
        return <Select changeAdd={changeAdd} addtolist={addtolist} handle={handle} />
    }
}

/**
* create the add new color button
* 
* @return the add new color button
*/
function Addcol({ changeSelect }) {
    return (
        <div className='addcolor' onClick={() => changeSelect()}>
            <Add id='add' />
        </div>
    )
}

/**
* create the new color selection panel
* 
* @return the new color selection panel
*/
function Select({ changeAdd, handle, addtolist }) {
    return (
        <div className='selectcolor'>
            <div className="colpre" id="preview" ></div>
            <div className='ui'>
                <p className="mark">#</p>
                <TextField onChange={(e) => handle(e, '-1')} id='color' defaultValue={''} placeholder="Hex Code" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { display: 'inline', paddingLeft: '5px', fontSize: 15, marginLeft: '5px', width: '100px', borderRadius: '5px', borderStyle: 'solid', borderColor: '#2A2622', borderWidth: '4px' } }} onInput={(e) => { e.target.value = e.target.value.toString().slice(0, 6) }} />
                <button onClick={() => addtolist()} className="colorButton">Submit</button>
                <button onClick={() => changeAdd()} className="colorButton">Cancel</button>
            </div>
        </div>
    )
}

/**
* create the control panel, a penal used to manupulate the puzzle board
*
* @param  grid - the width of the grid on the puzzle board
* @param  imgRef - the puzzle board div component
* @param  eraonoroff - whether the eraser is on or off
*
* @return the control panel
*/
function Controls({ setleave, grid, setimg, imgRef, eraonoroff, setera, scaled, chapen, outlinecha }) {
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

            {/* control for the eraser, (on or off) */}
            <div id="eraseron" onClick={() => setera()}>
                <div id="eraserleft">
                    <p>Eraser</p>
                </div>
                <div id="eraserright">
                    <p>{eraonoroff.toString().toUpperCase()}</p>
                </div>
            </div>

            {/* control for the pen size */}
            <div className='controlcont' id="colorscale">
                <p>Pen Size</p>
                <Slider defaultValue={0} step={25} onChange={(e, val) => chapen(val)} aria-label="Default" sx={{
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
                <button className="controlbutton" onClick={() => handlepenalrequest(setimg, grid, 1, imgRef, setleave)}>SAVE</button>
                <button className="controlbutton" onClick={() => handlepenalrequest(setimg, grid, 2, imgRef, setleave)}>EXIT</button>
                <button className="controlbutton controlline" onClick={() => handlepenalrequest(setimg, grid, 3, imgRef, setleave)}>SUBMIT</button>
            </div>
        </div>
    )
}

/**
* return the puzzle board back to normal after saving a image of the puzzle board without grid
*
* @param  grid - the width of the grid on the puzzle board
*/
function sqreset(grid) {
    document.querySelector('.cancenter').style.borderWidth = ((grid)).toString().concat('px')
    document.querySelectorAll('.innercolor').forEach((element) => {
        element.style.width = (100 - (grid * 2)).toString().concat('%')
        element.style.height = (100 - (grid * 2)).toString().concat('%')
        element.style.marginLeft = grid.toString().concat('%')
        element.style.marginTop = grid.toString().concat('%')
    })
}

/**
* handle leave, submit, and exit
*
* @param  grid - the width of the grid on the puzzle board
* @param  order - an id indicating which of the three (save, submit, and exit) button is clicked
* @param  imgRef - the puzzle board div component
*/
function handlepenalrequest(setimg, grid, order, imgRef, setleave) {

    //handle save button, display the save penal
    if (order == 1) {
        setleave(false)
        document.querySelector('.maincanv').style.filter = "blur(10px)";
        document.querySelector('.distance').style.display = "grid";
        document.querySelector('#savepanel').style.display = "block";
        document.querySelector('.saveconfirm').style.display = "none";
        document.querySelector('.savequit').style.display = "none";
        document.querySelector('#submit').style.display = "none";
        document.querySelector('.submitconfirm').style.display = "none";
    }

    //handle submit button, display the submit penal
    if (order == 2) {
        setleave(true)
        document.querySelector('.maincanv').style.filter = "blur(10px)";
        document.querySelector('.savequit').style.display = "block";
        document.querySelector('.distance').style.display = "grid";
        document.querySelector('#savepanel').style.display = "none";
        document.querySelector('.saveconfirm').style.display = "none";
        document.querySelector('#submit').style.display = "none";
        document.querySelector('.submitconfirm').style.display = "none";

    }

    //handle exit button , display the exit penal
    if (order == 3) {
        setleave(true)
        document.querySelector('.distance').style.display = "grid";
        document.querySelector('.maincanv').style.filter = "blur(10px)";
        document.querySelector('#submit').style.display = "block";
        document.querySelector('#savepanel').style.display = "none";
        document.querySelector('.saveconfirm').style.display = "none";
        document.querySelector('.savequit').style.display = "none";
        document.querySelector('.submitconfirm').style.display = "none";
    }

    //prepare puzzle board for saving as a image (removing the grid line)
    document.querySelectorAll('.innercolor').forEach((element) => {
        element.style.width = '100%'
        element.style.height = '100%'
        element.style.marginLeft = '0'
        element.style.marginTop = '0'
    })

    //prepare save the puzzle board as a image
    document.querySelector('.cancenter').style.borderWidth = '0px'
    toPng(imgRef.current, { cacheBust: false })
        .then((dataUrl) => {
            setimg(dataUrl)
        }).then(() => sqreset(grid))
}

