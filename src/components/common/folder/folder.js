import { useState , useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';

function transForms(array){

    const newArray = [];
    array.map((val)=>{
      if(val.isDirectory){
        newArray.push({
          isFolder:true,
          name : val.name,
          children : [],
          isClicked : false,
          path : val.path
        });
      }
      else{
        newArray.push({
          isFolder:false,
          name : val.name,
          isClicked : false,
          path : val.path
        });
      }
    })
    return newArray;
}
function Folder(prop) {
    // REDUX
    const dispatch = useDispatch();
    //

    const {tree, socket} = prop;
    const [folderIdx , setFolderIdx] = useState(tree);
    function openFolder(e, tree, idx) {

        const eventString = `${tree[idx].path}/${tree[idx].name}`;
        if(tree[idx].isClicked === false){
            socket.emit("getDir",eventString)
            socket.on(eventString,(data)=>{
                tree[idx].children = transForms(data);
                const obj = {...tree[idx], isClicked : !tree[idx].isClicked}
                tree[idx] = obj;
                setFolderIdx([...tree])
            })
        }
        else{
            const obj = {...tree[idx], isClicked : !tree[idx].isClicked}
            tree[idx] = obj;
            setFolderIdx([...tree])
            socket.off(eventString);
        }
    }


    function openFile(e, tree, idx) {
        const obj = tree[idx];
        const eventString = `${tree[idx].path}/${tree[idx].name}`;
        socket.emit('readFile', eventString);
        socket.on(eventString, (data)=>{
            // FILE DATA
            dispatch({ type: 'SET_FILE_DATA', payload: {
                fileName: tree[idx].name,
                content : data,
                path : eventString
            } });
            console.log(data);

            const tObj = {...tree[idx], isClicked : !tree[idx].isClicked}
            tree[idx] = tObj;
            setFolderIdx([...tree])
        })
    }

    
    // socket && socket.on("filesInDir", (data)=>{
    //   setTree(transForms(data));
    // })
    useEffect(() => {
      if (!socket) return;
    //   socket.emit("getDir","/");
    //   socket.on("filesInDir", (data)=>{
    //     console.log("hiiii---------------",data);
    //     const na = transForms(data);
    //     console.log(na);
    //     setTree(na);
      //})
  }, [socket]);
 
    

    return (
        <>
            {
                tree.length > 0 && tree.map((item, idx) => {
                    if (item.isFolder) {
                        return (<>
                            <li key={idx} className="folder">
                                <span onClick={(e) => openFolder(e, tree , idx)}>{item.name}</span>
                                {
                                    item.isClicked && item.children.length > 0 &&
                                    <>
                                        <ul>
                                            <Folder tree={item.children} socket = {socket} />
                                        </ul>
                                    </>
                                }
                            </li>
                        </>)
                    }
                    else {
                        return (<li key={idx} onClick={(e)=>openFile(e, tree , idx)}>
                            <span>{item.name}</span>
                        </li>)
                    }
                })
            }
        </>
    );
}

export default Folder;
