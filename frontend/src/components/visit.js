import React from "react";
import { useState, useEffect } from "react";
import { TextField, Slide } from "@mui/material";
import { Close } from "@material-ui/icons";
import { Snackbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { KeyboardDoubleArrowUp, KeyboardDoubleArrowDown, ThumbUp, Search } from "@mui/icons-material";

/**
* retrieve the visit page
* 
* @return the visit page
*/
export default function Visit() {
    return <MainPanel />
}

/**
* create the visit page
* 
* @return the visit page
*/
function MainPanel() {
    const navigate = useNavigate();
    const location = useLocation();
    const vusername = location.state;
    const [profpic, setprofpic] = useState('')
    const [score, setscore] = useState(0)
    const [nopuz, setnopuz] = useState(false)
    const [alllike, setalllike] = useState([])
    const [quitting, setquitting] = useState(false)
    const [allcreate, setallcreate] = useState([])
    const [allcomp, setallcomp] = useState([])
    const [sortorderas, setsortorderas] = useState(true)
    const [alldisplay, setalldisplay] = useState([])
    const [noreturnline, setnoreturnline] = useState('null')
    const [cursort, setsort] = useState(0)
    const [curpage, setcurpage] = useState(1)
    const [compnum, setcompnum] = useState(0)
    const [createnum, setcreatenum] = useState(0)
    const [alldisplaypage, setalldisplaypage] = useState(0)
    const [curcontent, setcontent] = useState(0)
    const [user, setuser] = useState('guest')
    const [name, setname] = useState('')
    const [curpuz, setcurpuz] = useState([])
    const [search, setsearch] = useState('')
    const [searchres, setsearchres] = useState('')

    /**
    * handle the loading screen, show or remove it depending on if contents have finished loading
    */
    function loading(curload) {
        if (curload) {
            document.getElementById("loading").style.display = "block";
        } else {
            document.getElementById("loading").style.display = "none";
        }
    }

    
    return (
        //create the page and all of its components 
        <div>
            <Check setname={setname} vusername={vusername} setcurpuz={setcurpuz} setuser={setuser} setalldisplaypage={setalldisplaypage} setnoreturnline={setnoreturnline} setalldisplay={setalldisplay} setalllike={setalllike} setallcreate={setallcreate} setallcomp={setallcomp} setnopuz={setnopuz} setprofpic={setprofpic} setcompnum={setcompnum} setcreatenum={setcreatenum} setscore={setscore} navigate={navigate} />
            <Gallery navigate={navigate} name={name} quitting={quitting} setquitting={setquitting} loading={loading} setnopuz={setnopuz} search={search} searchres={searchres} setsearchres={setsearchres} setsearch={setsearch} user={user} curpuz={curpuz} setcurpuz={setcurpuz} curcontent={curcontent} setcontent={setcontent} setalldisplaypage={setalldisplaypage} setalldisplay={setalldisplay} alldisplaypage={alldisplaypage} setcurpage={setcurpage} curpage={curpage} cursort={cursort} setsort={setsort} noreturnline={noreturnline} setnoreturnline={setnoreturnline} alldisplay={alldisplay} sortorderas={sortorderas} setsortorderas={setsortorderas} allcreate={allcreate} allcomp={allcomp} profpic={profpic} compnum={compnum} createnum={createnum} score={score} nopuz={nopuz} alllike={alllike} setalllike={setalllike}/>
        </div>
    )
}

/**
* check if the user got to this page by the correct way (through the dashboard page) and get all needed information from the backend
*
* @param  vusername - the name of the user being visited
*/
function Check({ setname, navigate, vusername, setcurpuz, setuser, setalldisplaypage, setnoreturnline, setalldisplay, setalllike, setallcreate, setallcomp, setnopuz, setprofpic, setcompnum, setcreatenum, setscore }) {
    useEffect(() => {

        //go to dashboard if the user came to this page vis url
        if (vusername == null) {
            navigate("/paint/dash/")

        //if the user came to this page through the dashboard page or another visit page, retrive all nessassary information about the user being visited
        } else {
            fetch("/backend/getvisit" + "?vname=" + vusername).then((Response) => Response.json()).then((data) => {
                setname(data[0])
                setprofpic(data[1])
                setcompnum(data[2])
                setcreatenum(data[3])
                setscore(data[4])
                setallcomp(data[6])
                setallcreate(data[7])
                setalllike(data[8])
                if (data[5] == 'none') {
                    setnopuz(true)
                    setnoreturnline('This user have not completed any puzzle')

                    //placeholder
                    setcurpuz([null, '2024-06-09T21:07:36.649215Z', 35, 0, 1, '2', '2', 'kkk', null, '#333333!#333333!#333333!#333333!#333333!#333333!#3…#887766!#FFFFFF!#333333!#FFFFFF!#887766!#FFFFFF!|'])
                } else {
                    setalldisplay(data[5][0])
                    setalldisplaypage(data[5][1])
                    fetch("/backend/getdetail" + "?curpuz=" + data[5][0][0][1] + 2).then((Response) => Response.json()).then((data) => {
                        setcurpuz(data)
                    })
                }
                setuser(data[9])

                //animate a swipe in effect upon loading in the data
                document.getElementById('transitionin').classList.add('inswipe')
            })
        }
    }, []);
    return
}

/**
* retrieve the current sorting order
*
* @param  cursort - a code for different type of sorting order
*
* @return the current order user is using to sort puzzles
*/
function Currentsortorder({ cursort }) {
    if (cursort == 0) {
        return <span id='sortnow'>Upload Date</span>
    } else if (cursort == 1) {
        return <span id='sortnow'>Like</span>
    } else if (cursort == 2) {
        return <span id='sortnow'>Score</span>
    } else {
        return <span id='sortnow'>Started</span>
    }
}

/**
* create all content on this page
*
* @param  quitting - boolean value indicating if the user wish to quit this page
* @param  name - name of the visited user
* @param  search - the input in the search bar
* @param  searchres - terms being searched
* @param  user - a value showing whether the visiting user is a guest 
* @param  curpuz - the puzzle being focused on in the detail penal
* @param  curcontent - current puzzle catagory
* @param  alldisplaypage - the number of all puzzle the visited user have compelted or created (depends on which one the visiting user wish to view)
* @param  curpage - the page of puzzles the visiting user is viewing, each page have 20 puzzles
* @param  cursort - current puzzle sorting order
* @param  noreturnline - a string telling the user no puzzle can be displayed
* @param  alldisplay - a list of puzzle to display on the visited user's gallery
* @param  sortorderas - whether the puzzles are sorted in ascending or descending order
* @param  allcreate - name of all the puzzles visiting user has created
* @param  allcomp - name of all the puzzles visiting user has completed
* @param  profpic - visited user's profile picture
* @param  compnum - the number of puzzle visited user's completed
* @param  createnum - the number of puzzle visited user's created
* @param  score - the visited user's score
* @param  nopuz - a boolean value showing whether the alldisplaypage is 0
* @param  alllike - name of all the puzzles visiting user has liked
*
* @return the content on this web page
*/
function Gallery({navigate,name,quitting,setquitting,loading, setnopuz,setalldisplaypage, setalldisplay,search, searchres, setsearchres, setsearch, user, curpuz, setcurpuz, curcontent, setcontent, alldisplaypage, setcurpage, curpage, cursort, setsort, noreturnline, setnoreturnline, alldisplay, sortorderas, setsortorderas, allcreate, allcomp, profpic, createnum,compnum, score, nopuz, alllike, setalllike}){
    const [message, setmessage] = useState('')
    const [open, setopen] = useState(false)
    const [where, setwhere] = useState("")
    
    //close the pop up alarm
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setopen(false)
    }

    // create the close button on the pop up alarm
    const action = (
        <React.Fragment>
            <button
                id="popbut"
                aria-label="close"
                onClick={handleClose}
            >
                <Close id="popic" />
            </button>
        </React.Fragment>
    );

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

    //find the font size to use to display visited user's name
    var fontsize = ''
    if (name.length / 10 < 1) {
        fontsize = '8px'
    } else {
        fontsize = '6px'
    }

    //simplify the display value for the number of puzzle completed of the visited user so it dose not take up too much space
    var puzcompleted = '0';
    if (compnum > 1000) {
        puzcompleted = Math.round(compnum / 1000).toString().concat('k')
    } else if (compnum > 1000000) {
        puzcompleted = Math.round(compnum / 1000000).toString().concat('m')
    } else if (compnum > 1000000000) {
        puzcompleted = Math.round(compnum / 1000000000).toString().concat('b')
    } else {
        puzcompleted = compnum.toString()
    }

    //simplify the display value for the number of puzzle created of the visited user so it dose not take up too much space
    var puzcreated = '0';
    if (createnum > 1000) {
        puzcreated = Math.round(createnum / 1000).toString().concat('k')
    } else if (createnum > 1000000) {
        puzcreated = Math.round(createnum / 1000000).toString().concat('m')
    } else if (createnum > 1000000000) {
        puzcreated = Math.round(createnum / 1000000000).toString().concat('b')
    } else {
        puzcreated = createnum.toString()
    }

    //simplify the display value for the total score of the visited user so it dose not take up too much space
    var puzscore = '0';
    if (score > 1000) {
        puzscore = Math.round(score / 1000).toString().concat('k')
    } else if (score > 1000000) {
        puzscore = Math.round(score / 1000000).toString().concat('m')
    } else if (score > 1000000000) {
        puzscore = Math.round(score / 1000000000).toString().concat('b')
    } else {
        puzscore = score.toString()
    }

    //create the list of all possible puzzle sorting order
    const sortlistdisplay = ['Upload Date', 'Like', 'Score', 'Started'].map((data, index) => {
        if (index == 0) {
            if (index != cursort) {
                return <span key={'sort'.concat(index)} id='cataselectfirst' onClick={() => sortorder(sortorderas, index)} >{data}</span>
            } else {
                return <span key={'sort'.concat(index)} id='cataselectfirst' style={{ backgroundColor: '#7F7262', color: "bisque" }} >{data}</span>
            }
        } else if (index == 3) {
            if (index != cursort) {
                return <span key={'sort'.concat(index)} id='cataselectend' onClick={() => sortorder(sortorderas, index)} >{data}</span>
            } else {
                return <span key={'sort'.concat(index)} id='cataselectend' style={{ backgroundColor: '#7F7262', color: "bisque" }} >{data}</span>
            }
        } else {
            if (index != cursort) {
                return <span key={'sort'.concat(index)} onClick={() => sortorder(sortorderas, index)}>{data}</span>
            } else {
                return <span key={'sort'.concat(index)} style={{ backgroundColor: '#7F7262', color: "bisque" }}>{data}</span>
            }
        }
    })

    /**
    * change the puzzle sorting order and go back to the begining of the sorted puzzles list
    * 
    * @param  ordas - whether the sorting order is ascending
    * @param  order - the new puzzle sorting order
    */
    function sortorder(ordas, order) {
        setsort(order)

        //each sort ordering is assigned a unique code, (all ordering's ascending and descending variant have code unique to themselves)
        var searchord
        if (ordas) {
            searchord = order
        } else {
            searchord = order + 4
        }

        //unless the current display of visited user's gallery 
        //(the puzzles they completed or created, depending on which one the visiting user is viewing) 
        //have no puzzle, use the unique code to determine the corresponding newly sorted list of puzzles
        if (nopuz == false) {
            setcurpage(1)
            loading(true)
            fetch('http://127.0.0.1:8000/backend/visitnewcontent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    order: searchord,
                    page: 0,
                    search: searchres,
                    type: curcontent
                })
            }).then((Response) => Response.json()).then((data) => {
                setnopuz(false)
                setalldisplay(data[0])
                setalldisplaypage(data[1])
                document.getElementById("search").value = searchres
                document.getElementById("board").scrollTo(0, 0)
            })
        }
    }

    /**
    * change whether the sorted list is ascending or descending
    */
    function changesd() {
        if (sortorderas) {
            setsortorderas(false)
            sortorder(false, cursort)
            document.getElementById('asd').style.setProperty("display", 'none', 'important')
            document.getElementById('dsd').style.setProperty("display", 'inline-flex', 'important')
        } else {
            setsortorderas(true)
            sortorder(true, cursort)
            document.getElementById('dsd').style.setProperty("display", 'none', 'important')
            document.getElementById('asd').style.setProperty("display", 'inline-flex', 'important')
        }
    }

    /**
    * limit the puzzle shown to be only the ones containing the search content
    * 
    * @param  scontent - the search content, or what is being searched
    */
    function searchbyname(scontent) {

        //convert scontent in to a string format
        if (typeof scontent != "string") {
            scontent = scontent.search
        }
        setsearchres(scontent)
        var searchord

        //get the current sort order
        if (sortorderas) {
            searchord = cursort
        } else {
            searchord = cursort + 4
        }
        setcurpage(1)
        loading(true)

        //use the search content and current sort order to generate a new list of puzzle and go to the begining of the new sorted puzzles list
        fetch('http://127.0.0.1:8000/backend/visitnewcontent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                order: searchord,
                page: 0,
                search: scontent,
                type: curcontent
            })
        }).then((Response) => Response.json()).then((data) => {
            if (data[1] == 'none') {
                setnopuz(true)
                loading(false)
                setnoreturnline('No result for this search')
            } else {
                setnopuz(false)
                setalldisplay(data[0])
                setalldisplaypage(data[1])
            }
            document.getElementById("board").scrollTo(0, 0)
        })
    }

    /**
    * handle changes in search bar text field
    * 
    * @param e - the text change event 
    */
    function handlesearchchange(e) {
        const news = { search }
        news[e.target.id] = e.target.value
        setsearch(news)
    }

    /**
    * change the puzzle catagory (the teo catagories are: visited user's completed puzzles or created puzzles)
    * 
    * @param  newcata - the catagory user wish to view
    */
    function changecata(newcata) {
        setcontent(newcata)
        setsearch('')
        setsearchres('')
        setsort(0)
        setcurpage(1)
        var searchord

        //get the current sort order
        if (sortorderas) {
            searchord = cursort
        } else {
            searchord = cursort + 4
        }
        loading(true)

        //use the new catagory and current sort order to generate a new list of puzzle and go to the begining of the new sorted puzzles list
        fetch('http://127.0.0.1:8000/backend/visitnewcontent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                order: searchord,
                page: 0,
                search: '',
                type: newcata
            })
        }).then((Response) => Response.json()).then((data) => {

            if (document.getElementById('asd').style.display == "none") {
                setsortorderas(true)
                document.getElementById('dsd').style.setProperty("display", 'none', 'important')
                document.getElementById('asd').style.setProperty("display", 'inline-flex', 'important')
            }

            //if visited user have not created or completed a puzzle, output a message on screen
            if (data[1] == 'none') {
                if (newcata == 0) {
                    setnopuz(true)
                    loading(false)
                    setnoreturnline('This user have not completed any puzzle')
                } else {
                    setnopuz(true)
                    loading(false)
                    setnoreturnline('This user have not created any puzzle')
                }

            // if visited use do have completed or created puzzles, retrieve them. 
            } else {
                setnopuz(false)
                setalldisplay(data[0])
                setalldisplaypage(data[1])
            }
            document.getElementById("search").value = ''
            document.getElementById("board").scrollTo(0, 0)
        })
    }

    return(
        <div id="visiting">
            <div id="dash">

                {/* a header penal that shows informations and stats of the visited user */}
                <div className="rankingelement" style={{ borderWidth: '0px' }}>
                    <span className="rankingimgspace"><img src={profpic} className="rankingimg" /></span>
                    <span className="nameinranking" style={{ fontSize: fontsize }}><p>{name}</p></span>
                    <div id="displayscore">
                        <div>
                            <span className="spaninfo">Puzzles Completed: </span>
                            <span className="spandata">{puzcompleted}</span>
                        </div>
                        <div>
                            <span className="spaninfo">Puzzles Created: </span>
                            <span className="spandata">{puzcreated}</span>
                        </div>
                        <div>
                            <span className="spaninfo">Score Earned: </span>
                            <span className="spandata">{puzscore}</span>
                        </div>
                    </div>

                    {/* button that enables the visiting user to leave */}
                    <button className="savebutton" onClick={() => {
                        setquitting(true)
                        setwhere("dash")
                    }}>Go Back</button>
                </div>

                {/* the penal that enables the visiting user to access and manipulate (chnageing catagory, changing sort order, changing search term) puzzles the visited user have completed or created */}
                <div id='boardheader'>
                    <span id="catagory">
                        <div className="dashbutrow">
                            {curcontent == 0 ? (
                                <span style={{ backgroundColor: '#2A2622' }}>Puzzles Completed</span>
                            ) : (
                                <span onClick={() => changecata(0)}>Puzzles Completed</span>
                            )}
                            {curcontent == 1 ? (
                                <span style={{ backgroundColor: '#2A2622' }}>Puzzles Created</span>
                            ) : (
                                <span onClick={() => changecata(1)}>Puzzles Created</span>
                            )}
                        </div>
                    </span>
                    <span id="sort">
                        <span id='sortcell'>
                            <div id='top'>sort by: </div>
                            <div id='outter'>
                                <div id='bottom' onMouseLeave={() => { document.getElementById('listcontent').style.bottom = '0%' }} onMouseOver={() => { document.getElementById('listcontent').style.bottom = (-72 * 4).toString().concat('%') }}>
                                    <Currentsortorder cursort={cursort} />
                                    <div className='innercontent' id='listcontent'>
                                        {sortlistdisplay}
                                    </div>
                                </div>
                                <span id='orderbutt'>
                                    <KeyboardDoubleArrowUp id='asd' onClick={() => changesd()} className="lineIcon" />
                                    <KeyboardDoubleArrowDown id='dsd' onClick={() => changesd()} className="lineIcon" />
                                </span>
                            </div>
                        </span>
                    </span>
                    <div id='searchbar'>
                        <span><TextField onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                searchbyname(search)
                            }
                        }}
                            onChange={(e) => handlesearchchange(e)} id='search' defaultValue={search} className="lineInput" placeholder="Search" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { marginTop: '0px', paddingLeft: '5px', fontSize: 29 } }} /></span>
                        <span><Search onClick={() => searchbyname(search)} className="lineButton" /></span>
                    </div>
                </div>

                {/* loading screen */}
                <div id='loading' style={{ display: "none" }}><span>loading</span></div>

                {/* a list of different puzzles visited user have published or completed (depends on which one the user wish to see) */}
                <div id='board'>
                    <Displayimg setalllike={setalllike} loading={loading} vusername={name} alldisplay={alldisplay} alldisplaypage={alldisplaypage} setalldisplay={setalldisplay} setalldisplaypage={setalldisplaypage} sortorderas={sortorderas} noreturnline={noreturnline} nopuz={nopuz} setsearch={setsearch} setcurpage={setcurpage} curpage={curpage} searchres={searchres} setcurpuz={setcurpuz} curcontent={curcontent} cursort={cursort} />
                </div>
            </div>

            {/* details about individual puzzles */}
            <div id="detail">
                <Detaildisplay navigate={navigate} where={where} setwhere={setwhere} quitting={quitting} setquitting={setquitting} messagepop={messagepop} user={user} vusername={name} setalllike={setalllike} alllike={alllike} allcreate={allcreate} allcomp={allcomp} curpuz={curpuz} />
            </div>
            <div>

                {/* pop up, used to display warning messages */}
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
            </div>

            {/* animate page navigation */}
            <div id="transitionin"></div>
            <div id="transitionout"></div>
        </div>
    )
}

/**
* create a detailed description panel about a specific puzzle
*
* @param  where - the page to leave to when a visiting user wants to leave this page
* @param  quitting - boolean value indicating if the visiting user wish to quit this page
* @param  user - a value showing whether the visiting user is a guest 
* @param  vusername - name of the visited user
* @param  alllike - name of all the puzzles visiting user has liked
* @param  allcreate - name of all the puzzles visiting user has created
* @param  allcomp - name of all the puzzles visiting user has completed
* @param  curpuz - the puzzle being focused on in the detail penal
*
* @return a detailed description panel about a specific puzzle
*/
function Detaildisplay({ navigate, where, setwhere, quitting, setquitting, messagepop, user, vusername, setalllike, alllike, allcreate, allcomp, curpuz }) {
    
    //handle quitting the page
    if (quitting) {
        if (where == "dash") {
            document.getElementById('transitionout').classList.add('outswipe')
            setTimeout(() => {
                navigate("/paint/dash/")
            }, 500)

        } else if (where == "puzzle") {
            document.getElementById('transitionout').classList.add('outswipe')
            setTimeout(() => {
                navigate("/paint/solve/".concat(curpuz[5]), { state: curpuz[5] })
            }, 500);

        } else if (where == "visit") {
            document.getElementById('transitionout').classList.add('outswipe')
            setTimeout(() => {
                navigate("/paint/visit/".concat(curpuz[7]), { state: curpuz[7] })
                navigate(0)
            }, 500);
        }
    }

    /**
    * handle quitting the detail penal and return to the list of puzzles
    */
    function goback() {
        window.history.replaceState(null, "New Page Title", "/paint/visit/".concat(vusername))
        document.querySelector('#detail').style.display = "none";
        document.querySelector('.puzzlepen').style.display = "none";
        document.querySelector('#dash').style.filter = "blur(0px)";
    }

    /**
    *like or unlike a puzzle
    * 
    * @param  puztit - title of the puzzle
    */
    function like(puztit) {

        //guest can not like a puzzle, send user a error message if they are trying to like as a guest
        if (user == "guest") {
            messagepop('Login to Like')
        } else {
            fetch('http://127.0.0.1:8000/backend/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: puztit,
                })
            }).then((Response) => Response.json()).then((data) => {
                var nolike=[[],0]
                if(data[0]!=null){
                    setalllike(data[0])
                }else{
                    setalllike(nolike)
                }

                //determine how many like the puzzle have
                var likecount = "0"
                if(data[0]!=null){
                    if (data[1] > 1000000000) {
                        likecount = Math.round(data[1] / 1000000000).toString().concat('b')
                    } else if (data[1] > 1000000) {
                        likecount = Math.round(data[1] / 1000000).toString().concat('m')
                    } else if (data[1] > 1000) {
                        likecount = Math.round(data[1] / 1000).toString().concat('k')
                    } else {
                        likecount = data[1].toString()
                    }
                }
                
                document.getElementsByClassName('likecounter')[0].textContent = likecount;
            })
        }
    }

    //check if the current puzzle in focus in liked by user
    var isliked = false
    for (var i = 0; i < alllike.length; i++) {
        if (alllike[i] == curpuz[5]) {
            isliked = true
        }
    }

    //check if the current puzzle in focus in completed by user
    var iscomp = false
    for (var i = 0; i < allcomp.length; i++) {
        if (allcomp[i] == curpuz[5]) {
            iscomp = true
        }
    }

    //check if the current puzzle in focus in created by user
    var iscreate = false
    for (var i = 0; i < allcreate.length; i++) {
        if (allcreate[i] == curpuz[5]) {
            iscreate = true
        }
    }

    if (curpuz != null && curpuz.length != 0) {

        //find the font size to use to display puzzle title
        var fontsize = ''
        if (curpuz[5].length / 15 < 1) {
            fontsize = '38px'
        } else if (curpuz[5].length / 15 < 2) {
            fontsize = '27px'
        } else if (curpuz[5].length / 15 < 3) {
            fontsize = '25px'
        } else {
            fontsize = '23px'
        }
    
        //simplify the display value for the score of the puzzle so it dose not take up too much space
        var scorecount = curpuz[2].toString()
        if (curpuz[2] > 1000000000) {
            scorecount = Math.round(curpuz[2] / 1000000000).toString().concat('b')
        } else if (curpuz[2] > 1000000) {
            scorecount = Math.round(curpuz[2] / 1000000).toString().concat('m')
        } else if (curpuz[2] > 1000) {
            scorecount = Math.round(curpuz[2] / 1000).toString().concat('k')
        }

        //simplify the display value for the started count of the puzzle so it dose not take up too much space
        var startcount = curpuz[4].toString()
        if (curpuz[4] > 1000000000) {
            startcount = Math.round(curpuz[4] / 1000000000).toString().concat('b')
        } else if (curpuz[4] > 1000000) {
            startcount = Math.round(curpuz[4] / 1000000).toString().concat('m')
        } else if (curpuz[4] > 1000) {
            startcount = Math.round(curpuz[4] / 1000).toString().concat('k')
        }

        //find the height and width of the puzzle to optimize how the puzzle is displayed
        var height = 0
        for (var i = 0; i < curpuz[9].length; i++) {
            if (curpuz[9][i] == '|') {
                height = height + 1;
            }
        }
        var width = curpuz[9].indexOf('|') / 8
        var time = curpuz[1].slice(0, 10)

        //if the puzzle is taller, display a img of the puzzle on the left of the penal
        if (width <= height) {
            
            //create the detail penal
            return (
                <div id="puzzlepenleft" className="puzzlepen" >

                    {/* img of the puzzle */}
                    <span id="imageleft">
                        <img src={curpuz[0]} id="heightresizable" />
                    </span>

                    {/* details about puzzles (title, author, likes, publish date, scores, and how many people have started, description) */}
                    <span id="contentright">
                        <div className="title">
                            <p className='titletext' style={{ fontSize: fontsize }}>{curpuz[5]}</p>
                        </div>
                        <div className="nottitle">
                            {iscreate
                                ?
                                <span className="author">
                                    <span><img src={curpuz[8]} /></span>
                                    <p>{curpuz[7]}</p>
                                </span>
                                :
                                <span className="author" onClick={() => {
                                    setwhere("visit")
                                    setquitting(true)
                                }}>
                                    <span><img src={curpuz[8]} /></span>
                                    <p>{curpuz[7]}</p>
                                </span>
                            }
                            <span className="like" onClick={() => like(curpuz[5])}>
                                {isliked
                                    ? <span><ThumbUp style={{ color: '#3D8C40' }} className="likeicon" /></span>
                                    : <span><ThumbUp className="likeicon" /></span>
                                }
                                <span className="likecounter"></span>
                            </span>
                            <span className='titledate'>
                                <p>published:</p>
                                <p>{time}</p>
                            </span>
                            <span className="stat">
                                <span className="score">
                                    <span>score: </span>
                                    <span>{scorecount}</span>
                                </span>
                                <span className="started">
                                    <span>started: </span>
                                    <span>{startcount}</span>
                                </span>
                            </span>
                            <div className="puzzledes">{curpuz[6]}</div>
                            <div className="buttons">
                                {iscreate ? <button className="detailbutton">CREATED</button>
                                    : iscomp ? <button className="detailbutton">SOLVED</button>
                                        : <button className="detailbutton" onClick={() => {
                                            setwhere("puzzle")
                                            setquitting(true)
                                        }}>START</button>
                                }
                                <button className="detailbutton" onClick={() => goback()}>QUIT</button>
                            </div>
                        </div>
                    </span>
                </div>
            )
        //if the puzzle is wider, display a img of the puzzle on top of the penal
        } else {
            return (
                <div id="puzzlepentop" className="puzzlepen" >

                    {/* img of the puzzle */}
                    <span id="imagetop">
                        <img src={curpuz[0]} id="widthresizable" />
                    </span>

                    {/* details about puzzles (title, author, likes, publish date, scores, and how many people have started, description) */}
                    <span id="contentbottom">
                        <div className="title">
                            <p className='titletext' style={{ fontSize: fontsize }}>{curpuz[5]}</p>
                        </div>
                        <div className="nottitle">
                            {iscreate
                                ?
                                <span className="author">
                                    <span><img src={curpuz[8]} /></span>
                                    <p>{curpuz[7]}</p>
                                </span>
                                :
                                <span className="author" onClick={() => {
                                    setwhere("visit")
                                    setquitting(true)
                                }}>
                                    <span><img src={curpuz[8]} /></span>
                                    <p>{curpuz[7]}</p>
                                </span>
                            }
                            <span className="like" onClick={() => like(curpuz[5])}>
                                {isliked
                                    ? <span><ThumbUp style={{ color: '#3D8C40' }} className="likeicon" /></span>
                                    : <span><ThumbUp className="likeicon" /></span>
                                }
                                <span className="likecounter"></span>
                            </span>
                            <span className='titledate'>
                                <p>published:</p>
                                <p>{time}</p>
                            </span>
                            <span className="stat">
                                <span className="score">
                                    <span>score: </span>
                                    <span>{scorecount}</span>
                                </span>
                                <span className="started">
                                    <span>started: </span>
                                    <span>{startcount}</span>
                                </span>
                            </span>
                            <div className="puzzledes">{curpuz[6]}</div>
                            <div className="buttons">
                                {iscreate ? <button className="detailbutton">CREATED</button>
                                    : iscomp ? <button className="detailbutton">SOLVED</button>
                                        : <button className="detailbutton" onClick={() => {
                                            setwhere("puzzle")
                                            setquitting(true)
                                        }}>START</button>
                                }
                                <button className="detailbutton" onClick={() => goback()}>QUIT</button>
                            </div>
                        </div>
                    </span>
                </div>
            )
        }
    } else {
        return
    }
}

/**
* create a puzzle gallery with a page nav bar
*
* @param  vusername - name of the visited user
* @param  alldisplay - a list of puzzle to display on the visited user's gallery
* @param  alldisplaypage - the number of all puzzle the visited user have compelted or created (depends on which one the visiting user wish to view)
* @param  sortorderas - whether the puzzles are sorted in ascending or descending order
* @param  noreturnline - a string telling the user no puzzle can be displayed
* @param  nopuz - a boolean value showing whether the alldisplaypage is 0
* @param  curpage - the page of puzzles the visiting user is viewing, each page have 20 puzzles
* @param  searchres - the term in the puzzle titles that is being search for
* @param  curcontent - current puzzle catagory
* @param  cursort - current puzzle sorting order
*
* @return a puzzle gallery with a page nav bar
*/
function Displayimg({ setalllike, loading, vusername, alldisplay, alldisplaypage, setalldisplay, setalldisplaypage, sortorderas, noreturnline, nopuz, setsearch, setcurpage, curpage, searchres, curcontent, cursort, setcurpuz }) {
    var shelf = [];
    var puzres = [];
    var i = 0;
    var pn

    //the list of puzzles puzzles are divided into pages for faster loading, if there are puzzles to be shown, create the list of puzzle and page navigation
    if (nopuz == false) {

        pn = Math.ceil(alldisplaypage / 20)
        for (i = 0; i < alldisplay.length; i++) {
            puzres.push(alldisplay[i])
        }
        for (var i = 0; i <= puzres.length - 4; i = i + 4) {
            shelf.push(puzres.slice(i, i + 4))
        }
        if (puzres.length % 4 != 0) {
            shelf.push(puzres.slice(i, puzres.length))
        }
        var pnlist = []
        for (var i = 0; i < pn; i++) {
            pnlist.push(i + 1)
        }

        /**
        * open up the detail penal
        *
        * @param  newdata - the puzzle to be shown in the detail penal
        */
        function showdetail(newdata) {
            fetch("/backend/getdetail" + "?curpuz=" + newdata[1] + 2).then((Response) => Response.json()).then((data) => {
                setcurpuz(data)
                fetch("/backend/getalllike").then((Response) => Response.json()).then((likedata) => {
                    setalllike(likedata)
                })
                return data
            }).then((data)=>{
                console.log(data)
                //determine how many like the puzzle have
                var likecount = "0"
                if(data!=null){
                    if (data[3] > 1000000000) {
                        likecount = Math.round(data[3] / 1000000000).toString().concat('b')
                    } else if (data[3] > 1000000) {
                        likecount = Math.round(data[3] / 1000000).toString().concat('m')
                    } else if (data[3] > 1000) {
                        likecount = Math.round(data[3] / 1000).toString().concat('k')
                    } else {
                        likecount = data[3].toString()
                    }
                }
                
                document.getElementsByClassName('likecounter')[0].textContent = likecount;

                window.history.replaceState(null, "New Page Title", "/paint/visit/".concat(vusername).concat("/").concat(newdata[1]))
                document.querySelector('#detail').style.display = "grid";
                document.querySelector('.puzzlepen').style.display = "block";
                document.querySelector('#dash').style.filter = "blur(10px)";
            })
        }

        /**
        * change in to another page of puzzles
        *
        * @param  newpage - the page number
        */
        function changepage(newpage) {

            //getting the sort order and page number
            setcurpage(newpage)
            var searchord
            if (sortorderas) {
                searchord = cursort
            } else {
                searchord = cursort + 4
            }
            loading(true)

            //getting the puzzles in the new page with the sort order and page number
            fetch('http://127.0.0.1:8000/backend/visitnewcontent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: vusername,
                    order: searchord,
                    page: newpage - 1,
                    search: searchres,
                    type: curcontent
                })
            }).then((Response) => Response.json()).then((data) => {
                setalldisplay(data[0])
                setalldisplaypage(data[1])
                setsearch(searchres)
                document.getElementById("search").value = searchres
                document.getElementById("board").scrollTo(0, 0)
            })
        }

        //create the page navigation bar
        var pages;
        if (pn == 1) {
            pages = pnlist.map((data, index) => {
                return (<span className={`pagebutton total${pn}`} key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622' }}><p>{data}</p></span>)
            })
        } else if (pn <= 13) {
            pages = pnlist.map((data, index) => {
                if (curpage == data) {
                    if (data == 1) {
                        return (<span className="pagebutton" key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622' }}><p>{data}</p></span>)
                    } else {
                        return (<span className={`pagebutton total${pn}`} key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622', marginLeft: ((13 - pn) * ((window.innerWidth - 200) * 0.9 / 13 + 1 / 3) / (pn - 1) + (4 + 1 / 3)).toString().concat('px') }}><p>{data}</p></span>)
                    }
                } else if (data == 1) {
                    return (<span className="pagebutton" key={index.toString().concat("page")} onClick={() => changepage(data)}><p>{data}</p></span>)
                } else {
                    return (<span className={`pagebutton total${pn}`} key={index.toString().concat("page")} style={{ marginLeft: ((13 - pn) * ((window.innerWidth - 200) * 0.9 / 13 + 1 / 3) / (pn - 1) + (4 + 1 / 3)).toString().concat('px') }} onClick={() => changepage(data)}><p>{data}</p></span>)
                }
            })
        } else {
            if (curpage < 8) {
                pages = pnlist.map((data, index) => {
                    if (data == 1) {
                        if (curpage == data) {
                            return (<span className="pagebutton" key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622' }}><p>{data}</p></span>)
                        } else if (data < 10 || data > pn - 3) {
                            return (<span className="pagebutton" key={index.toString().concat("page")} onClick={() => changepage(data)}><p>{data}</p></span>)
                        } else if (data == pn - 3) {
                            return (<span className="pagebutton" key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622' }}>...</span>)
                        }
                    } else {
                        if (curpage == data) {
                            return (<span className="pagebutton" key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622', marginLeft: (4 + 1 / 3).toString().concat('px') }}><p>{data}</p></span>)
                        } else if (data < 10 || data > pn - 3) {
                            return (<span className="pagebutton" key={index.toString().concat("page")} style={{ marginLeft: (4 + 1 / 3).toString().concat('px') }} onClick={() => changepage(data)}><p>{data}</p></span>)
                        } else if (data == pn - 3) {
                            return (<span className="pageunshown" key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622', marginLeft: (4 + 1 / 3).toString().concat('px') }}>...</span>)
                        }
                    }
                })
            } else if (curpage > pn - 7) {
                pages = pnlist.map((data, index) => {
                    if (data == 1) {
                        if (curpage == data) {
                            return (<span className="pagebutton" key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622' }}><p>{data}</p></span>)
                        } else if (data < 4 || data > pn - 9) {
                            return (<span className="pagebutton" key={index.toString().concat("page")} onClick={() => changepage(data)}><p>{data}</p></span>)
                        } else if (data == 4) {
                            return (<span className="pagebutton" key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622' }}>...</span>)
                        }
                    } else {
                        if (curpage == data) {
                            return (<span className="pagebutton" key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622', marginLeft: (4 + 1 / 3).toString().concat('px') }}><p>{data}</p></span>)
                        } else if (data < 4 || data > pn - 9) {
                            return (<span className="pagebutton" key={index.toString().concat("page")} style={{ marginLeft: (4 + 1 / 3).toString().concat('px') }} onClick={() => changepage(data)}><p>{data}</p></span>)
                        } else if (data == 4) {
                            return (<span className="pageunshown" key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622', marginLeft: (4 + 1 / 3).toString().concat('px') }}>...</span>)
                        }
                    }
                })
            } else {
                pages = pnlist.map((data, index) => {
                    if (data == 1) {
                        if (curpage == data) {
                            return (<span className="pagebutton" key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622' }}><p>{data}</p></span>)
                        } else if (data < 4 || data > pn - 3 || data < curpage + 3 && data > curpage - 3) {
                            return (<span className="pagebutton" onClick={() => changepage(data)} key={index.toString().concat("page")}><p>{data}</p></span>)
                        } else if (data == 4 || data == pn - 3) {
                            return (<span className="pagebutton" key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622' }}>...</span>)
                        }
                    } else {
                        if (curpage == data) {
                            return (<span className="pagebutton" key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622', marginLeft: (4 + 1 / 3).toString().concat('px') }}><p>{data}</p></span>)
                        } else if (data < 4 || data > pn - 3 || data < curpage + 3 && data > curpage - 3) {
                            return (<span className="pagebutton" onClick={() => changepage(data)} style={{ marginLeft: (4 + 1 / 3).toString().concat('px') }} key={index.toString().concat("page")}><p>{data}</p></span>)
                        } else if (data == 4 || data == pn - 3) {
                            return (<span className="pageunshown" key={index.toString().concat("page")} style={{ backgroundColor: '#2A2622', marginLeft: (4 + 1 / 3).toString().concat('px') }}>...</span>)
                        }
                    }
                })
            }
        }

        //format the puzzle list in to a gallery like display, make it looks like the puzzles are resting on a shelf
        const shelfdisplay = shelf.map((data, index) => {
            const imagedisplay = data.map((subdata, subindex) => {
                if (index == shelf.length - 1 && subindex == data.length - 1) {
                    loading(false)
                }
                var height = 0

                for (var i = 0; i < subdata[2].length; i++) {
                    if (subdata[2][i] == '|') {
                        height = height + 1;
                    }
                }

                var width = subdata[2].indexOf('|') / 8
                if (width * 1.5 >= height) {
                    return (
                        <div key={'id'.concat(subindex.toString())} className="shelfspace">
                            <img src={subdata[0]} onClick={() => showdetail(subdata)} className="widthresizable" />
                        </div>
                    )
                } else {
                    return (
                        <div key={'id'.concat(subindex.toString())} className="shelfspace">
                            <img src={subdata[0]} onClick={() => showdetail(subdata)} className="heightresizable" />
                        </div>
                    )
                }
            })

            //add the puzzle title on the shelf display
            const titleplay = data.map((subdata, subindex) => {
                var fontsize = ''
                if (subdata[1].length / 15 < 1) {
                    fontsize = '15px'
                } else if (subdata[1].length / 15 < 2) {
                    fontsize = '11px'
                } else if (subdata[1].length / 15 < 3) {
                    fontsize = '9px'
                } else {
                    fontsize = '8px'
                }
                return <span key={'tid'.concat(subindex.toString())} className='frametitle'><div className='spacetitle'><p className='shelftitle' style={{ fontSize: fontsize }}>{subdata[1]}</p></div></span>
            })

            //create the puzzle shelves
            return (
                <div key={'id'.concat(index.toString())}>
                    <div className="top3d">
                        <div className="singleshelf">
                            {imagedisplay}
                        </div>
                        <div className="surface"></div>
                    </div>
                    <div className="buttom3d">
                        <div className="innerbottom3d">
                            {titleplay}
                        </div>
                    </div>
                </div>
            )
        })

        //putting the page nav bar and the puzzle gallery shelves together 
        return (
            <div>
                {shelfdisplay}
                <div id="pagebar">
                    {pages}
                </div>
            </div>
        )
    } else {

        //display a message telling viewer no puzzle is availible if no puzzle is availibl
        return (
            <div>
                <p id="noreturn">{noreturnline}</p>
            </div>
        )
    }
}