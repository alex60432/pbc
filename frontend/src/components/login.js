import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Box, Card, CardContent, Slide, TextField } from "@mui/material";
import { Email, Person, VpnKey, Send } from "@material-ui/icons";
import { Snackbar } from "@mui/material";
import { Close } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";

/**
* retrieve the login page
* 
* @return the login page
*/
export default function Login() {
    return <MainPanel />
}

/**
* create the login page
* 
* @return the login page
*/
function MainPanel() {

    const navigate = useNavigate();
    const [time, setTime] = useState(-1);
    var id = useRef();
    const [emailchecked, setemail] = useState('')
    const [codechecked, setcode] = useState('')
    const [message, setmessage] = useState('')
    const [open, setopen] = useState(false);
    const [data, setdata] = useState({
        username: '',
        email: '',
        password: '',
        repassword: '',
        varnum: ''
    });
    const [pass, setpass] = useState({
        email: '',
        password: '',
        repassword: '',
        varnum: ''
    });
    const [logdata, setlogdata] = useState({
        email: '',
        password: '',
    });
    const [page, setPage] = useState(0);

    //continuiously decrease time on a counter, this is works as a timer
    useEffect(() => {
        id.cur = setTimeout(() => {
            setTime(time - 1);
        }, 1000);
        return () => clearInterval(id.cur);
    });

    /**
    * clear all field and go to the forgot password page
    */
    function p2() {
        setTime(-1);
        setcode('');
        setemail('');
        setPage(2);
        setdata({
            username: '',
            email: '',
            password: '',
            repassword: '',
            varnum: ''
        })
        setpass({
            email: '',
            password: '',
            repassword: '',
            varnum: ''
        })
        setlogdata({
            email: '',
            password: '',
        })
    }

    /**
    * send a verification email to the email address user entered, 
    * also start a 60 second timer so that the user can not send another messange until the count done is finished
    */
    function send() {

        //make sure the user has entered a valid email before sending
        if (!checkemailValid()) {
            messagepop('Please use a valid email')
        } else {
            //make sure the countdown time has finished counting down and another message can be sent
            if (time >= 0) {
                messagepop('Be patient, a code have already been sent to your email')
            } else {

                //set a new 60 second timer
                setTime(60);
                var email
                if (page == 1) {
                    email = data.email;
                } else {
                    email = pass.email;
                }

                //send the email
                fetch('http://127.0.0.1:8000/backend/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                    })
                }).then((Response) => Response.json()).then((data) => setcode(data))
                setemail('' + (email))

                //tell the user to retrive the verification code in the email sent
                messagepop('Please check your email or spam, a code have been sent')
            }
        }
    }

    /**
    * check if the input in the email field follow the email format using regex
    */
    function checkemailValid() {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (page == 1) {
            return pattern.test(data.email);
        } else if (page == 0) {
            return pattern.test(logdata.email);
        } else {
            return pattern.test(pass.email);
        }
    }

    /**
    * clear all field and go to the register page
    */
    function p1() {
        setTime(-1);
        setcode('');
        setemail('');
        setPage(1);
        setdata({
            username: '',
            email: '',
            password: '',
            repassword: '',
            varnum: ''
        })
        setpass({
            email: '',
            password: '',
            repassword: '',
            varnum: ''
        })
        setlogdata({
            email: '',
            password: '',
        })

    }

    /**
    * clear all field and go to the login page
    */
    function p0() {
        setTime(-1);
        setcode('');
        setemail('');
        setPage(0);
        setdata({
            username: '',
            email: '',
            password: '',
            repassword: '',
            varnum: ''
        })
        setpass({
            email: '',
            password: '',
            repassword: '',
            varnum: ''
        })
        setlogdata({
            email: '',
            password: '',
        })

    }

    /**
    * handle changes in the text field
    */
    function handle(e) {
        //handle changes in register page
        if (page == 1) {
            const newd = { ...data }
            newd[e.target.id] = e.target.value
            setdata(newd)

            //handle changes in login page
        } else if (page == 0) {
            const newld = { ...logdata }
            newld[e.target.id] = e.target.value
            setlogdata(newld)

            //handle changes in forget password page
        } else {
            const newpd = { ...pass }
            newpd[e.target.id] = e.target.value
            setpass(newpd)
        }
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
    * check input for forget password page and, if all is correct, update the password
    */
    function submitpass() {
        var email = pass.email;
        var password = pass.password;
        var varnum = pass.varnum;
        var repassword = pass.repassword;

        //checking the email
        if (!checkemailValid()) {
            messagepop('Please use a valid email')
        } else {
            if (email != emailchecked) {
                messagepop('Please use the verified email')
            } else {

                //check the verification number
                if (varnum == '') {
                    messagepop('Please enter a verification code')
                } else {
                    if (varnum != codechecked) {
                        messagepop('Verification code is wrong')
                    } else {

                        //check the password
                        if (password != repassword) {
                            messagepop('Two password entry are not the same')
                        } else {
                            if (password == '') {
                                messagepop('Password can not be empty')
                            } else {

                                //check if the email have a account, if not, print a error message in a pop up,
                                //if true, update the password
                                var ret
                                fetch('http://127.0.0.1:8000/backend/check', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        email: email,
                                    })
                                }).then((Response) => Response.json()).then((data) => {

                                    //update the password
                                    ret = data
                                    if (ret == true) {
                                        fetch('http://127.0.0.1:8000/backend/change', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                password: password,
                                                email: email,
                                            })
                                        })
                                        messagepop('Password changed successfully')
                                        p0()
                                    } else {

                                        //print a error message in a pop up if user do not have a account
                                        messagepop('An account associated with the email do not exists')
                                    }
                                })
                            }
                        }
                    }
                }
            }
        }
    }

    /**
    * check input for login page and, if all is correct, log the user in
    */
    function submitlog() {
        var email = logdata.email;
        var password = logdata.password;
        //check if email and password are empty and valid
        if (email == '') {
            messagepop('Please enter your email')
        } else {
            if (password == '') {
                messagepop('Please enter your password')
            } else {
                if (!checkemailValid()) {
                    messagepop('Please enter a valid email')
                } else {

                    //if nothing is wrong, varify the inputed information
                    fetch('http://127.0.0.1:8000/backend/logval', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }).then((Response) => Response.json()).then((data) => {

                        //output a error if passwird do not metch the email
                        if (data == false) {
                            messagepop('Email or password incorrect')
                        } else {

                            //add a user name cookie for future use
                            fetch('http://127.0.0.1:8000/backend/addusercookie', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    userid: data,
                                })
                            }).then(() => {

                                //go to the user dashboard
                                document.getElementById('transitionout').classList.add('outswipe')
                                setTimeout(() => {
                                    navigate("/paint/dash/")
                                }, 500);
                            })
                        }
                    })
                }
            }
        }
    }

    /**
    * check input for register page and, if all is correct, create a user
    */
    function submitreg() {
        setopen(false)
        var username = data.username;
        var email = data.email;
        var password = data.password;
        var varnum = data.varnum;
        var repassword = data.repassword;

        //check the username
        if (username == '') {
            messagepop('Username can not be empty')
        } else {

            //check the password
            if (password != repassword) {
                messagepop('Two password entry are not the same')
            } else {
                if (password == '') {
                    messagepop('Password can not be empty')
                } else {

                    //check the email
                    if (!checkemailValid()) {
                        messagepop('Please use a valid email')
                    } else {
                        if (email != emailchecked) {
                            messagepop('Please use the verified email')
                        } else {

                            //check the verification number
                            if (varnum == '') {
                                messagepop('Please enter a verification code')
                            } else {
                                if (varnum != codechecked) {
                                    messagepop('Verification code is wrong')
                                } else {

                                    //check if the user already have a account
                                    var ret
                                    fetch('http://127.0.0.1:8000/backend/check', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            email: email,
                                        })
                                    }).then((Response) => Response.json()).then((data) => {
                                        ret = data
                                        if (ret != false) {
                                            messagepop('An account associated with the email already exists')
                                        } else {

                                            //check if the user name is taken, if not, add the user
                                            fetch('http://127.0.0.1:8000/backend/add', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    username: username,
                                                    password: password,
                                                    email: email,
                                                })
                                            }).then((Response) => Response.json()).then((data) => {
                                                if (data != false) {
                                                    messagepop('Account successfully created')
                                                    p0()
                                                } else {
                                                    messagepop('Username is already taken')
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            }
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
            <button id="popbut" aria-label="close" onClick={handleClose}>
                <Close id="popic" />
            </button>
        </React.Fragment>
    );

    //animate a a swipe in effect upon loading in the page
    if (document.getElementById('transitionin') != null) {
        document.getElementById('transitionin').classList.add('inswipe')
    }

    return (

        //create the page and all of its components 
        <div id="allcomplogin">
            <div id='overgrid'>
                <div id='renderover'></div>

                {/* the background */}
                <iframe id='render' src='../background'></iframe>
                <div id="tableview">
                    <Box id="loginBox">

                        {/* the central penal that takes user input(include login, register and forget password penal ) */}
                        <Card id="logCard" variant="outlined">
                            <CardContent>
                                <Nav submitpass={submitpass} submitlog={submitlog} time={time} send={send} submitreg={submitreg} handle={handle} data={data} page={page} p0={p0} p1={p1} p2={p2} />
                            </CardContent>
                        </Card>
                    </Box>
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
            </div>

            {/* animate page navigation */}
            <div id="transitionin"></div>
            <div id="transitionout"></div>
        </div>
    );
}

/**
* create a timer toshow after sending a verification code
* 
* @param  time - the time remaining on the timer
*/
function Timer({ time }) {
    if (time < 0) {
        return <Send className="buttonIcon lineIcon" />
    } else {
        return <h1 className="countdown">{time}</h1>;
    }
}

/**
* handle leave, submit, and exit
*
* @param  time - the time being counted down on the timer
* @param  page - an id indicating which of the penals (login, register, and forget password) the user is in
* @param  data - the information user entered(passwords, verification code, email, username)
*
* @return the correct penal to show 
*/
function Nav({ submitlog, submitpass, time, submitreg, send, page, data, handle, p0, p1, p2 }) {
    if (page == 0) {
        return <Log submitlog={submitlog} submitreg={submitreg} handle={handle} data={data} p1={p1} p2={p2} />;
    } else if (page == 1) {
        return <Reg time={time} send={send} submitreg={submitreg}handle={handle} data={data} p0={p0} />;
    } else {
        return <Reset submitpass={submitpass} time={time} send={send} submitreg={submitreg} handle={handle} data={data} p0={p0} p1={p1} />;
    }
}

/**
* create the register penal, include text input for username, email, password, verification code, and button to return to login penal
*
* @param  time - the time being counted down on the timer
* @param  data - the information user entered(passwords, verification code, email, username)
*
* @return register page penal
*/
function Reg({ time, send, submitreg, handle, p0, data }) {
    return (
        <div>
            <h1>REGISTER</h1>
            <div className='loginput'>
                <span><Person className="lineIcon" /></span>
                <span><TextField onChange={(e) => handle(e)} id='username' defaultValue={data.username} className="lineInput username" placeholder="Username" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { paddingLeft: '5px', fontSize: 45 } }} onInput={(e) => { e.target.value = e.target.value.toString().slice(0, 20) }} /></span>
            </div>
            <div className='loginput'>
                <span><Email className="lineIcon" /></span>
                <span><TextField onChange={(e) => handle(e)} id='email' defaultValue={data.email} className="lineInput email" placeholder="Email" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { paddingLeft: '5px', fontSize: 45 } }} /></span>
            </div>
            <div className='loginput'>
                <span><VpnKey className="lineIcon" /></span>
                <span><TextField onChange={(e) => handle(e)} id='password' defaultValue={data.password} type="password" className="lineInput password" placeholder="Password" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { paddingLeft: '5px', fontSize: 45 } }} /></span>
            </div>
            <div className='loginput'>
                <span><VpnKey className="lineIcon" /></span>
                <span><TextField onChange={(e) => handle(e)} id='repassword' defaultValue={data.repassword} className="lineInput" type="password" placeholder="Confirm Password" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { paddingLeft: '5px', fontSize: 45 } }} /></span>
            </div>
            <div className='loginput'>
                <span><TextField onChange={(e) => handle(e)} id='varnum' defaultValue={data.varnum} className="lineInput onleft" placeholder="6 Diget Code" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { paddingLeft: '5px', fontSize: 45 } }} onInput={(e) => { e.target.value = e.target.value.toString().slice(0, 6) }} /></span>
                <span ><button onClick={() => send()} className="lineButton"><Timer time={time} /></button></span>
            </div>
            <div className='loginput'>
                <span><button onClick={() => submitreg()} className="lineButton allLine">Submit</button></span>
            </div>
            <div className='loginput final' >
                <span><button onClick={() => p0()} className="lineButton allLine">I Already Have An Account</button></span>
            </div>
        </div>
    );
}

/**
* create the login penal, include text input for email, password, and button to go to register penal and forget password penal
*
* @param  data - the information user entered(passwords, verification code, email, username)
*
* @return login page penal
*/
function Log({ submitlog, handle, p1, p2, data }) {
    return (
        <div>
            <h1>LOGIN</h1>
            <div className='loginput'>
                <span><Person className="lineIcon" /></span>
                <span><TextField onChange={(e) => handle(e)} id='email' defaultValue={data.email} className="lineInput" placeholder="Email" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { paddingLeft: '5px', fontSize: 45 } }} /></span>
            </div>
            <div className='loginput'>
                <span><VpnKey className="lineIcon" /></span>
                <span><TextField onChange={(e) => handle(e)} id='password' defaultValue={data.password} type="password" className="lineInput" placeholder="Password" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { paddingLeft: '5px', fontSize: 45 } }} /></span>
            </div>
            <div className='loginput'>
                <span><button onClick={() => p2()} className="lineButton allLine">Forgot Password</button></span>
            </div>
            <div className='loginput'>
                <span><button onClick={() => submitlog()} className="lineButton allLine">Submit</button></span>
            </div>
            <div className='loginput final' >
                <span><button onClick={() => p1()} className="lineButton allLine">I Don't Have An Account</button></span>
            </div>
        </div>
    );
}

/**
* create the forget password penal, include text input for email, password, verification code, and button to go to register penal and login penal
*
* @param  time - the time being counted down on the timer
* @param  data - the information user entered(passwords, verification code, email, username)
*
* @return forget password  page penal
*/
function Reset({ submitpass, time, send, handle, p0, p1, data }) {
    return (
        <div>
            <h1>NEW PASSWORD</h1>
            <div className='loginput'>
                <span><Email className="lineIcon" /></span>
                <span><TextField onChange={(e) => handle(e)} id='email' defaultValue={data.email} className="lineInput" placeholder="email" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { paddingLeft: '5px', fontSize: 45 } }} /></span>
            </div>
            <div className='loginput'>
                <span><TextField onChange={(e) => handle(e)} id='varnum' defaultValue={data.varnum} className="lineInput onleft" placeholder="6 Diget Code" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { paddingLeft: '5px', fontSize: 45 } }} onInput={(e) => { e.target.value = e.target.value.toString().slice(0, 6) }} /></span>
                <span><button onClick={() => send()} className="lineButton"><Timer time={time} /></button></span>
            </div>
            <div className='loginput'>
                <span><VpnKey className="lineIcon" /></span>
                <span><TextField onChange={(e) => handle(e)} id='password' defaultValue={data.password} type="password" className="lineInput" placeholder="New Password" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { paddingLeft: '5px', fontSize: 45 } }} /></span>
            </div>
            <div className='loginput'>
                <span><VpnKey className="lineIcon" /></span>
                <span><TextField onChange={(e) => handle(e)} id='repassword' defaultValue={data.password} className="lineInput" type="password" placeholder="Confirm Password" variant="standard" InputProps={{ disableUnderline: true, }} inputProps={{ style: { paddingLeft: '5px', fontSize: 45 } }} /></span>
            </div>
            <div className='loginput'>
                <span><button onClick={() => submitpass()} className="lineButton allLine">Submit</button></span>
            </div>
            <div className='loginput'>
                <span><button onClick={() => p0()} className="lineButton allLine">I Remember My Password</button></span>
            </div>
            <div className='loginput final' >
                <span><button onClick={() => p1()} className="lineButton allLine">I Don't Have An Account</button></span>
            </div>
        </div>
    );
} 
