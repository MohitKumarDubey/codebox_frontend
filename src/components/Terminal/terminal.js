import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const TerminalComponent = (prop) => {
    const {socket=null} = prop;
    const terminalRef = useRef(null);
    let cwd = '';
    useEffect(() => {
        if (!socket) return;
        const terminal = new Terminal();
        terminal.open(terminalRef.current);
        terminal.writeln('Welcome to the terminal!');
        terminal.onData((data) => {
            if (data === '\r') {
                // Handle Enter key
                const command = terminal.buffer.active.getLine(terminal.buffer.active.cursorY+terminal.buffer.active.baseY).translateToString().substring(cwd.length+1);
                // console.log(terminal.buffer.active);
                // console.log(terminal.buffer.active.baseY);
                // console.log(terminal.buffer.active.cursorX);
                // console.log(terminal.buffer.active.cursorY);
                terminal.writeln('');
                console.log("---------------",command);
                console.log("-----------cwd-------",cwd);
                if(command.length > 0) {
                    socket.emit('commandToExec', command);
                }
                else{
                    terminal.write(data+">"); // Echo input
                }
            } else if (data === '\u007F') {
                // Handle Backspace
                if (terminal.buffer.active.cursorX > cwd.length+1) {
                    terminal.write('\b \b');
                }
            } else {
                // Display typed characters
                
                
                terminal.write(data);
                const command = terminal.buffer.active.getLine(terminal.buffer.active.cursorY).translateToString().substring(cwd.length+1);
                console.log(command)
            }
        });

        socket.on('cwd',(data)=>{
            cwd=data;
            terminal.write(data+">"); // Echo input
        })
        socket.on('cmdOutput',(data)=>{
            if(typeof data === 'string'){
                terminal.write(data); // Write output to terminal
                terminal.writeln(''); 
                terminal.write(cwd+">"); // Prompt again
            }
            else{
                terminal.write(data.output); // Write output to terminal
                terminal.writeln(''); 
                terminal.write(data.currentDirForTerm+">"); // Prompt again
                cwd = data.currentDirForTerm;
            }
        })
    }, [socket]);

    return <div ref={terminalRef} style={{ width: '100%', height: '800px' }} />;
};

export default TerminalComponent;
