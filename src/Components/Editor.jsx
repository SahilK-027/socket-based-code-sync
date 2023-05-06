import React, { useEffect } from 'react'
import Codemirror, { modes } from "codemirror";
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

const Editor = () => {
    useEffect(() => {
        async function init() {
            Codemirror.fromTextArea(
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

            )
        }
        init();
    }, [])
    return (
        <div>
            <textarea id="realtimeEditor">

            </textarea>
        </div>
    )
}

export default Editor