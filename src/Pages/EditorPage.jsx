import React from "react";
import { useState } from "react";
import Client from "../Components/Client";
import Editor from "../Components/Editor";
import './styles/EditorPage.scss'
import { useRef, useEffect } from "react";
import { initSocket } from "../Socket";
import ACTIONS from "../Actions";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const reactNavigator = useNavigate();
    const { roomId } = useParams();
    const codeRef = useRef(null);

    const [clients, setClients] = useState([
    ]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(err) {
                toast.error('Socket connection failed, try again.', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "dark",
                });
                reactNavigator('/');
            }

            // Sending Event: Someone joining 
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                userName: location.state?.userName
            });


            // Listening Event: Someone joined
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, userName, socketId }) => {
                    if (userName != location.state?.userName) {
                        toast.success(`${userName} joined the room.`, {
                            position: "top-right",
                            autoClose: 1000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                            theme: "dark",
                        });
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId
                    })
                }
            );

            // Listening Event: Someone disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ userName, socketId }) => {
                    toast.info(`${userName} left the room.`, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "dark",
                    });
                    setClients((prev) => {
                        return prev.filter(client => client.socketId !== socketId);
                    });
                }
            );

        }
        init();

        return ()=>{
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
            socketRef.current.disconnect();
        }
    }, [])


    if (!location.state) {
        return <Navigate to='/' />
    }

    async function copyRoomId(){
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success(`roomID copied to clipboard`, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });
        } 
        catch (err) {
            toast.error(`Error! please try again.`, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    function leaveRoom(){
        reactNavigator('/')
    }


    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="aside-inner">
                    <div className="logo">
                        <img className="header-logo" src="/logo.png" alt="img" />
                        <h3 className="logo-name">ScriptSmith</h3>
                    </div>

                    <h3 className="collaborator">Collaborators:</h3>

                    <div className="clientList">
                        {
                            clients.map(client => (
                                <Client key={client.socketId} username={client.userName} />
                            ))
                        }
                    </div>

                </div>
                <div className="button-container">
                    <button className="copy-button" onClick={copyRoomId}>Copy RoomId</button>
                    <button className="leave-button" onClick={leaveRoom}>Leave Room</button>
                </div>

            </div>

            <div className="editorWrap">
                <Editor 
                socketRef = {socketRef} 
                roomId = {roomId} 
                onCodeChange = { (code) =>{
                    codeRef.current = code;
                }}

                />
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
}

export default EditorPage;