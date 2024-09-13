import React from "react";
import { useState, useEffect } from "react";
import { TextField, Slide } from "@mui/material";
import { Add } from "@material-ui/icons";
import { Close } from "@material-ui/icons";
import { Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import { KeyboardDoubleArrowUp, KeyboardDoubleArrowDown, ThumbUp, Search } from "@mui/icons-material";
import { EditOutlined } from "@mui/icons-material";
import 'react-image-crop/dist/ReactCrop.css'

/**
* retrieve the dashboard page
* 
* @return the dashboard page
*/
export default function Dash() {
    window.history.replaceState(null, "New Page Title", "/paint/dash/")
    return <MainPanel />
}

/**
* create the dashboard page
* 
* @return the dashboard page
*/
function MainPanel() {
    const [name, setname] = useState('')
    const [message, setmessage] = useState('')
    const [profpic, setprofpic] = useState('')
    const [compnum, setcompnum] = useState(0)
    const [createnum, setcreatenum] = useState(0)
    const [score, setscore] = useState(0)
    const [nopuz, setnopuz] = useState(false)
    const [alllike, setalllike] = useState([])
    const [allcreate, setallcreate] = useState([])
    const [allcomp, setallcomp] = useState([])
    const [sortorderas, setsortorderas] = useState(true)
    const [display, setdisplay] = useState([])
    const [displaypage, setdisplaypage] = useState(0)
    const [sortlist, setsortlist] = useState(['Upload Date', 'Like', 'Started', 'Score'])
    const [noreturnline, setnoreturnline] = useState('null')
    const [cursort, setsort] = useState(0)
    const [curpage, setcurpage] = useState(1)
    const [curcontent, setcontent] = useState(0)
    const [user, setuser] = useState('guest')
    const [curpuz, setcurpuz] = useState([])
    const [search, setsearch] = useState('')
    const [searchres, setsearchres] = useState('')
    const [rankord, setrankord] = useState('Score')
    const [ranktype, setranktype] = useState('top')
    const [top, settop] = useState([])
    const [topover, settopover] = useState('noneover')
    const [userrank, setuserrank] = useState([])
    const [userover, setuserover] = useState('noneover')
    const [userid, setuserid] = useState('')

    /**
    * get the top 20 user to be displayed in the ranking section (top 20 by the number of puzzles created, completed, or by their total score)
    * 
    * @param ord - the way user is ranked (by the number of puzzles created, completed, or by their total score)
    */
    function getinitt(ord) {
        fetch('http://127.0.0.1:8000/backend/getinittop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rank: ord,
            })
        }).then((Response) => Response.json()).then((data) => {
            settopover(data.slice(data.length - 1, data.length).toString())
            settop(data.slice(0, data.length - 1))
        })
    }

    /**
    * get more user that is above the highest ranked users in the user ranking section
    */
    function moreup() {
        var topname = userrank[0][0]
        fetch('http://127.0.0.1:8000/backend/getmoreup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: topname,
                rank: rankord,
            })
        }).then((Response) => Response.json()).then((data) => {
            if (userover == "downdisplayed" && data.slice(data.length - 1, data.length).toString() == 'updisplayed') {
                setuserover("alldisplayed")
            } else if (userover == "downdisplayed" && data.slice(data.length - 1, data.length).toString() == 'nonedisplayed') {
                setuserover("downdisplayed")
            } else {
                setuserover(data.slice(data.length - 1, data.length).toString())
            }
            setuserrank(data.slice(0, data.length - 1).concat(userrank))
        })
    }

    /**
    * get more user that is below the lowest ranked users in the user ranking section
    */
    function moredown() {
        var botname
        if (ranktype == 'top') {
            botname = top[top.length - 1][0]
        } else {
            botname = userrank[top.length - 1][0]
        }
        fetch('http://127.0.0.1:8000/backend/getmoredown', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: botname,
                rank: rankord,
            })
        }).then((Response) => Response.json()).then((data) => {
            if (ranktype == 'top') {
                if (data.slice(data.length - 1, data.length).toString() == 'downdisplayed') {
                    settopover("alldisplayed")
                }
                settop(top.concat(data.slice(0, data.length - 1)))
            } else {
                if (userover == "updisplayed" && data.slice(data.length - 1, data.length).toString() == 'downdisplayed') {
                    setuserover("alldisplayed")
                } else if (userover == "updisplayed" && data.slice(data.length - 1, data.length).toString() == 'nonedisplayed') {
                    setuserover("updisplayed")
                } else {
                    setuserover(data.slice(data.length - 1, data.length).toString())
                }
                setuserrank(userrank.concat(data.slice(0, data.length - 1)))
            }
        })
    }

    /**
    * get the innitial 20 users displayed in the user ranking section, including the current user roughly in the middle of the ranking to show how highly ranked a user is
    * 
    * @param ord - the way user is ranked (by the number of puzzles created, completed, or by their total score)
    */
    function getinitu(ord) {
        fetch('http://127.0.0.1:8000/backend/getinituser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rank: ord,
            })
        }).then((Response) => Response.json()).then((data) => {
            setuserover(data.slice(data.length - 1, data.length).toString())
            setuserrank(data.slice(0, data.length - 1))
        })
    }

    return (
        <div>
            <Check setuserid={setuserid} setname={setname}  setdisplay={setdisplay} setdisplaypage={setdisplaypage} setallcomp={setallcomp} setallcreate={setallcreate} setalllike={setalllike} setnoreturnline={setnoreturnline} setnopuz={setnopuz} rankord={rankord} getinitt={getinitt} getinitu={getinitu} setcurpuz={setcurpuz} setcompnum={setcompnum} setprofpic={setprofpic} setcreatenum={setcreatenum} setscore={setscore} setuser={setuser} />
            <Userpage userid={userid} display={display} setdisplay={setdisplay} displaypage={displaypage} setdisplaypage={setdisplaypage} setalllike={setalllike} alllike={alllike} allcreate={allcreate} allcomp={allcomp} sortorderas={sortorderas} setsortorderas={setsortorderas} setsort={setsort} compnum={compnum} createnum={createnum} sortlist={sortlist} setsortlist={setsortlist} setnoreturnline={setnoreturnline} noreturnline={noreturnline} nopuz={nopuz} setnopuz={setnopuz} setcontent={setcontent} setcurpage={setcurpage} curpage={curpage} setprofpic={setprofpic} searchres={searchres} setsearchres={setsearchres} setsearch={setsearch} search={search} score={score} message={message} profpic={profpic} setcurpuz={setcurpuz} curpuz={curpuz} setname={setname} curcontent={curcontent} cursort={cursort} user={user} name={name} setmessage={setmessage} rankord={rankord} ranktype={ranktype} top={top} topover={topover} userover={userover} userrank={userrank} getinitt={getinitt} moreup={moreup} moredown={moredown} getinitu={getinitu} setranktype={setranktype} setrankord={setrankord} setuserrank={setuserrank} settop={settop} />
        </div>)
}

/**
* Check whether the user is a guest and get the relevent information needed in this page
* 
* @param rankord - the way user is ranked (by the number of puzzles created, completed, or by their total score)
*/
function Check({ setuserid,setdisplay, setdisplaypage, setallcomp, setallcreate, setalllike, setnopuz, rankord, getinitt, getinitu, setcurpuz, setcompnum, setprofpic, setcreatenum, setscore, setname, setuser, setnoreturnline }) {
    useEffect(() => {
        
        //check whether the user is a guest by checking the current cookie on the browser
        fetch('http://127.0.0.1:8000/backend/checkcookie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            })
        }).then((Response) => Response.json()).then((data) => {

            //if there is no cookie (the user have not logged in), create a new guest and 
            if (data[1] == 'none') {
                fetch('http://127.0.0.1:8000/backend/addguest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                    })
                }).then((Response) => Response.json()).then((data) => {

                    //add a guest and a guest cookie if user has just loged out or if thhis is the first time user used this site
                    fetch('http://127.0.0.1:8000/backend/addguestcookie', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            identity: parseInt(data),
                        })
                    }).then((Response) => Response.json()).then((data) => {

                        //get information about the newly created guest
                        fetch('http://127.0.0.1:8000/backend/getcookieguest', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                identity: data
                            })
                        }).then((Response) => Response.json()).then((data) => {

                            setname(data[0])
                            setcreatenum(0)
                            setprofpic("data:image/webp;base64,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")
                            setcompnum(data[1])
                            setscore(data[2])
                            setallcomp(data[4])
                            setuser('guest')
                            if (data[3][0] == 'none') {
                                setnopuz(true)
                                setnoreturnline('You have completed all the puzzles')
                                
                                //placeholder
                                setcurpuz([null, '2024-06-09T21:07:36.649215Z', 35, 0, 1, '2', '2', 'kkk', null, '#333333!#333333!#333333!#333333!#333333!#333333!#3…#887766!#FFFFFF!#333333!#FFFFFF!#887766!#FFFFFF!|'])
                            } else {
                                setdisplay(data[3][0])
                                setdisplaypage(data[3][1])
                                fetch("/backend/getdetail" + "?curpuz=" + data[3][0][0][1] + 2).then((Response) => Response.json()).then((data) => {
                                    setcurpuz(data)
                                })
                            }
                            getinitt(rankord)
                        })
                    })
                })
            } else {

                //if the user is a guest, get information about the guest
                if (data[1] == 'guest') {
                    fetch('http://127.0.0.1:8000/backend/getcookieguest', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            identity: data[0]
                        })
                    }).then((Response) => Response.json()).then((data) => {

                        setname(data[0])
                        setprofpic("data:image/webp;base64,UklGRoAkAABXRUJQVlA4THQkAAAvz8KzAFXp+f9/tRzJef6PpatKdKWGqu5Rz/S21NPV3aORGmfU1dOtq1JLdXseBEPrnP//GKqDpQr+9/VyhT5m7NRwk4XrJ6AnUI/gmpmZ6Yaq4BdoQjOkNB0an4WCG8jsMijodB6B4fgBVJu9oNR0zF7oVKkxpPoFld5gGeIOhxSYbSUzswqOwuXdSkwKTdfsa8ZKFnqhDGkFZbZlVrIYmu0T3OW9CkwV/AMlZm4FShdMN6jUVMGCNpAZdczVQYeSoYIKZEadoJIFpTIo6NTMuFBmS69X/8yMYXdouoaFk0y40BOYyozHbKfMlqGCWVBwkzJ7UtMy72PogGHbtpHu9l+4lp8gaNs2S9Lzh/z+T8D0Ue3/av9X+7/a/9X+r/Z/tf+r/V/t/2r/V/u/2v/V/q/2f7X/q/1f7f9q/1f7v9r/1f6v9n+1/6v9X+3/F9d6epg2rukmTZe8RiEqjxnj5NF18jFzeDOPWXezji1tnjdz19U147CEmLbkNWqmLpEyWIXVNWtUfYRG6DhlpGft6qaXk+aJ82qzYhxfrlqPm8fW7VftTS3H16v1TuydVOT0Y2avapyyf8ounTc8a/qHkFJqmy6RUlieEQ/dDQ/e1XHnlFAeJ8TL2/3dfjTOBeRIGkElrIT8mmIqZruKeTW+H4uNYmPl3q6UDnAH2Ynx8Hh03ThtnjyrdplaY5EQUmqSpGyyvHzamNF7uCnzkHhgKpUBNZL96+JXsfL9mDlajaYAXcfuKDJHKN8vYp1+LnH+FdJh8dhwV15oFzc8ESxSU7RJCquttnlw45Xr2WW21ddLXr7pBgjG0TUGElxXx4F9jeC6I1WJcopo2d54oC2PR+du0h+v+vBEcEhtkOwTXj49OLUMjKexytezpgu2bcP161hn22MJcn4Rrze2jz0omxJv0h83LCG1PpKsNaGPaMV5eB2PUNPpu2DbK+AG0LYXg+nrsX3YwXhkC5b0ek/ITZodIMuIn7ybu20/FSvSatwA2TbcQNsIZrYz93CT4k2MuCekJkeKmR/pjmPqQTHsZE0YhzacKtro1hS/RrjzyusJw1g/4yM4pcamb3rPy0Q3rgz3Zl2w4dTURjCLlV/mlspawyINTbAII791YF+voXf0ayzaATr1DTgbupOj8Iz7rTxPufOCg7QxZOWH164zdRNa4NQ6jGM0v4g2X7HbWnXM/BLBon2hOwyNGbuzljj+GIYBOnUPo6ubl09zq/arPgZJ20JefOu2Vt0EhNkgjiG/RJbi5FqXGSTNShN5mRN7B0dTdzHgYDaJYHbujVcOJ/fSVnBoU8jr2fGsy7IFhNnpQhyF+ljviDiYeb+kPaGZ/fG7u4KN+QWE2S4u3bN5YLC2cpC2hAYXBHsTbMy/M4TZMrpFKjw5RA1B2hFK5C9dndtVQJht45zkkmNL2iOtCJ053NriuAizdTQ7H+74GbdIC0JWZON5nSN5CLP7gIMRyp9oK4+h6UeT5mP6Lj840frdCEoQC52bj1xpLzi0HdSfPjqEnQKCQsT21Hg8cZdOkIaDes4dn1LtCAoS/WWHm2gbaTWoK92a80FhYmEvVupO7MUTTZoMGmpal5qDSgMAR7ARblJMe6S9IKvnmBJQDQhKFAt78Q7wZOiOtBbU1j/Bp7cjKFT0c0fGngRpKih+k308HUG54pzUhBT1SDvRlMgcVc35CIp2LKTK8Nwh0kqQN3yI6Z2DoHDRH+W9aCShjaCqESxlLokBUr7Y7pTH0OggDQSlN7b6CIq48GBn9HukeUhcff/IGWtHUMjoLOkzSOOQWD/gFAIOFDOWuNad6eDQMlBXVbmoswBKGkep2P1GKoN2gRbVnZ9CUNZYcI4ImYRWgYZn9JY0ICjuAP7OcgydCW0CzRpyb89HUOCoT2jphBaBjBPnV4ghKHJ8sDsAo0N7QEMVZYyaj6DQ0TnQDXft1hjQ0M5R2I6g2FE/IEW7tAVk+Ll2BAWPzguu6WjSENC8E84xYhmCosfOM4yEdoC2bB3t142g8LHzHCOhFaDotALdCIof95yeTmgDyGtqiSGoQCx+TbA9CU1A1x0uqUFQhbhndYQ0AAljPBZrCCpxc+fkespB3C9x44uSCKpxDGWPraEdcT5aUB51BPWIY16mP4+4HsUnx9RmUJPYHlB9/cTxyJhaS6gA6hL9Ujdz1vE78ijg2lFlABaxi3qCg9slZs0y5yOoTvydSyPE6f5ZzwYdQYUW/Ll54nIUGleOKQQ1GnDtoz3pBQeHoy0fNVYAdYp+masaCQ5XV7e8G1UKYPGr3EaIu1HPRTqCai00HDcM4mwUPyqXQlCv2L5w+tHF18jbmsuBmsXshwmNf8bVEmvK7AOhqgHsnGTjxNEocrhNIqjcwki8M4+fkXfCiBVA7aK/vzcUXNwsMesscw+EqgcwOSmXIU5GkcNTEkEFF8ytHh8j73OP1AqghtE/wIb2E1wsYexva1AVAXY+TmgQB6Pa39+JoJLnFKiDg80YGwJuDqhlbDiYFgQH96LI/emomqDgbzSIc9HMj4oyQiuAesbuMmckONc/Gzq/hFBFAe6ZXGuJa9HQUb5eBFU9ByqLxbWsunHuGUFdo37FGCGORfHTkqiyoJA79+SziV9Z08+AckFtY8MEmyFuRaFRHjtRdUEhtsPjVjNLsJcrgPpG//IxtCNORfHBelRh0OofH9qCk095V7veegHUONaMh2bBpSmysgFVGQScP3XOCxYeZUHODZA6R/+c2uDgUBQpRwdVGrTGdnhN/MmafrS6oNax96I4cSfKDBS/ULXBaGZu9biTdWmLC+od61emiTPJ/OTaiSoO3KfdYHEmYZRZU9Vhcmk+WLgS3HJq8QOk7s0ls4bgypQ5yPNR3aGztmq/jydZMueCyvMv79Y3caRp5ym9gSSqPCiYt/E40ozQv3ykA7WPejnGg4UbSePBHFR9YC7vF9yY4hf5DACctYbkRdZTBpQL6n8c+RfFiRNJ46jaiQwA3NYnsDhR8AztXtC3WQAW0VHRkHzIO6n3nC6wwHAJ70mad3Mhmb+Rg0wAAq/nnFYsLiTm/YIvM06wAdQnR0PyIOukYY5OwAZt/8M0EweS+d+vIyMA96GaLA4kag90vs0KMHt0HZL8xxKNLrDCsH9BhriPNO43hcwA3M2XWtyH4gdZ32YH4KyddUjeI7y9afQL2KFdf8Wa5j5eRXn9wBDHWrPMGYLzyvykmGxhCDCal+ur4zxUeyCVkM0SsHexIfmOddlmF1iinR2M8B05q0wNxQ7YorkfzBqC79QeHnSbLcBIdptFXKep+UD0GQOm7teQPMeqS7jAFu3soRgaPGfTzHHCEQPWEPsFaeI4cuhjdYYZA7hfofKweE76EJu1WQP4x09vE79pqrp7lBFuBWuw9bPWS35jbWh1gTlkD05xfrPJO/70gT2apWQIbiuNKbN+BXtwv8KgxW8y5bFY2uwBYifMfm4jhp7UZxBjKbXKkNxmy1s0gT3azpW4Wm5jNd2TyyIanjXCa2TbR/WBQf5ds8zdUvAa4+heymYQ4I7xLrN4zdAR1mES8JyFGQevidxflk28/qm1TfIZUXuGzyRW9B4ThnjNcJk1F7IIu/i1NM9prI6wC0yiYVto8JpgyQVebMI/p4fPbPIqwnxgE91lbp7gsnLLdodNwLJ9sJ/TGEfHPTabcFsGLT6Tv3Lbi8cqGoMHpwntBnRGAbGtXXwmNA7FEsUq/Io5c2ziMvHX6LOKEa+5bZLL9FzeMouGn2zwmfT5MUZh65MjnxFGmetmFc7SU/b5zHCpMwOJUein9fCZ6BITGEXq8Mhp+veTz8gsVvOa5e3MojzymQ11PyfHLA6NcS5jDdouq+jdFuE0YWaRnWhDg9O8YWbRu5LPXNaRmMMsDsU4lxEz+5e3s4pUMsNn+i98RmaxuofPRJeYzGKA0wwb5gpGUcRO4zRVo8x2/11GUfy60Xo+8xvKXPcbZhTO4+S5jFx/Oa/GZhPjIPu9DT6TucBnFLDruLGGz4TGxMQs/I0zxyY+s1pnFbG7WiS4TH5S3cMo3Jy0+MzQUbkkqwi4DZzGeNFdwCZzP6duA59pm1p9RmGet0bw2Y6tJpuwa97O+mmTz1iDrS6b8M9OSz4jovspk03oA7W8ZtbXAVnMZhLJKXOI08ir71/UwCSgZu4wr4mX12LFJpad2FskOI0xubIJ92mf0uI10atWB1ikuY87+RK81jqpjlYug7D9deuDhdcILzGHRdTfPi65Tfofzm9hEPrHMriNTB9ie232AP7GKL/JP47DINzGYLEEt2m7938dIPZoXhgV/PbkIUche7D9Jx3iOGLW/jcy2YM+UCv5TV/mdN9mDeCsvSXHkflJLckcAq9csFiC47R1+gFijea+3rDgudaGh3IZg+1fFJc8RxiP0r2CMSR/eJ7ryMjE2GCzBfB3tgUL1zF+cmossQU33DH9Q3BdS+b+P1Ow/SfNBwvfEUaZ617BEtA5Ky/5jox/rX9kswSInTA8wXnmHbd2AUscyXsVM3eC91ob7sllCLb/GmuDhfcER2gc4NXY7GDhnil1SPIemb9RMswO3FyfJbivd2IvBsyw5fXXpgUHNs4zkRWEk0vzkv/I+Go9zArgp9/EE/w3WNp2+gFihAFnnmcILjyr/0KTEdj66rjkQcESqeu12QD4H9ULFi50y86GALFB83mHBSeO7gcmsYCwPpCRfEjGD2s6sgB32Z15ghN7N4kBA2x5/bXp3bxI/IZfUIPqD/UpMS95kcxPjjoDcB+qacYhuLEVHI2u6rP9r5ohfkTxZ82G1R44c8/s40dyy0YfVH64u1RuEVzZKHPmQnWHycdZ38eTpDFlFrGxpO7cgHpKS3Bl69Kwq+owuzJOfIkit9dRzUFsh7ebLwlvq9mo4tC/nA3tBG+mzOm9qOKctYbkTU3e3Y1AUO9mmTUEf6bQbp2Pag3rjykGcShjam1YqNLQXBIVXDo0ake+UKUVsSmz6oN4lDTWOqDOzeX9lUPw6Xnn+2NJjaH++/PEp+jMuQ6ocfPCaEJwakofaH1UX5g6uhrErbyK8mXGkOrC08qc0SS4NWUuaEC1FfCctWcSvxLebcyHUllYMx5C450Ljk3xQ6yO6moslFBFmflBPEtYTxlwc1QV7jo7HhyCa1Pz5NqJasq9p6YZh+DcwWWUudNQPWHys8WJd9GaqbOECqop4Mx9u2hCcO/gyByc6lEtjWGv7d4N4l+irumhcioJ6y/oIcHBKXR3VC6F6qg9oJo6BBen0PgwPqqhgOu936Hg4GNNi/oa56ggzJ5TS4KTU+3kmkL1M6ewu0tw89PT48lHtYOpzbXEz3Yvkrk5Kgcb1qVJcHRqPsqmUNWgOVY9ZZfg6tTzGnVUM4WGubN+ia8Ja+b+PtiN6gWT5TFCgrPTlooSK6gWjJU5IyG4Oy1Y2olqpT03rXjE38TpofGk9ahOXpezuJYEj++ou+18VCO4Fy8ZJ8HlafiunrNdhWDDhwntJwSnp+ZVzhinOvCn/5xLuwS3p8jq4heqjXZzR5T4nUikz+lEdTGGkovjJHh+5Zx5VyZLCNUEpg5vf4IE1yevcjfOzUf1gMlv3kOC81N0a2M7qgV01lWdlUNwfxo6M1ZQCdiwP77shNAAUnqVU1AFGFs+2EVaAEGhj1anoAJw/uZpY5iENpAij+MUFB/OD7ivtyU4hFaQQtfSVEHh4ajXPd3GIKEdpMxAChUdPuPTnugzSGgJT1+wukgVFByao9wOg4S28J9lDkupgmLD7saKaZDQGibiS/WCQsPYWHniziChPfxnf+IVFHujeKjEsGZv7NtCQotIC35yTTsqL2zYjzYMk9AmUuaqOfMZUWlhZ5nr8EhoFWmoon4FH5VVQT+nv4uEdpHmUalzUEFhIXWoC43EbqFlpI/Yf07xCxUTtvutCxJC40gd6a+VKqAywtgob26GhPYxkbldrBuVEOoXfr0hElpIileUca4BFQ8WUhf0t5HQRtKWy9bphYBTNmjGrrT1WMEhtJLUlT4iltBIhkoGG+ydPa9CaCkrR+Qqc3MDKhYs7DnjsqpBQltJxuBXTeVQmeADmWfFO0hoLanjxkf5Gn1UIFhIlqWtoSMhtJjU3PcdHqyASgO7YwOGR0KbSV56Un1OHxUFFpLPW1FOORIkNJuJ+LRyRr2JCqKEnvO04TYSWk7ymn+y7YwhVAbYnvrcJ+16EiQ0nk1Gx7YH8nHh7A9dvWVx2iOh/SQrXlEO8HaZOJvDQsPD3X4wT0IbSrf8qC+6H+qjXzgbWwgPVELPeu4Hs0hoRUkY0bM26y7OphYuNDsP6HZmTr4joSWlxPpLVz+t7uJsCBeavaVqVdojoTUlK75hdUD9ThdnMxhwI1+7yuRPnjUNERxCg0pWfMPA5j0m4uwjDKc5j3JsMYwNJDSqZGUGj4jjXK8P4dkDutnX/w+PrYYhSGhYyYq/7aPL+X7WxYWndnbAmU7jBFtR0oYIDqFxpUFj3qs9OI0RSRNaTsXC6JZQ/Wc/LXjGPSGFBjZYhBeHI2ap83uXLnzDp04tMPKVvKt1q2aeoTuLdguN7DsnK181dm5L6L4bcPapTDgMI6kz9iiPEyw9hgChqZWibcHb3n6Qba33zQDZdGphI3Tr/oXl8YRhrLeCQwrNbR8JI/OU28/+OQ26CWjfwNk2uL5ulrmBinKLuCek0OhKsoy4tzFZimYqawLaLTcotg1uCdOd1g/zw7cacU9IoemVJNriw9PKd1lZKkdhKjvfhbBtX3/ZNsAzlpDutI7H1XOfstnwhNwktL/BAuIOjdCo2j938TffPwVofmd9TS7wArBt+3pl2zaAa/qdjnnbM1bf+/Qjnbml1SSFdlhK0WGEPuYN7vjib+LhniDnN3RmR2im6wK02NfFgIPf745Wpt/r7Ird0772Cu5KZnth5q62do0lpBSaYymF5Q2l03UvvWIs/gtnj8d9KNy4zO/tdBynPpvd1dCQzWZ3OY6ecubPaR2n8k/6Js46bpzYaxrO1M6rE8EqpdAuS9kkLM/oSX/U6KXBcpONV+kdlZsUB1aXc9sm2tf4rM86wa48JEuuPrw+zuJ7ryj33eQZQ/Gqjy2LLCGlFFroTVJKISxrUdsWw6iNxyML/kQk8ici8Xg8bxhRr8MSQkgphQZbXnc3iWrzbpLX5jWxrmVdR1dXV1eddc0vq7y7Bnntao3kNRWiclhdXtu8oaF8Op3OrE8bi/rrOiqPwaecfuwOHiAL527dem5BwoqmDYnBS+vedv+wkemJp9O1+SFjS5tnWUIIeY2XaHgukVIKcZm1aNgwahdktgzXbbiNP7Vs/y63W7r6TZz9VX/S+eftJ2+7fJyzw5tbx1DjXeXM7ljMfM7cGNnYSpvDiSdYvo/3vGXuAG/dRSuTh7ezPtaqtS95h3y//W3NkfiQscXrsITYJKXU0EgpZZ+wutqMntBoruq/FE44p9ZVk+OHWHlxbakcJ0fjsvk1u4rYXrzil95QQn5NzFzWnpvjXvMAXfPAy73mc9qf0eyO+b5frxdpyWwxz4/lAmJ5mfswF12x3eiourZibN3QP28oU/Uxz7OEkFJKTYuUUgirbSgfGuuHK8e5U+vrGphoL9fti5sbn9EpIt3J+vNN1wUAsK/1OIDrsX2tWwDg/7s5s6ah3ilinf6c1icoc1fIDrVnbX9rK+qGMqGRn9dvCSnlJVoTKaUQHVEjku7vm1q++BHx/r5Iqdxs+tkiytaYrgtgX1O4QV9sX2MLgNtu+ilnl/9ml5e5i8vNWdt3vN/hTNzwLCGk3KQJkXL3++2adbc+NNIzrpN6937WyvG4POd36n6N6QLYtm3DqXMg2bYN4Oa6/eyD7Yq1lrorxNVH14rSFB3KVA3PElJKDYeUwuo30s11W49LS+/vF4xzcxwnO0LNccG2bZtgtthi2zaAazY4nSX0UG/xScvjO9gZPIYzVR9RS0gpNRdSiukfnpFJ191k8aFpPCRiTvEr2z0HwLZtmB0Hkm3b4Jp+r+43Pu8FS+cGj2g8H7VEn7xEKyGl6DDi6Y7PvfjHPNyvHOFS9TVzAGw7DLN927bBNf1kifZmS+UFS+9dRtevb7OElBqHS2SwCG8oHj138aFhmR1L1de4AULbBiVJtg2u2eA4d/UeTj9iTi2VI52eZwkpNQqXSGF5VR+Z/ptMma9xyUjq7R2huRC2bVCotg2u6SdrqHb12scwIkadkFJrIIPFalvf3HH8fJyLl8d03wzQWGppAcVr2+A+kO407o/bjinTynDcuEMhpVZAStGfz3RMrQMfJuw7/jMC2qCcbRvc7mwR5Z53QjzKVzDiWywh+Z8UlhFZs3VK/Kq2r/su2DYo77CNv9/MFrHnLJNX7D5d5dFc9eEJKfmdDBbh5Zs3HDderNSZuj8nQLYNCt5GMOsd+kmf7YQRjVcNS0geJ4PD2hL66K+oR8zx1OpkRxKgDcp/oQ2un4xdePYxMVjSeU/ITVxNkmXEO+Y+z239pO8GnE0BUo12GMxsb3vt0hOnsd4TfX2cTAprqGf656qLWpxeE2wbVKeNbglLjmRlbmDHcKZNBIvkXlKcfJdvXvFbLm7t9d0A2aBWbYTuztjzluPU2h8xvkJwBAvHkmTlQ+OPT44fZpRXxHwXWwKkbsNhMHX/56xc25Ge+SEkn+oLFsvIiNs9nKn7LtoBUsU2mL1OyzefWmaNjCckd5JiTaRj1X97Wt0HtEFF2zD6lfW/0erPPS9/h02SI0nhZaKpleEi8l1EUN1hMDtjj/I4L339kEXEhXaTZcz73IfZC4v9si7aoNJb4Ms4uQPpiw/GPSG5jxRe/Ckn1/1trNOEFlDziK6fggl2o1F1WBQsPIesvFExJtqA0s0AtYD6t9HN+mVycph+xG8pJKeRwksnbvcoftZFBEYYBlN/qAl2o5G36F3wF7LyoV5FWRlwnSNfEAaWiOhmS6jM/f7pR7xNSL4SHFam8pgyzvd7XURgjmEw9daJdmdoGBuIm0w7mry4PMyOVZ2vH1qATY5FdLP+L1h1i6rDIi7SJ4zmuzs45TpdRGCYYfB3faPHqTwyd0i7eQfNKPkzH+zDxLIuAutENJNjZXmUGU9InkFWvGPKPM/xYSwBE0U3lXsHFTVtCOIVZKWbBsa5ThMQmCmOQf/1j4djT8MQxCPISq+4Yve0e1xcCEwVwXfK7KpZ0xDEG8haECxvotFxMUDsFdGsb/7JawxBPIHu8F8Fy9dq1F0MEJsNODLrS93iNVVDBAcvoLq0PJQb89KfFoHdIpqpUrs4WvWxgXgAWaGPwra7clwEtrsQzdQNv3jUEMT6yIrv3pbTGxHYb8AtNEsez7s4tLtlE9MLjsox1HEl3xiWGkMIbBjRTJ1/1Rm684jZkZhnvIJxbo+LwI4DDv0Stu4m8TsMDjZHXvqVlLpUOwJbRvB/+kS7Im4Re6NFPTufxDER2DMWOkf5vaSOfOUgtkaJyH1f4PuwEJg0usUve3KNziOG1tRUNTrK43Nm7wyBWWN7Z6mc29NFrIy85lVPsKeAwLTRdE4PlniCWBh9oMjWA90uEwPEuvHOGsaISTE6j5hXExkze+XN9BFYODYWv244NfR0Edsir3bV8j0FBEaOpnNQDZZ4gtgVJeL3fYZjYoDYOd5ZQ+PS4TZiVXRLY8D0MeCAqaObvOFHvfouERwsihKRHWV2L56LwNyxu8SVx3vbQuyJ2qp6A7Evg8DisVD82k9tjFjEliix4O7KcC9WQGD0aPpvon8LsSRqi66OzUdg91hIXji1RhLEiigRqSh5p4DA9NEsoW39BrEh8rYcZvxuBNaPBX15ZySxmwFRemtzkSogcEA0/dWGR6yH6nqOyuUeCIEPLiwkP3jfELEdmjfjetbUKB4CN0T/zS7uSRDDSSzYuVxH4ImYS02I/WuI1VBX+oj4QCYCZyw4F54w4gk2Q0bTeEwWELgjdsc+W7qLGEzilOO4ek8+Ao/EQhG7fOxYQ6yF6mr/gt+OwClx1/ITzhsTW6G2/it4nQXgl9htLo4nWAoNfb3t/wiBZ2JOL7dVs4uYSeLq+8fW3AMhcM7Cvb/gZVFiI9SRHnDaEbgnNoxzO+LEQqit7hy9ADwUu0ey772gcrAPMs69UEfgo1hI3T5d+UGMgzIbnzaGwE0LD3ZxdBExjeCKHN1i7QgcFfUyV3kME8NIZJY67QhcFf292Uk7g1jF7kRovFjqnoC3YqxxY4bYBHVFz7l3BP6Kzxj7yZHTWQRFB8ucjsBjsd1ZmkmwB5p1nPsEPgKnvbPfeUgKjUQTYyDjJgEVQ+C2mHyNoZJgCzR0d43dCBwX93xVo4MlUGi3MdeOwHVxz7rhLmIGFH85y9oROC8642O0azcjoPhxMda+ELgv6gdgfxcxAcqsmt+OwIGxWCtzHV3EAGjBd/HbgQ9jQ36wjVQfhcaRwSkAL0b/G1WWLlJ5FP/JuwoLuRGgn59xdZGqo+a1D1QIOODI2PCvX3aXmguOoalzWTvwZXQe7i0lmlQbGXeXa0fOBNh5jpFQaxTd+rTtCNwZk68xnVBntCZYNs/HAHFofLBv3rNCjZG3YW+KIXBp3FMee0iFddUt8RE4NaaOmGlSXQnjSeoRuHXB+StxUlnBjw+2sviFwLFHpWUVh0GqiiJLUwg8G7u/Anmkoqj2RZ0C8G2syff/SvVExo5l7cC70Tmj6kyoJepvCncj9wJMvliGVFJi5ix1PgIHx9SVY4RUUeV++mIdgYsXSvB/Vw1SQRT6PK1IInDy9ocKFo9UDxlXOf1CgHg5+mXOSKierg2b24Gf4+/ctoBUTsL4Dg3I0aDgfJdaUjX0J8rjgyFw9fbc1/PUDA1td8Y+gK9jbMnzWuqFvL7GduDtqL/GHlItiaqS9pG7AaYm19AglUKR5O9E4PDuSNrqkSqh6Ea/ADweax7FSKiSRP+FJnI5wOLXX4iQCqHINh2B0xdiO9pIdew25r62AvB6/DKlbktCdVh1T2AitwN0ytOfIJVBCyZYB4HjF0bInVFSFVQ1tjsF4PrmN+pPqAprcPMy5Hv4Ow8NEVIRFF+pI3D+Qk1FbSPVQG0VpYQKwPvRf31GZVANCeNRfOR+gKl3UPVBKoGab7cHQQPYvnnQUgnWUwZcDrSAqB9iI8GhCiiy8h+hJgAKsRNytyQVQLesKK+/ANpALKED7NA/UwEJ41F81AgApqbUPCk+ym9OIWgG28ODluJLeD/HXKgdwOTqOCk8ql2qI2gI3YdqshSedVl4DmgJ0XnYCCk6ig8kUVMAD5V76WcrOmv68VAuaAuxfqKNkIKjyKFNR40BFEZ4Wz0FN2P1vdnRDrSGmH3WDCk2iqzsRc0BFGJ35yk27+uZBdAeon9xnhQaRbbVowYBAir2uT1SZtb046Fc0CJi70QTUWaUPi2JmgRwcyssRZboXz5agDYR9cNanBQYGa+rFzUKMPrV0lF5KDBRtV/mTNAqoj455oNFcYEx10HtgrlkWChuqj2QfO0CoL7dCBaF1eTtiAVIw4gjX/8wtL9CYVFkW31YwwAQ2+GtUFavomMcjeSBljGsl9tIsCgqMFY1BJymAZb+HE8o6uCoXeePU9qGf+9sv2WwKClL5twAaRvHSf8TZUhB9eVvlAxrHMBtDJ6WghJn/qBu0DqifpYhFVOTt9MH7cNpj2IIxUyh8c2zYc0DQOzuvGBVStaM45+5oH1EvTzGX7pCkmvmlmiggVxolsphoZD70i+WtTUQALHP7SkkEV1ighYyXPyaFKs+pDLydsRAG+Ef4KV3KyIZujsiJsOaCGi9q746RSTmnT/ypZHAzindkFRC1rSSc0EbafsX50kBSWNK1FEjAe5XGLQUEOXX+bZWAp3thlQ+1uBY5YJW8g3Xb4son01exfBBMznWmv/aEIpX5idVx9ZMgNv4GJbiCZb8p/I1FOC8mzVS6Qhv+SgNtJO2PpBWPN5NYqCl8MdDmhSONKZMPayhAHfzoKV0IhNs1tZSgL/Tm7aUjRje1zNBS2k7S/NS2ViFnKut8C/OvwtFI2cd79UBbaX5jaJC2eQfJ2lrK9wxtMJSNukJ0ddYgL/Tu0TJiPTrm9+irbD112VIJfOB6sa50Qo0FvW3jyuajvs2QWvhr1sfLApGRtc6WgsYyb7RIqFkMpNq0tZauGPEY1hKJj3RZjUX0L3Ru0S5iC3nm+NAaxEu0o5MQ1LBRH/OM4LW0tYH8grGqhxjydVe+M+TVjAd5+YCLw3Gk/YoF9lWUUoItBex8z9qk3LZcpVeb4vmAp5xH2+RUC7GlKnb2gt3c8JSLs2HJ0eDAaOw71LlEtmW1WLMf2uecol/mL3Ibdde7qVtj0qlIrwD4+/bVz6B5vKRR8sjq4JJdA23aS+ji6xXIar9X+3/av9X+7/a/9X+r/Z/tf+r/V/t/2r/v0T6Ag==")
                        setcompnum(data[1])
                        setscore(data[2])
                        setcreatenum(0)
                        setallcomp(data[4])
                        setuser('guest')
                        if (data[3][0] == 'none') {
                            setnopuz(true)
                            setnoreturnline('You have completed all the puzzles')
                            
                            //placeholder
                            setcurpuz([null, '2024-06-09T21:07:36.649215Z', 35, 0, 1, '2', '2', 'kkk', null, '#333333!#333333!#333333!#333333!#333333!#333333!#3…#887766!#FFFFFF!#333333!#FFFFFF!#887766!#FFFFFF!|'])
                        } else {
                            setdisplay(data[3][0])
                            setdisplaypage(data[3][1])
                            fetch("/backend/getdetail" + "?curpuz=" + data[3][0][0][1] + 2).then((Response) => Response.json()).then((data) => {
                                setcurpuz(data)
                            })
                        }
                        getinitt(rankord)
                    })
                } else {

                    //if the user is a loged in user, get information about the user
                    if (data[1] == 'user') {
                        fetch('http://127.0.0.1:8000/backend/getiduser', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                userid: data[0] 
                            })
                        }).then((Response) => Response.json()).then((data) => {

                            fetch("/backend/getuserid").then((Response) => Response.json()).then((data) => {
                                setuserid(data)
                            })
                            setname(data[0])
                            setprofpic(data[1])
                            setcompnum(data[2])
                            setcreatenum(data[3])
                            setscore(data[4])
                            setuser('user')
                            setallcomp(data[6])
                            setallcreate(data[7])
                            setalllike(data[8])
                            if (data[5][0] == 'none') {
                                setnopuz(true)
                                setnoreturnline('You have completed all the puzzles')
                                
                                //placeholder
                                setcurpuz([null, '2024-06-09T21:07:36.649215Z', 35, 0, 1, '2', '2', 'kkk', null, '#333333!#333333!#333333!#333333!#333333!#333333!#3…#887766!#FFFFFF!#333333!#FFFFFF!#887766!#FFFFFF!|'])
                            } else {
                                setdisplay(data[5][0])
                                setdisplaypage(data[5][1])
                                fetch("/backend/getdetail" + "?curpuz=" + data[5][0][0][1] + 2).then((Response) => Response.json()).then((data) => {
                                    setcurpuz(data)
                                })
                                getinitu(rankord)
                            }
                            getinitt(rankord)
                        })
                    }
                }
            }
        })
    }, []);

    return
}

/**
* handle quitting the detail penal and the name/ profile picture change panel and return to the list of puzzles
*/
function goback() {
    window.history.replaceState(null, "New Page Title", "/paint/dash/")
    document.querySelector('#detail').style.display = "none";
    document.querySelector('.puzzlepen').style.display = "none";
    document.querySelector('#dash').style.filter = "blur(0px)";
    document.querySelector('#space').style.display = "none";
    document.querySelector('#usernc').style.display = "none";
    document.querySelector('#usernameconfirm').style.display = "none";
    document.querySelector('#userpp').style.display = "none";
    document.querySelector('#ppconfirm').style.display = "none";
}

/**
* determine the current order used to sort the puzzles
* 
* @param  cursort - current sorting order of puzzles
* @param  curcontent - current catagory of puzzles (not started, completing, solved, liked, creating, created)
*
* @return the current order used to sort the puzzles
*/
function Currentsortorder({ cursort, curcontent }) {
    if (curcontent == 3) {
        return <span id='sortnow'>Last Attempt</span>
    } else {
        if (cursort == 0 || cursort == 5) {
            return <span id='sortnow'>Upload Date</span>
        } else if (cursort == 1 || cursort == 6) {
            return <span id='sortnow'>Like</span>
        } else if (cursort == 2 || cursort == 7) {
            return <span id='sortnow'>Started</span>
        } else if (cursort == 3 || cursort == 8) {
            return <span id='sortnow'>Score</span>
        } else {
            return <span id='sortnow'>Last Attempt</span>
        }
    }
}

/**
* create a puzzle gallery with a page nav bar
* 
* @param  user - a value showing whether the user is a guest 
* @param  display - a list of puzzle to display on the user's dashboard
* @param  displaypage -  the number of all puzzle the user have in each puzzle category
* @param  nopuz - a boolean value showing whether the displaypage is 0
* @param  curpage - the page of puzzles the user is viewing, each page have 20 puzzles
* @param  searchres - the term in the puzzle titles that is being search for
* @param  curcontent - current puzzle catagory
* @param  cursort - current puzzle sorting order
* @param  UserSocket - a web socket used to change profile pic and username in real time
* @param  curpuz - the puzzle being focused on in the detail penal
*
* @return a puzzle gallery with a page nav bar
*/
function Displayimg({ setalllike,curpuz,user,setwhere, setquitting, UserSocket, changedisplay, display, displaypage, noreturnline, nopuz, curpage, searchres, curcontent, cursort, setcurpuz }) {

    /**
    * open up the detail penal
    *
    * @param  newdata - the puzzle to be shown in the detail penal
    */
    function showdetail( newdata ) {
        fetch("/backend/getdetail" + "?curpuz=" + newdata[1] + curcontent).then((Response) => Response.json()).then((data) => {
            console.log(data)
            setcurpuz(data)
            fetch("/backend/getalllike").then((Response) => Response.json()).then((likedata) => {
                setalllike(likedata)
            })
            return data
        }).then((data)=>{

            //determine how many like the puzzle have
            var likecount = "0"
            
            if(data!=null){
                console.log(data[3])
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

            window.history.replaceState(null, "New Page Title", "/paint/dash/".concat(newdata[1]).concat("/").concat(newdata[1]))
            document.querySelector('#detail').style.display = "grid";
            document.querySelector('.puzzlepen').style.display = "block";
            document.querySelector('#dash').style.filter = "blur(10px)";
        })
    }

    var shelf = [];
    var puzres = [];
    var i = 0;
    var pn

    //if there are puzzles to be displayed, creata a shelf like display for them
    if (nopuz == false) {

        //if user wants to see the puzzles they are creating, add a addmore button so the user can begin a brand new puzzle, else only display the puzzles
        if (curcontent == 3) {
            pn = Math.ceil((parseInt(displaypage) + 1) / 20)
            for (i = 0; i < display.length; i++) {
                puzres.push(display[i])
            }
            puzres.push('extra')
        } else {
            pn = Math.ceil(displaypage / 20)
            for (i = 0; i < display.length; i++) {
                puzres.push(display[i])
            }
        }

        //add the puzzles on a shelf like structure
        for (var i = 0; i <= puzres.length - 4; i = i + 4) {
            shelf.push(puzres.slice(i, i + 4))
        }

        if (puzres.length % 4 != 0) {
            shelf.push(puzres.slice(i, puzres.length))
        }

        //get the number of pages, each page is 20 puzzle
        var pnlist = []
        for (var i = 0; i < pn; i++) {
            pnlist.push(i + 1)
        }

        /**
        * change in to another page of puzzles
        *
        * @param  newpage - the page number
        */
        function changepage(newpage) {
            changedisplay(curcontent, searchres, cursort, newpage, 3)
            document.getElementById("search").value = searchres
        }

        // build the page navigation system
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
                    setTimeout(() => {
                        document.getElementById("loading").style.display = "none";
                    }, 500)
                }
                if (curcontent == 3 && subdata == 'extra') {
                    var height = 1.5
                    var width = 1
                    return (
                        <div key={'id'.concat(subindex.toString())} onClick={()=>{
                            setquitting(true)
                            setcurpuz(null)
                            if (user == "user") {
                                UserSocket.close()
                            }
                            setwhere("create")
                        }} className="shelfspace">
                            <div className="widthresizable">
                                <Add id='addpuztab' className="lineIcon" />
                            </div>
                        </div>
                    )
                } else if (curcontent == 3) {
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
                                <img src={subdata[0]} onClick={()=>{
                                    var temppuz=curpuz
                                    temppuz[5]=subdata[3]
                                    setcurpuz(temppuz)
                                    setquitting(true)
                                    if (user == "user") {
                                        UserSocket.close()
                                    }
                                    setwhere("create")
                                }} className="widthresizable" />
                            </div>
                        )
                    } else {
                        return (
                            <div key={'id'.concat(subindex.toString())} className="shelfspace">
                                <img src={subdata[0]} onClick={()=>{
                                    setquitting(true)
                                    var temppuz=curpuz
                                    temppuz[5]=subdata[3]
                                    setcurpuz(temppuz)
                                    if (user == "user") {
                                        UserSocket.close()
                                    }
                                    setwhere("create")
                                }} className="heightresizable" />
                            </div>
                        )
                    }
                } else {
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
                                <img src={subdata[0]} onClick={() => showdetail( subdata )} className="widthresizable" />
                            </div>
                        )
                    } else {
                        return (
                            <div key={'id'.concat(subindex.toString())} className="shelfspace">
                                <img src={subdata[0]} onClick={() => showdetail( subdata )} className="heightresizable" />
                            </div>
                        )
                    }
                }
            })

            //add the puzzle title on the shelf display
            const titledisplay = data.map((subdata, subindex) => {
                if (curcontent == 3 && subdata == 'extra') {
                    return <span key={'tid'.concat(subindex.toString())} className='frametitle'><div className='spacetitle'><p className='shelftitle' style={{ fontSize: '15px' }}>Add More</p></div></span>
                } else if (curcontent == 3) {
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
                } else {

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
                }
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
                            {titledisplay}
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

/**
* create a detailed description panel about a specific puzzle
* 
* @param  searchres - the term in the puzzle titles that is being search for
* @param  curcontent - current puzzle catagory
* @param  curpage - the page of puzzles the user is viewing, each page have 20 puzzles
* @param  alllike - all the puzzles the user liked
* @param  allcreate - all the puzzles the user created
* @param  allcomp - all the puzzles the user completed
* @param  curpuz - the puzzle being focused on in the detail penal
* @param  user - a value showing whether the user is a guest 
* @param  where - the page to leave to when a user wants to leave this page
* @param  quitting - boolean value indicating if the user wish to quit this page
* @param  UserSocket - a web socket used to change profile pic and username in real time
* @param  cursort - current puzzle sorting order
*
* @return a detailed description panel about a specific puzzle
*/
function Detaildisplay({setcurpage,setdisplaypage,setdisplay,setnopuz,curpage,searchres,curcontent,cursort,UserSocket,messagepop,where,setwhere,quitting,setquitting, setalllike, alllike, allcreate, allcomp, curpuz, user }) {
    const navigate = useNavigate();

    //handle quitting the page
    if (quitting) {
        if (where == "start") {
            document.getElementById('transitionout').classList.add('outswipe')
            setTimeout(() => {
                navigate("/paint/start/")
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
            }, 500);

        } else if (where == "login") {
            document.getElementById('transitionout').classList.add('outswipe')
            setTimeout(() => {
                navigate("/paint/login/")
                navigate(0)
            }, 500);
        
        } else if (where == "create") {
            document.getElementById('transitionout').classList.add('outswipe')
            setTimeout(() => {
                if(curpuz==null){
                    navigate("/paint/create/".concat(""), { state: true })
                }else{
                    navigate("/paint/create/".concat(curpuz[5]), { state: curpuz[5] })
                }
            }, 500);
        }else{
            document.getElementById('transitionout').classList.add('outswipe')
            setTimeout(() => {
                navigate("/paint/visit/".concat(where), { state: where })
            }, 500);
        }
    }

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

                if(curcontent==5){
                    fetch('http://127.0.0.1:8000/backend/getuserfilpuzzlenewpage', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            search: searchres,
                            page: curpage - 1,
                            type: curcontent,
                            sort: cursort
                        })
                    }).then((Response) => Response.json()).then((newdata) => {
                        
                        //if no puzzle is retrived, out put a message on screen 
                        if (newdata == false) {
                            setnopuz(true)
                            setnoreturnline('You have no liked puzzle')

                        //if the requested puzzles exist, it will be successfully retrived and outputted on screen
                        } else {
                            console.log()
                            setnopuz(false)
                            setdisplay(newdata[0])
                            setdisplaypage(newdata[1])
                            if(curpage>Math.ceil(newdata[1]/20)){
                                setcurpage(Math.ceil(newdata[1]/20))
                            }
                        }
                    })
                }
            })
        }
    }


    if (curpuz != null && curpuz.length != 0) {

        //check if current puzzle is liked by the user
        var isliked = false
        for (var i = 0; i < alllike.length; i++) {
            if (alllike[i] == curpuz[5]) {
                isliked = true
            }
        }

        //check if current puzzle is completed by the user
        var iscomp = false
        for (var i = 0; i < allcomp.length; i++) {
            if (allcomp[i] == curpuz[5]) {
                iscomp = true
            }
        }

        //check if current puzzle is created by the user
        var iscreate = false
        for (var i = 0; i < allcreate.length; i++) {
            if (allcreate[i] == curpuz[5]) {
                iscreate = true
            }
        }

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
                                ? (
                                    <span className="author">
                                        <span><img src={curpuz[8]} /></span>
                                        <p>{curpuz[7]}</p>
                                    </span>
                                ) : (
                                    <span className="author" onClick={()=>{
                                        setquitting(true)
                                        if (user == "user") {
                                            UserSocket.close()
                                        }
                                        setwhere("visit")
                                    }}>
                                        <span><img src={curpuz[8]} /></span>
                                        <p>{curpuz[7]}</p>
                                    </span>
                                )
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
                                        : <button className="detailbutton" onClick={()=>{
                                            setquitting(true)
                                            if (user == "user") {
                                                UserSocket.close()
                                            }
                                            setwhere("puzzle")
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
                                ? (
                                    <span className="author">
                                        <span><img src={curpuz[8]} /></span>
                                        <p>{curpuz[7]}</p>
                                    </span>
                                ) : (
                                    <span className="author" onClick={()=>{
                                        setquitting(true)
                                        if (user == "user") {
                                            UserSocket.close()
                                        }
                                        setwhere("visit")
                                    }}>
                                        <span><img src={curpuz[8]} /></span>
                                        <p>{curpuz[7]}</p>
                                    </span>
                                )
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
                                        : <button className="detailbutton" onClick={()=>{
                                            setquitting(true)
                                            if (user == "user") {
                                                UserSocket.close()
                                            }
                                            setwhere("puzzle")
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
* create all content on this page
*
* @param  display - a list of puzzle to display on the user's gallery
* @param  displaypage - the number of all puzzle the user have compelted or created (depends on which one the user wish to view)
* @param  alllike - name of all the puzzles user has liked
* @param  allcreate - name of all the puzzles user has created
* @param  allcomp - name of all the puzzles user has completed
* @param  sortorderas - whether the puzzles are sorted in ascending or descending order
* @param  compnum - the number of puzzle user's completed
* @param  createnum - the number of puzzle user's created
* @param  sortlist - a list of avilible orders the puzzles can be sorted in
* @param  noreturnline - a string telling the user no puzzle can be displayed
* @param  nopuz - a boolean value showing whether the displaypage is 0
* @param  curpage - the page of puzzles the user is viewing, each page have 20 puzzles
* @param  searchres - terms being searched
* @param  search - the input in the search bar
* @param  score - the user's score
* @param  message - the message that will be send to the user in a popup window in case of errors in thw way the program is used
* @param  profpic - user's profile picture
* @param  curpuz - the puzzle being focused on in the detail penal
* @param  curcontent - current puzzle catagory
* @param  cursort - current puzzle sorting order
* @param  user - a value showing whether the user is a guest 
* @param  name - name of the user
* @param  rankord - current ordering of the users' ranking (by puzzle created, completed, or score)
* @param  ranktype - current type of the users' ranking (top users' ranking, or ranking around the current user)
* @param  top - current list of user on the top ranking
* @param  topover - whether the lowest ranked user is displayed, the highest ranked user is displayed, neither, or all the user is displayed for the top ranking
* @param  userover - whether the lowest ranked user is displayed, the highest ranked user is displayed, neither, or all the user is displayed for the currentuser ranking
* @param  userrank - current list of user on the user ranking
* @param  userid - current user's id used to create websocket
*
* @return the content on this web page
*/
function Userpage({ userid, display, setdisplay, displaypage, setdisplaypage, setalllike, alllike, allcreate, allcomp, sortorderas, setsortorderas, setsort, compnum, createnum, sortlist, setsortlist, setnoreturnline, noreturnline, nopuz, setnopuz, setcontent, setcurpage, curpage, setprofpic, searchres, setsearchres, search, setsearch, score, message, profpic, setcurpuz, curpuz, setname, cursort, curcontent, name, user, setmessage, rankord, ranktype, top, topover, userover, userrank, getinitt, moreup, moredown, getinitu, setranktype, setrankord, setuserrank, settop }) {
    const [quitting, setquitting] = useState(false)
    const [where, setwhere] = useState("")
    const [changingname, setcname] = useState('')
    const [crop, setCrop] = useState()
    const [open, setopen] = useState(false)
    const base58 = require('base58-encode');

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
    * change the username in real time
    * 
    * @param  UserSocket - a web socket used to change profile pic and username in real time
    */
    function changeusername(UserSocket) {
        fetch('http://127.0.0.1:8000/backend/changeusername', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                newusername: changingname.changingname
            })
        }).then((Response) => Response.json()).then((data) => {
            //check if new user name has already been taken
            if (data != false) {

                //update user's information in the ranking section 
                var newuserrank = userrank
                for (var i = 0; i < newuserrank.length; i++) {
                    if (newuserrank[i][0] == name) {
                        newuserrank[i][0] = data
                    }
                }
                setuserrank(newuserrank)
                var newtoprank = top
                for (var i = 0; i < newtoprank.length; i++) {
                    if (newtoprank[i][0] == name) {
                        newtoprank[i][0] = data
                    }
                }
                settop(newtoprank)
                setname(data)
                document.querySelector('#usernameconfirm').style.display = "block";
                document.querySelector('#usernc').style.display = "none";

                function sending(){
                    if(UserSocket.readyState == 1){
                        UserSocket.send(JSON.stringify({
                            'message': data+"u"
                        }))
                    }else{
                        setTimeout(() => {
                            console.log("waiting for connection")
                            sending()
                        },100)
                    }
                }
                //send web socket signal
                if (UserSocket != 0) {
                    sending()
                }
            
            //pop up output error message if new user name has already been taken
            } else {
                messagepop('Username is already taken')
            }
        })
    }

    /**
    * handle changing texts in the username text field
    * 
    * @param  e - the event of the content of username text field being changed
    */
    function handlenamechange(e) {
        const newn = { changingname }
        newn[e.target.id] = e.target.value
        setcname(newn)
    }

    /**
    * handle changing texts in the search text field
    * 
    * @param  e - the event of the content of search text field being changed
    */
    function handlesearchchange(e) {
        const news = { search }
        news[e.target.id] = e.target.value
        setsearch(news)
    }
    
    /**
    * opening up the correct penal when user name or profile picture change
    * 
    * @param type - the type of change penal to open up (change username, or profile picture)
    */
    function showpan(type) {
        document.querySelector('#dash').style.filter = "blur(10px)";
        document.querySelector('#space').style.display = "grid";
        if (type == 1) {
            document.querySelector('#usernc').style.display = "block";
        } else {
            document.getElementById('imagenewprof').style.width = '380px';
            document.getElementById('imagenewprof').style.height = '380px';
            document.querySelector('#userpp').style.display = "block";
            const Crop = makeAspectCrop({
                unit: 'px', 
                x: document.getElementById('imagenewprof').offsetWidth / 4,
                y: document.getElementById('imagenewprof').offsetHeight / 4,
                width: document.getElementById('imagenewprof').offsetWidth / 2,
                height: document.getElementById('imagenewprof').offsetHeight / 2
            }, 1)
            setCrop(Crop)
        }
    }

    var UserSocket = 0
    //create a websocket to enable a change in username and image in case user name is changed in another tab    
    if (user == "user" && userid!="") {
        startsocket()
    }

    function startsocket(){

        UserSocket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/'
            + base58(userid)
            + '/'
        );

        console.log(UserSocket)

        /**
        * when recieving a message from the correct websocket channel, change the username or image 
        * 
        * @param e - the event of getting a message
        */
        UserSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            console.log(data.message.slice(data.message.length-1,data.message.length))
            if(data.message.slice(data.message.length-1,data.message.length)=="u"){
                setname(data.message.slice(0,data.message.length-1))

                var newuserrank = userrank
                for (var i = 0; i < newuserrank.length; i++) {
                    if (newuserrank[i][0] == name) {
                        newuserrank[i][0] = data.message.slice(0,data.message.length-1)
                    }
                }
                setuserrank(newuserrank)
                var newtoprank = top
                for (var i = 0; i < newtoprank.length; i++) {
                    if (newtoprank[i][0] == name) {
                        newtoprank[i][0] = data.message.slice(0,data.message.length-1)
                    }
                }
                settop(newtoprank)
            }else if(data.message.slice(data.message.length-1,data.message.length)=="i"){
                setprofpic(data.message.slice(0,data.message.length-1))
                document.getElementById("userpicele").src = data.message.slice(0,data.message.length-1);
            }
        };

        /**
        * when closing, restart the web socket
        * 
        * @param e - the event of getting a close signal
        */
        UserSocket.onclose = function (e) {
            console.log(UserSocket)
            startsocket()
        }

    }

    /**
    * change how the user ranking is sorted (by score, puzzle created, or puzzle completed)
    *
    * @param  neword - new ranking sorting order
    */
    function newrankord(neword) {
        if (rankord != neword) {
            setrankord(neword)
            getinitt(neword)
            getinitu(neword)
        }
    }

    /**
    * change whether the puzzle is sorted in descending or ascending order
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
    * change the where is ranking is focused on (on the ranking around the current user, ot the top ranked users)
    *
    * @param  newtype - new type of user ranking (focused on the ranking around the current user, ot the top ranked users)
    */
    function changetype(newtype) {
        if (ranktype != newtype) {
            setranktype(newtype)
            getinitt(rankord)
            getinitu(rankord)
        }
    }

    /**
    * change how puzzles are sorted
    *
    * @param  neword - new descending or ascending order
    * @param  sorder - new puzzle sorting order
    */
    function sortorder(neword, sorder) {
        if (nopuz == false) {
            if (neword) {
                document.getElementById("search").value = searchres
                changedisplay(curcontent, searchres, sorder, 1, 3)
            } else {
                document.getElementById("search").value = searchres
                changedisplay(curcontent, searchres, sorder + 5, 1, 3)
            }
        }
        setsort(sorder)
    }

    //create a list of possible sorting order for the puzzles of differing catagory
    const sortlistdisplay = sortlist.map((data, index) => {
        if (curcontent != 3) {
            if (index == 0) {
                if (index != cursort) {
                    return <span key={'sort'.concat(index)} id='cataselectfirst' onClick={() => sortorder(sortorderas, index)} >{data}</span>
                } else {
                    return <span key={'sort'.concat(index)} id='cataselectfirst' style={{ backgroundColor: '#7F7262', color: "bisque" }} >{data}</span>
                }
            } else if (index == sortlist.length - 1) {
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
        } else {
            return
        }
    })

    /**
    * search for a puzzle
    *
    * @param  content - being searched for (only puzzles that have a name that contains content will be displayed)
    */
    function searchbyname(scontent) {
        if (typeof scontent != "string") {
            scontent = scontent.search
        }
        setsearchres(scontent)
        changedisplay(curcontent, scontent, cursort, 1, 2)
        document.getElementById("search").value = scontent
    }

    /**
    * create and position the crop window for a puzzle in the center of the puzzle
    */
    function newcrop() {
        var Crop
        const image = new Image()
        image.src = document.getElementById('imagenewprof').src
        if (image.width >= image.height) {
            var heightscale = image.height / image.width
            document.getElementById('imagenewprof').style.width = '380px'
            document.getElementById('imagenewprof').style.height = (380 * heightscale).toString().concat('px')

            Crop = makeAspectCrop({
                unit: 'px',
                x: document.getElementById('imagenewprof').offsetWidth / 2 - document.getElementById('imagenewprof').offsetHeight / 4,
                y: document.getElementById('imagenewprof').offsetHeight / 2 - document.getElementById('imagenewprof').offsetHeight / 4,
                width: document.getElementById('imagenewprof').offsetHeight / 2,
                height: document.getElementById('imagenewprof').offsetHeight / 2,
            }, 1)
        } else {
            var widthscale = image.width / image.height
            document.getElementById('imagenewprof').style.height = '380px'
            document.getElementById('imagenewprof').style.width = (380 * widthscale).toString().concat('px')

            Crop = makeAspectCrop({
                unit: 'px',
                x: document.getElementById('imagenewprof').offsetWidth / 2 - document.getElementById('imagenewprof').offsetWidth / 4,
                y: document.getElementById('imagenewprof').offsetHeight / 2 - document.getElementById('imagenewprof').offsetWidth / 4,
                width: document.getElementById('imagenewprof').offsetWidth / 2,
                height: document.getElementById('imagenewprof').offsetWidth / 2,
            }, 1)
        }
        setCrop(Crop)
    }

    /**
    * out put the new image on screen when user uploads a new image in thechange profile pic penal
    * 
    * @param e - the event od user uploading a image
    */
    function showimage(e) {
        var newsrc = document.getElementById('imagenewprof')
        if (e.target.files[0] != null) {
            newsrc.src = URL.createObjectURL(e.target.files[0])
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = function () {
                newsrc.src = reader.result;
            };
        }
    }

    //close the pop up alarm
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setopen(false)
    }

    /**
    * crop and store the image as profile pic
    * 
    * @param crop - the current portion of image in the crop window
    */
    function profpicchange(crop) {
        const image = new Image()
        image.src = document.getElementById('imagenewprof').src
        const realx = document.getElementById('imagenewprof').offsetWidth
        const realy = document.getElementById('imagenewprof').offsetHeight
        const canvas = document.createElement('canvas')
        canvas.height = crop.height
        canvas.width = crop.width
        const ctx = canvas.getContext('2d', { preserveDrawingBuffer: true })

        //create croped image
        image.onload = function () {
            ctx.drawImage(
                image,
                crop.x * image.width / realx,
                crop.y * image.height / realy,
                crop.width * image.width / realx,
                crop.height * image.height / realy,
                0,
                0,
                crop.width,
                crop.height
            )
        }

        //sending the croped image to store in the backend and send a signal to every othe page connected through the websocket
        setTimeout(function () {
            var dataURL = canvas.toDataURL("image/png");
            fetch('http://127.0.0.1:8000/backend/changeuserimg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    img: dataURL
                })
            }).then((Response) => Response.json()).then((data) => {
                setprofpic(data)
                document.getElementById("userpicele").src = data;
                document.querySelector('#userpp').style.display = "none";
                document.querySelector('#ppconfirm').style.display = "block";

                function sending(){
                    if(UserSocket.readyState == 1){
                        console.log("done")
                        UserSocket.send(JSON.stringify({
                            'message': data+"i"
                        }))
                    }else{
                        setTimeout(() => {
                            console.log("waiting for connection")
                            sending()
                        },100)
                    }
                }
                //send web socket signal
                if (UserSocket != 0) {
                    sending()
                }
            })
        }, 0);
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
    * display new puzzles
    *
    * @param  cata - the catagory of the newly displayed puzzle (started, not started, completed, liked, created, or creating)
    * @param  search - terms that are being searched for (only puzzles that have a name that contains content will be displayed)
    * @param  sort - new puzzle sorting order
    * @param  page - new page the user want to visit
    * @param  update - which of the above parameter is updated
    */
    function changedisplay(cata, search, sort, page, update) {
        document.getElementById("loading").style.display = "block";
        fetch('http://127.0.0.1:8000/backend/getuserfilpuzzlenewpage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                search: search,
                page: page - 1,
                type: cata,
                sort: sort
            })
        }).then((Response) => Response.json()).then((data) => {
            
            //if no puzzle is retrived, out put a message on screen and update the sort list, 
            if (data == false) {
                setTimeout(() => {
                    document.getElementById("loading").style.display = "none";
                }, 500)
                if (update == 2) {
                    setnopuz(true)
                    setnoreturnline('No puzzle matches your search')
                } else if (update == 1) {
                    if (document.getElementById('asd').style.display == "none") {
                        setsortorderas(true)
                        document.getElementById('dsd').style.setProperty("display", 'none', 'important')
                        document.getElementById('asd').style.setProperty("display", 'inline-flex', 'important')
                    }
                    if (cata == 0) {
                        setsortlist(['Upload Date', 'Like', 'Started', 'Score'])
                        setnopuz(true)
                        setnoreturnline('You have completed all the puzzles')
                    } else if (cata == 1) {
                        setsortlist(['Upload Date', 'Like', 'Started', 'Score', 'Last Attempt'])
                        setnopuz(true)
                        setnoreturnline('You have no saved work')
                    } else if (cata == 2) {
                        setsortlist(['Upload Date', 'Like', 'Started', 'Score'])
                        setnopuz(true)
                        setnoreturnline('You have no completed puzzle')
                    } else if (cata == 5) {
                        setsortlist(['Upload Date', 'Like', 'Started', 'Score'])
                        setnopuz(true)
                        setnoreturnline('You have no liked puzzle')
                    } else if (cata == 3) {
                        setsortlist([])
                        setnopuz(false)
                        setdisplay([])
                        setdisplaypage(0)
                    } else if (cata == 4) {
                        setsortlist(['Upload Date', 'Like', 'Started', 'Score'])
                        setnopuz(true)
                        setnoreturnline('You have not created any puzzle')
                    }
                }
            //if the requested puzzles exist, it will be successfully retrived and outputted on screen
            } else {
                if (update == 1) {
                    if (document.getElementById('asd').style.display == "none") {
                        setsortorderas(true)
                        document.getElementById('dsd').style.setProperty("display", 'none', 'important')
                        document.getElementById('asd').style.setProperty("display", 'inline-flex', 'important')
                    }
                }
                if (cata == 0) {
                    setsortlist(['Upload Date', 'Like', 'Started', 'Score'])
                } else if (cata == 1) {
                    setsortlist(['Upload Date', 'Like', 'Started', 'Score', 'Last Attempt'])
                } else if (cata == 2) {
                    setsortlist(['Upload Date', 'Like', 'Started', 'Score'])
                } else if (cata == 5) {
                    setsortlist(['Upload Date', 'Like', 'Started', 'Score'])
                } else if (cata == 3) {
                    setsortlist([])
                } else if (cata == 4) {
                    setsortlist(['Upload Date', 'Like', 'Started', 'Score'])
                }
                setnopuz(false)
                setdisplay(data[0])
                setdisplaypage(data[1])
            }

        //update the relevent varibles, like the current puzzle catagory, search term, and page
        }).then(() => {
            setcontent(cata)
            setsearchres(search)
            setcurpage(page)
            document.getElementById("board").scrollTo(0, 0)
        })
    }

    /**
    * change the puzzle catagory
    *
    * @param newcata - the new puzzle catagory
    */
    function changecata(newcata) {
        document.getElementById("search").value = ''
        changedisplay(newcata, '', 0, 1, 1)
    }

    //simplify the display value for the number of puzzle completed of the user so it dose not take up too much space
    var puzcompleted = '';
    if (compnum > 1000) {
        puzcompleted = Math.round(compnum / 1000).toString().concat('k')
    } else if (compnum > 1000000) {
        puzcompleted = Math.round(compnum / 1000000).toString().concat('m')
    } else if (compnum > 1000000000) {
        puzcompleted = Math.round(compnum / 1000000000).toString().concat('b')
    } else {
        puzcompleted = compnum.toString()
    }

    //simplify the display value for the number of puzzle created of the user so it dose not take up too much space
    var puzcreated = '';
    if (createnum > 1000) {
        puzcreated = Math.round(createnum / 1000).toString().concat('k')
    } else if (createnum > 1000000) {
        puzcreated = Math.round(createnum / 1000000).toString().concat('m')
    } else if (createnum > 1000000000) {
        puzcreated = Math.round(createnum / 1000000000).toString().concat('b')
    } else {
        puzcreated = createnum.toString()
    }

    //simplify the display value for the total score of the user so it dose not take up too much space
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

    return (
        <div>
            <div id='dash'>
                <div id='profile'>
                    
                    {/* user or guest profile picture*/}
                    {user == "user"
                        ? (
                            <div id="profpic" onClick={() => showpan(0)}>
                                <img src={profpic} alt='pic' />
                                <div id='imgfil'><p>click to change</p></div>
                            </div>
                        ) : (
                            <div id="profpic">
                                <img src={profpic} alt='pic' />
                            </div>
                        )
                    }

                    {/* user or guest profile picture*/}
                    {user == "user"
                        ? (
                            <div id="profusername" onClick={() => showpan(1)}>
                                <p id='namedisplay'>{name}<span id='centericon'><EditOutlined id="nameicon" /></span></p>
                            </div>
                        ) : (
                            <div id="profusername">
                                <p id='namedisplay'>{name}</p>
                            </div>
                        )
                    }

                    {/* user or guest score board */}
                    <div id="displayscore">
                        <div className="divtitle">
                            <span>Puzzles</span>
                        </div>
                        <div>
                            <span className="spaninfo">completed: </span>
                            <span className="spandata">{puzcompleted}</span>
                        </div>
                        {user == "user"
                            ? (
                                <div>
                                    <span className="spaninfo">created: </span>
                                    <span className="spandata">{puzcreated}</span>
                                </div>
                            ) : (
                                <div>
                                    <span className="spaninfo guestline" onClick={() => {
                                        setquitting(true)
                                        if (user == "user") {
                                            UserSocket.close()
                                        }
                                        setwhere("login")
                                    }}>Login to Create</span>
                                </div>
                            )
                        }
                        <div className="divtitle">
                            <span>Score</span>
                        </div>
                        <div>
                            <span className="spaninfo">earned: </span>
                            <span className="spandata">{puzscore}</span>
                        </div>
                    </div>

                    {/* user or guest ranking */}
                    <div id="rankingcontrol">
                        <span id='showspan'>sort by: </span>
                        <div id='selectpanelprof'>
                            <span id='showbut'>{rankord}</span>
                            <div className='innercontent'>
                                <span id='profselectfirst' onClick={() => newrankord('Score')}>Score</span>
                                <span onClick={() => newrankord('Puzzle Solved')}>Puzzle Solved</span>
                                <span onClick={() => newrankord('Puzzle Created')} id='profselectend'>Puzzle Created</span>
                            </div>
                        </div>
                    </div>
                    <div id="ranking">
                        {user == "user"
                            ? <Rankingtypelabel changetype={changetype} ranktype={ranktype} />
                            : (
                                <div id="rankingtype" className="guestranking">
                                    <span style={{ backgroundColor: '#2A2622', color: 'bisque' }}>TOP RANKING</span>
                                </div>
                            )
                        }
                        <div id="rankinglabel">
                            <span id='firstinline'>User</span>
                            <span>Score</span>
                            <span>Created</span>
                            <span>Solved</span>
                        </div>
                        <div id="rankingcontent">
                            <Rankingcontent setwhere={setwhere} setquitting={setquitting} UserSocket={UserSocket} user={user} name={name} ranktype={ranktype} top={top} topover={topover} userover={userover} userrank={userrank}  moreup={moreup} moredown={moredown}  />
                        </div>
                    </div>
                    <Changelog user={user} setwhere={setwhere} setquitting={setquitting} UserSocket={UserSocket}  />
                </div>

                <div id='rightside'>
                    <div id='boardheader'>

                        {/* puzzle catagorys */}
                        {user == "user"
                            ? (
                                <span id="catagory">
                                    <div className="dashbutrow">
                                        {curcontent == 0 ? (
                                            <span style={{ backgroundColor: '#2A2622' }}>Available Puzzles</span>
                                        ) : (
                                            <span onClick={() => changecata(0)}>Available Puzzles</span>
                                        )}
                                        {curcontent == 1 ? (
                                            <span style={{ backgroundColor: '#2A2622' }}>Puzzles in Progress</span>
                                        ) : (
                                            <span onClick={() => changecata(1)}>Puzzles in Progress</span>
                                        )}
                                        {curcontent == 2 ? (
                                            <span style={{ backgroundColor: '#2A2622' }}>Completed Puzzles</span>
                                        ) : (
                                            <span onClick={() => changecata(2)}>Completed Puzzles</span>
                                        )}
                                    </div>
                                    <div className="dashbutrow">
                                        {curcontent == 3 ? (
                                            <span style={{ backgroundColor: '#2A2622' }}>Create New</span>
                                        ) : (
                                            <span onClick={() => changecata(3)}>Create New</span>
                                        )}
                                        {curcontent == 4 ? (
                                            <span style={{ backgroundColor: '#2A2622' }}>Created Puzzle</span>
                                        ) : (
                                            <span onClick={() => changecata(4)}>Created Puzzle</span>
                                        )}
                                        {curcontent == 5 ? (
                                            <span style={{ backgroundColor: '#2A2622' }}>Liked</span>
                                        ) : (
                                            <span onClick={() => changecata(5)}>Liked</span>
                                        )}
                                    </div>
                                </span>
                            ) : (
                                <span id="catagory">
                                    <div className="dashbutrow guestcata">
                                        {curcontent == 0 ? (
                                            <span style={{ backgroundColor: '#2A2622' }}>Available Puzzles</span>
                                        ) : (
                                            <span onClick={() => changecata(0)}>Available Puzzles</span>
                                        )}
                                        {curcontent == 1 ? (
                                            <span style={{ backgroundColor: '#2A2622' }}>Puzzles in Progress</span>
                                        ) : (
                                            <span onClick={() => changecata(1)}>Puzzles in Progress</span>
                                        )}
                                        {curcontent == 2 ? (
                                            <span style={{ backgroundColor: '#2A2622' }}>Completed Puzzles</span>
                                        ) : (
                                            <span onClick={() => changecata(2)}>Completed Puzzles</span>
                                        )}
                                    </div>
                                </span>
                            )
                        }

                        {/* sorting orders */}
                        <span id="sort">
                            <span id='sortcell'>
                                <div id='top'>sort by: </div>
                                <div id='outter'>
                                    {curcontent == 1
                                        ? (
                                            <div id='bottom' onMouseLeave={() => { document.getElementById('listcontent').style.bottom = '0%' }} onMouseOver={() => { document.getElementById('listcontent').style.bottom = (-72 * 5).toString().concat('%') }}>
                                                <Currentsortorder cursort={cursort} curcontent={curcontent} />
                                                <div className='innercontent' id='listcontent'>
                                                    {sortlistdisplay}
                                                </div>
                                            </div>
                                        ) : curcontent == 3
                                            ? (
                                                <div id='bottom'>
                                                    <Currentsortorder cursort={cursort} curcontent={curcontent} />
                                                    <div className='innercontent' id='listcontent'>
                                                        {sortlistdisplay}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div id='bottom' onMouseLeave={() => { document.getElementById('listcontent').style.bottom = '0%' }} onMouseOver={() => { document.getElementById('listcontent').style.bottom = (-72 * 4).toString().concat('%') }}>
                                                    <Currentsortorder cursort={cursort} curcontent={curcontent} />
                                                    <div className='innercontent' id='listcontent'>
                                                        {sortlistdisplay}
                                                    </div>
                                                </div>
                                            )
                                    }
                                    <span id='orderbutt'>
                                        <KeyboardDoubleArrowUp id='asd' onClick={() => changesd()} className="lineIcon" />
                                        <KeyboardDoubleArrowDown id='dsd' onClick={() => changesd()} className="lineIcon" />
                                    </span>
                                </div>
                            </span>
                        </span>

                        {/* searchbar */}
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

                    {/* puzzle gallery */}
                    <div id='board'>
                        <Displayimg setalllike={setalllike}curpuz={curpuz} user={user} setwhere={setwhere} setquitting={setquitting} changedisplay={changedisplay} UserSocket={UserSocket} display={display} displaypage={displaypage} setnoreturnline={setnoreturnline} noreturnline={noreturnline} nopuz={nopuz} curpage={curpage} searchres={searchres} setcurpuz={setcurpuz} curcontent={curcontent} cursort={cursort}/>
                    </div>
                </div>
            </div>

            <div id='space'>

                {/* change new username penal */}
                <div id='usernc'>
                    <h1>WHAT IS YOUR NEW USERNAME</h1>
                    <TextField onChange={(e) => handlenamechange(e)} id='changingname' defaultValue={name} placeholder="name" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { display: 'inline', paddingLeft: '5px', fontSize: 30, marginLeft: '25px', width: '365px', borderRadius: '5px', borderStyle: 'solid', borderColor: '#2A2622', borderWidth: '4px' } }} onInput={(e) => { e.target.value = e.target.value.toString().slice(0, 20) }} />
                    <button onClick={() => changeusername( UserSocket )} className="savebutton">SUBMIT</button>
                    <button onClick={() => goback()} className="savebutton">CANCEL</button>
                </div>

                {/* the username change confirm penal */}
                <div id='usernameconfirm'>
                    <h1>YOUR USERNAME HAS BEEN CHANGED</h1>
                    <button onClick={() => goback()} className="savebutton">COOL</button>
                </div>

                {/* change user profile picture penal */}
                <div id='userpp'>
                    <h1>WHAT IS YOUR NEW PROFILE PICTURE</h1>
                    <div id='imagesection'>
                        <ReactCrop id='cropdiv' crop={crop} circularCrop aspect={1} keepSelection minWidth={10} onChange={c => setCrop(c)}>
                            <img id='imagenewprof' onLoad={() =>  newcrop() } src={profpic} style={{ display: 'block' }} />
                        </ReactCrop>
                    </div>
                    <button className="savebutton allLinesave" onClick={() => document.getElementById('imageinput').click()}>SEARCH FROM COMPUTER</button>
                    <input type="file" id='imageinput' onChange={(e) => showimage(e)} accept="image/*" />
                    <button onClick={() => profpicchange(crop)} className="savebutton">SUBMIT</button>
                    <button onClick={() => goback()} className="savebutton">QUIT</button>
                </div>

                {/* the user profile picture change confirm penal */}
                <div id='ppconfirm'>
                    <h1>YOUR PROFILE PICTURE HAS CHANGED</h1>
                    <button onClick={() => goback()} className="savebutton allLinesave">COOL</button>
                </div>
            </div>

            {/* the puzzle detail penal */}
            <div id="detail">
                <Detaildisplay setcurpage={setcurpage} setdisplaypage={setdisplaypage} setdisplay={setdisplay} setnopuz={setnopuz} curpage={curpage} searchres={searchres} curcontent={curcontent} cursort={cursort}     UserSocket={UserSocket} messagepop={messagepop} where={where} setwhere={setwhere} quitting={quitting} setquitting={setquitting} setalllike={setalllike} alllike={alllike} allcreate={allcreate} allcomp={allcomp} curpuz={curpuz} user={user} />
            </div>

            {/* the pop up warning message */}
            <div>
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

            {/* page transition animation */}
            <div id="transitionin"></div>
            <div id="transitionout"></div>
        </div>

    )
}

/**
* create the login / logout button depending on if the user is a guest
*
* @param  user - a value showing whether the user is a guest 
* @param  UserSocket - a web socket used to change profile pic and username in real time
*
* @return the login / logout button 
*/
function Changelog({ user, setwhere,setquitting, UserSocket }) {
    
    /**
    * handle clicking the login / logout button is clicked
    *
    * @param  where - the page the user will be redirected to once the login / logout button is clicked
    *
    * @return the login / logout button 
    */
    function leave(where) {
        document.getElementById('transitionout').classList.add('outswipe')
        setTimeout(() => {
            if (where == "start") {
                fetch('http://127.0.0.1:8000/backend/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                    })
                })
                setquitting(true)
                if (user == "user") {
                    UserSocket.close()
                }
                setwhere("start")
            } else {
                setquitting(true)
                if (user == "user") {
                    UserSocket.close()
                }
                setwhere("login")
            }
        }, 500);
    }

    //create the the login / logout button
    if (user == 'guest') {
        return <div className='logbut' onClick={() => leave("login")}>Login</div>
    } else {
        return <div className='logbut' onClick={() => leave("start")}>Logout</div>
    }
}

/**
* create the user's ranking penal
*
* @param  user - a value showing whether the user is a guest 
* @param  name - name of the user
* @param  ranktype - current type of the users' ranking (top users' ranking, or ranking around the current user)
* @param  top - current list of user on the top ranking
* @param  topover - whether the lowest ranked user is displayed, the highest ranked user is displayed, neither, or all the user is displayed for the top ranking
* @param  userover - whether the lowest ranked user is displayed, the highest ranked user is displayed, neither, or all the user is displayed for the currentuser ranking
* @param  userrank - current list of user on the user ranking
* @param  UserSocket - a web socket used to change profile pic and username in real time
*
* @return the user's ranking penal
*/
function Rankingcontent({ setwhere,setquitting, UserSocket, user, name, ranktype, top, topover, userover, userrank, moreup, moredown }) {
    
    //set the ranking list
    var userortop = userrank
    if (ranktype == 'top') {
        userortop = top
    }


    
    const rankelementmap = userortop.map((data, index) => {

        //find the font size to use to display username
        var fontsize = ''
        if (data[0].length / 10 < 1) {
            fontsize = '8px'
        } else {
            fontsize = '6px'
        }

        //simplify the display value for the number of puzzle completed of the user on the ranking so it dose not take up too much space
        var puzcompleted = '0';
        if (data[4] > 1000) {
            puzcompleted = Math.round(data[4] / 1000).toString().concat('k')
        } else if (data[4] > 1000000) {
            puzcompleted = Math.round(data[4] / 1000000).toString().concat('m')
        } else if (data[4] > 1000000000) {
            puzcompleted = Math.round(data[4] / 1000000000).toString().concat('b')
        } else {
            puzcompleted = data[4].toString()
        }

        //simplify the display value for the number of puzzle created of the user on the ranking so it dose not take up too much space
        var puzcreated = '0';
        if (data[3] > 1000) {
            puzcreated = Math.round(data[3] / 1000).toString().concat('k')
        } else if (data[3] > 1000000) {
            puzcreated = Math.round(data[3] / 1000000).toString().concat('m')
        } else if (data[3] > 1000000000) {
            puzcreated = Math.round(data[3] / 1000000000).toString().concat('b')
        } else {
            puzcreated = data[3].toString()
        }

        //simplify the display value for the total score of the user on the ranking so it dose not take up too much space
        var puzscore = '0';
        if (data[2] > 1000) {
            puzscore = Math.round(data[2] / 1000).toString().concat('k')
        } else if (data[2] > 1000000) {
            puzscore = Math.round(data[2] / 1000000).toString().concat('m')
        } else if (data[2] > 1000000000) {
            puzscore = Math.round(data[2] / 1000000000).toString().concat('b')
        } else {
            puzscore = data[2].toString()
        }

        //simplify the display value for the ranking of the user on the ranking so it dose not take up too much space
        var rankingind = '0';
        if (data[5] + 1 > 1000) {
            rankingind = Math.round(data[5] / 1000).toString().concat('k')
        } else if (data[5] + 1 > 1000000) {
            rankingind = Math.round(data[5] / 1000000).toString().concat('m')
        } else if (data[5] + 1 > 1000000000) {
            rankingind = Math.round(data[5] / 1000000000).toString().concat('b')
        } else {
            rankingind = (data[5] + 1).toString()
        }

        //play the inswipe animation to show the page when everything is done loading
        if (index == userortop.length - 1) {
            document.getElementById('transitionin').classList.add('inswipe')
        }

        //create the ranking contents
        if (user == "guest" || data[0] != name) {
            if (ranktype == 'top' && topover == 'alldisplayed' && rankingind == top.length || ranktype == 'user' && userover == 'alldisplayed' && rankingind == userrank.length || ranktype == 'user' && userover == 'downdisplayed' && rankingind == userrank.length) {
                return (
                    <div key={'userrank'.concat(rankingind)} className="rankingelement" onClick={()=>{
                        setquitting(true)
                        if (user == "user") {
                            UserSocket.close()
                        }
                        setwhere(data[0])
                    }} style={{ borderWidth: '0px' }}>
                        <span className="indexinranking">{rankingind}</span>
                        <span className="rankingimgspace"><img src={data[1]} className="rankingimg" /></span>
                        <span className="nameinranking" style={{ fontSize: fontsize }}><p>{data[0]}</p></span>
                        <span className="scoreinranking">{puzscore}</span>
                        <span className="createdinranking">{puzcreated}</span>
                        <span className="completedinranking">{puzcompleted}</span>
                    </div>
                )
            } else {
                return (
                    <div key={'userrank'.concat(rankingind)} className="rankingelement" onClick={()=>{
                        setquitting(true)
                        if (user == "user") {
                            UserSocket.close()
                        }
                        setwhere(data[0])
                    }}>
                        <span className="indexinranking">{rankingind}</span>
                        <span className="rankingimgspace"><img src={data[1]} className="rankingimg" /></span>
                        <span className="nameinranking" style={{ fontSize: fontsize }}><p>{data[0]}</p></span>
                        <span className="scoreinranking">{puzscore}</span>
                        <span className="createdinranking">{puzcreated}</span>
                        <span className="completedinranking">{puzcompleted}</span>
                    </div>
                )
            }
        } else {
            if (ranktype == 'top' && topover == 'alldisplayed' && rankingind == top.length || ranktype == 'user' && userover == 'alldisplayed' && rankingind == userrank.length || ranktype == 'user' && userover == 'downdisplayed' && rankingind == userrank.length) {
                return (
                    <div key={'userrank'.concat(rankingind)} className="rankingelement" style={{ backgroundColor: '#2A2622', borderWidth: '0px' }}>
                        <span className="indexinranking" style={{ color: 'bisque' }}>{rankingind}</span>
                        <span className="rankingimgspace"><img id="userpicele" src={data[1]} className="rankingimg" /></span>
                        <span className="nameinranking" style={{ fontSize: fontsize }}><p id="usernameele">{data[0]}</p></span>
                        <span className="scoreinranking">{puzscore}</span>
                        <span className="createdinranking">{puzcreated}</span>
                        <span className="completedinranking">{puzcompleted}</span>
                    </div>
                )
            } else {
                return (
                    <div key={'userrank'.concat(rankingind)} className="rankingelement" style={{ backgroundColor: '#2A2622' }}>
                        <span className="indexinranking" style={{ color: 'bisque' }}>{rankingind}</span>
                        <span className="rankingimgspace"><img id="userpicele" src={data[1]} className="rankingimg" /></span>
                        <span className="nameinranking" style={{ fontSize: fontsize }}><p id="usernameele">{data[0]}</p></span>
                        <span className="scoreinranking">{puzscore}</span>
                        <span className="createdinranking">{puzcreated}</span>
                        <span className="completedinranking">{puzcompleted}</span>
                    </div>
                )
            }
        }
    })

    //add buttons that allow displayed ranking content to be expanded
    if (ranktype == 'top') {
        if (topover == 'alldisplayed') {
            return (
                <div className="allrankingelement">
                    <div className="contentrankelement">
                        {rankelementmap}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="allrankingelement">
                    <div className="contentrankelement">
                        {rankelementmap}
                    </div>
                    <div className="moredown" onClick={() => moredown()}>
                        <KeyboardDoubleArrowDown className="rankicon" />
                    </div>
                </div>
            )
        }
    } else {
        if (userover == 'alldisplayed') {
            return (
                <div className="allrankingelement">
                    <div className="contentrankelement">
                        {rankelementmap}
                    </div>
                </div>
            )
        } else if (userover == 'updisplayed') {
            return (
                <div className="allrankingelement">
                    <div className="contentrankelement">
                        {rankelementmap}
                    </div>
                    <div className="moredown" onClick={() => moredown()}>
                        <KeyboardDoubleArrowDown className="rankicon" />
                    </div>
                </div>
            )
        } else if (userover == 'downdisplayed') {
            return (
                <div className="allrankingelement">
                    <div className="moreup" onClick={() => moreup()}>
                        <KeyboardDoubleArrowUp className="rankicon" />
                    </div>
                    <div className="contentrankelement">
                        {rankelementmap}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="allrankingelement">
                    <div className="moreup" onClick={() => moreup()}>
                        <KeyboardDoubleArrowUp className="rankicon" />
                    </div>
                    <div className="contentrankelement">
                        {rankelementmap}
                    </div>
                    <div className="moredown" onClick={() => moredown()}>
                        <KeyboardDoubleArrowDown className="rankicon" />
                    </div>
                </div>
            )
        }
    }
}

/**
* create the button for changeing the type of ranking
*
* @param  ranktype - current type of the users' ranking (top users' ranking, or ranking around the current user)
*
* @return ranking type buttons
*/
function Rankingtypelabel({ changetype, ranktype }) {
    if (ranktype == 'top') {
        return (
            <div id="rankingtype">
                <span style={{ backgroundColor: '#2A2622', color: 'bisque' }}>TOP RANKING</span>
                <span onClick={() => changetype('user')}>MY RANKING</span>
            </div>
        )
    } else {
        return (
            <div id="rankingtype">
                <span onClick={() => changetype('top')}>TOP RANKING</span>
                <span style={{ backgroundColor: '#2A2622', color: 'bisque' }}>MY RANKING</span>
            </div>
        )
    }
}
