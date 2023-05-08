import React from "react";
import { useState } from "react";
import Client from "../Components/Client";
import Editor from "../Components/Editor";
import './styles/EditorPage.scss'
import { useRef, useEffect } from "react";
import { initSocket } from "../Socket";
import ACTIONS from "../Actions";
import { useLocation } from "react-router-dom";

const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    useEffect(() => {
      const init = async () =>{
        socketRef.current = await initSocket();
        // socketRef.current.emit(ACTIONS.JOIN, {
        //     roomID,
        //     userName: location.state?.userName
        // });
      } 
      init();
    }, [])
    
    const [clients, setClients] = useState([
        { socketId: 1, userName: "Andy R." },
        { socketId: 2, userName: "Viv Richard" },
        { socketId: 3, userName: "Vhkbq hjjhsd jhgs" },
        { socketId: 4, userName: "hjwbsdx" },
        { socketId: 5, userName: "hkwbed h" },
        { socketId: 6, userName: "hjebd" },
    ]);
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
                    <button className="copy-button">Copy RoomId</button>
                    <button className="leave-button">Leave Room</button>
                </div>

            </div>

            <div className="editorWrap">
                <Editor />
            </div>
        </div>
    )
}

export default EditorPage;