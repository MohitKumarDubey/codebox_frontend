import React, { useEffect, useState } from 'react';
import './App.css';
import Directory from "./components/common/directory/directory"
import AceEditor from "react-ace";
import TerminalComponent from "./components/Terminal/terminal";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useSelector, useDispatch } from 'react-redux';
// socket io
import { io } from 'socket.io-client';
// Replace with your server URL
const SOCKET_SERVER_URL = 'http://localhost:8000';
//---




function App() {

  const dispatch = useDispatch();

  const data = useSelector((state) => {
    return state;
  });

  const [socket, setSocket] = useState(null);
  const [commands, setCommand] = useState('');
  

  function handlerFunction(cmd){
    const commands = {
    };
    commands[cmd] = "hi Output"
    setCommand(commands);
  }


  function onBlur(e){
    socket.emit('writeInFile',{
      path : data?.fileData?.path || null,
      content : data?.fileData?.content || ''
    })
  }

  function onChange(newValue) {
    dispatch({ type: 'SET_FILE_DATA', payload: {
      fileName: data?.fileData?.name || '',
      content : newValue,
      path : data?.fileData?.path || null
    }});
    console.log("change", newValue);
  }

  

  useEffect(() => {
    // Establish connection to the server
    const socket = io(SOCKET_SERVER_URL);
    setSocket(socket);
    // Clean up on component unmount
    return () => socket.disconnect();
  }, []);


  return (
    <>
    <Directory socket = {socket} />
    <AceEditor
      mode="java"
      theme="github"
      onChange={onChange}
      // onFocus={onFocus}
      onBlur={onBlur}
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
      value={data?.fileData?.content || ''}
    />
    <TerminalComponent socket = {socket}/>
    </>
  );
}

export default App;
