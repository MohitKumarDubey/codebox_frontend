import "./directory.css"
import Folder from "../folder/folder";
import { useState, useEffect } from "react";
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
function Directory(props) {
  console.log(props);
    const {socket} = props;
    const [tree, setTree] = useState([]);
    // socket && socket.on("filesInDir", (data)=>{
    //   setTree(transForms(data));
    // })
    useEffect(() => {
      if (!socket) return;
      socket.emit("getDir","");
      socket.on("", (data)=>{
        console.log("hiiii---------------",data);
        const na = transForms(data);
        console.log(na);
        setTree(na);
      })
  }, [socket]);
    // const [newTree , setTree] = useState(tree);
    return (
        <>
            <div className="box">
                <ul className="directory-list">
                    <Folder tree = {tree} socket = {socket}/>
                </ul>
            </div>
        </>
    );
}

export default Directory;



// <li class="folder">
//     <text>assets</text> 
//     <ul>
//         <li class="folder">
//             <text>css</text> 
//             <ul>
//                 <li>
//                     <text>typography.css</text>
//                 </li>
//                 <li>
//                     <text>layout.css</text>
//                 </li>
//                 <li>
//                     <text>modules.css</text>
//                 </li>
//             </ul>
//         </li>
//         <li class="folder">js
//             <ul>
//                 <li>custom.js</li>
//                 <li>jquery.js</li>
//             </ul>
//         </li>
//         <li class="folder">images
//             <ul>
//                 <li>logo.svg</li>
//                 <li>arrow-sprite.svg</li>
//                 <li>social-sprite.svg</li>
//             </ul>
//         </li>
//         <li>functions.php</li>
//     </ul>
// </li>