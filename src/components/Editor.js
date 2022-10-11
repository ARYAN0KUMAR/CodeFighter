import React, { useEffect, useRef,useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/python/python';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import './Editor.css'
import ACTIONS from '../Actions';
import axios from "axios";
 

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const [coded , setCode] = useState('');
    const [testCases, setTestCases]= useState([]);
    const editorRef = useRef(null);
    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: "python"},
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                    // onChange: function (cm) {
                    //     console.log(cm.getValue);
                    //     setCode(cm.getValue);
                    //  }
                }
            );

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                setCode(code);
                onCodeChange(code);
                if (origin !== 'setValue') {
                    console.log(coded);
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }
        init();
    }, []);

    console.log(coded);
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                    console.log(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    const submitCode = () => {
     console.log({coded});
        axios.post('http://localhost:80/python', {coded})
    .then(({data}) => {setTestCases([data.passOrFail]);
      });    
      };
    return (
        <>
                <div className='problem'>Create a function that adds two numbers in Python using command line arguments.</div>
        {testCases.map((testCase, i) => {
          return(
          <div key={i}>
            <div>{testCase == 'True' ? '✅ passed' : '❌ failed'}</div>
          </div>);     })}
    <textarea id="realtimeEditor"></textarea>
       <div className=' submit border-2 bg-green-500' onClick={submitCode} >Submit</div>

          {/* <div className='submit border-2 bg-green-500'>Submit</div> */}
        </>
 );
};

export default Editor;
