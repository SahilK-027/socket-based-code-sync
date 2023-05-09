import React, { useEffect, useRef } from 'react'
import Codemirror from "codemirror";
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/theme/material-palenight.css'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/lib/codemirror.css'

// Code folding
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/comment-fold';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);
    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: {
                        name: 'javascript',
                        json: true
                    },
                    lineNumbers: true,
                    theme: "material-palenight",
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineWrapping: true,
                    autofocus: true,
                    foldGutter: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                    matchBrackets: true,
                    styleSelectedText: true,
                }
            );

            // boilerplate code 
            editorRef.current.setValue(`console.log('Hello Script Smith');`);

            // Listening change event
            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code
                    });
                }
            });

        }
        init();
    }, [])

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code != null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return ()=>{
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        }
    }, [socketRef.current])
    return (
        <div>
            <textarea id="realtimeEditor"></textarea>
        </div>
    )
}

export default Editor