import React from "react";
import './styles/Home.scss'
import { v4 as uuidV4 } from "uuid";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [roomID, setRoomID] = useState('');
    const [userName, setUserName] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomID(id);
        toast.success('Room generated Successfully!', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
        });
    }
    return (
        <div className="homePageWrapper">
            <div className="logo">
                <div className="header-left">
                    <img className="header-logo" src="/logo.png" alt="img" />
                    <h3 className="logo-name">ScriptSmith</h3>
                </div>

                <div className="header-right">
                    <button className="login-button"><i className="icon fa-solid fa-arrow-right-to-bracket"></i> Login</button>
                    <button className="github-button"><i className="icon fa-brands fa-github"></i> GitHub</button>
                </div>
            </div>

            <div className="formWrapper">
                <div className="card">
                    <div className="cardHead">
                        <div className="cardTitle">Create Room</div>
                    </div>
                    <div className="cardBody">
                        <h4 className="main-label">
                            Paste Invitation Room ID
                        </h4>
                        <div className="inputGroup">
                            <input
                                type="text"
                                placeholder="Room ID:"
                                className="inputBox"
                                onChange={(e) => setRoomID(e.target.value)}
                                value={roomID}
                            />
                            <input
                                type="text"
                                placeholder="User Name:"
                                className="inputBox"
                                onChange={(e) => setUserName(e.target.value)}
                                value={userName}
                            />
                            <button className="join-button">Join</button>
                            <span className="create-info">
                                If you don't have an invite then create &nbsp;
                                <a onClick={createNewRoom} href="#" className="createNewBtn">new room</a>
                            </span>
                        </div>
                    </div>
                </div>
                <p className="footer-text">Created with &nbsp;❤️&nbsp; by <a target="_blank" href="https://github.com/sahilk-027"> SahilK-027 </a> </p>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover
                theme="dark"
            />
        </div>
    )
};

export default Home;