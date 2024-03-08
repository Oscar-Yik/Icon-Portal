import _, { remove } from "lodash";
import React, { useState } from 'react';
import GridLayout from "react-grid-layout"; 
import EditableTextItem from "./EditableText";

import 'bootstrap/dist/css/bootstrap.css';

// function Block({ id, onBlockClick }) {

//     const removeStyle = {
//         position: "absolute",
//         right: "2px",
//         top: 0,
//         cursor: "pointer"
//     };

//     return (
//         <div key={id} 
//              style={{ background: '#009688'}}
//         >
//             {`${id}`}
//         </div>
//     );

//     return (
//         <div key={layout[i].i} data-grid={layout[i]} style={{ background: '#009688'}}>
//           <EditableTextItem key={layout[i].i} initialText={"hello"} />
//           <div>
//               <span className="text">{layout[i].i}</span>
//           </div>
//           <span className="remove" style={removeStyle} onClick={() => removeBlock(layout[i].i)}>x</span>
//         </div>
//       );
// }

export default function MyFirstGridComponent({layout, info, onUpdateLayout, onUpdateInfo}) {
    // const [layout, setLayout] = useState([
    //     { i: "a", x: 4, y: 0, w: 1, h: 2, isBounded: true},
    //     { i: "b", x: 4, y: 0, w: 1, h: 2, isBounded: true},
    //     { i: "c", x: 4, y: 0, w: 1, h: 2, isBounded: true }
    // ]);
    //[{grid: {}, text: ""}]

    // const [layout, setLayout] = useState([
    //     {grid: { i: "a", x: 4, y: 0, w: 1, h: 2, isBounded: true}, text: "default"},
    //     {grid: { i: "b", x: 4, y: 0, w: 1, h: 2, isBounded: true}, text: "default"},
    //     {grid: { i: "c", x: 4, y: 0, w: 1, h: 2, isBounded: true}, text: "default"}
    // ]);

    // const [layout, setLayout] = useState([
    //     { i: "a", x: 4, y: 0, w: 1, h: 2, isBounded: true},
    //     { i: "b", x: 4, y: 0, w: 1, h: 2, isBounded: true},
    //     { i: "c", x: 4, y: 0, w: 1, h: 2, isBounded: true}
    // ]);

    // //const [info, setInfo] = useState(["default", "default", "default"]);
    // const [info, setInfo] = useState(["https://chat.openai.com", "https://chat.openai.com", "https://chat.openai.com"]);

    const removeStyle = {
        position: "absolute",
        right: "2px",
        top: 0,
        cursor: "pointer"
    };

    const defaultRowHeight = 30; 
    const defaultCols = 12; 
    const defaultMaxRows = 11;
    const margins = 10;
    
    // layout is an array of objects, see the demo for more complete usage
    // const layout = [
    //     //{ i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
    //     //{ i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    //     { i: "a", x: 4, y: 0, w: 1, h: 2 , isBounded: true},
    //     { i: "b", x: 4, y: 0, w: 1, h: 2 , isBounded: true},
    //     { i: "c", x: 4, y: 0, w: 1, h: 2 , isBounded: true}
    // ];

    function addBlock() {
        const newBlock = { i: `Block ${layout.length + 1}`, x: 0, y: Infinity, w: 2, h: 4, isBounded: true}; 
        //setLayout([...layout, newBlock]);
        const newInfo = [...info.slice(), "https://chat.openai.com"];
        //setInfo(newInfo);
        onUpdateLayout([...layout, newBlock]);
        onUpdateInfo(newInfo);
    }
    // Problem here
    function removeBlock(id) {
        const index = layout.findIndex((item) => item.i === id); 
        const newLayout = layout.filter((item) => item.i !== id);
        //setLayout(newLayout);
        //setInfo(info.splice(index,1));
        onUpdateLayout(newLayout);
        onUpdateInfo(info.splice(index,1));
    }

    function updateInfo(id, text) {
        const newInfo = info.slice();
        newInfo[id] = text; 
        //setInfo(newInfo);
        onUpdateInfo(newInfo);
    }

    function generateDOM() {
    
        return _.map(_.range(layout.length), (j) => {
            return (
              <div key={layout[j].i} 
                   data-grid={layout[j]} 
                   style={{ background: '#009688'}}>
                {console.log(info)}
                <EditableTextItem key={layout[j].i} 
                                  initialText={info[j]} 
                                  id={j} 
                                  onStateChange={updateInfo}/>
                <div>
                    <span className="text">{layout[j].i}</span>
                </div>
                <span className="remove" 
                      style={removeStyle} 
                      onClick={() => removeBlock(layout[j].i)}>x</span>
                <a target="_blank" 
                   href={info[j]} 
                   height={100}>
                    <img src={info[j] + "/favicon.ico"} 
                         alt="Dinosaur" 
                         width={layout[j].w*defaultRowHeight} 
                         height={layout[j].h*defaultRowHeight}/>
                </a>
              </div>
            );
          });
          // <img src={"http://www.google.com/s2/favicons?domain="+info[j]} alt="Dinosaur" width={30}/>
          //<img src={info[j] + "/favicon.ico"} alt="Dinosaur" />
          // <span className="text">{layout[i].i}</span>

        // {layout.map((item) => (
        //     <div key={item.i} 
        //          style={{ background: '#009688'}}
        //     >
        //         {`${item.i}`}
        //         <span
        //             className='remove'
        //             style={removeStyle}
        //             onClick={() => removeBlock(item.i)}
        //         > 
        //             x
        //         </span>
        //     </div>
        // ))}
    }

    // <div key="a" style={{ background: '#ff4d4f' }}>a</div>
    // <div key="b" style={{ background: '#40a9ff' }}>b</div>
    // <div key="c" style={{ background: '#73d13d' }}>c</div>

    // <div key={item.i} 
    //      style={{ background: '#009688'}}
    // >
    //     {`${item.i}`}
    //     <span
    //         className='remove'
    //         style={removeStyle}
    //         onClick={() => removeBlock(item.i)}
    //     > 
    //         x
    //     </span>
    // </div>

    // {layout.map((item) => (
    //     <div key={item.i} 
    //          style={{ background: '#009688'}}
    //     >
    //         {`${item.i}`}
    //         <span
    //             className='remove'
    //             style={removeStyle}
    //             onClick={() => removeBlock(item.i)}
    //         > 
    //             x
    //         </span>
    //     </div>
    // ))}

    return (
        <div>
            <button type="button" class="btn btn-outline-success" onClick={addBlock}>Add Block</button>
            <GridLayout
                className="layout"
                //layout={layout}
                cols={defaultCols}
                rowHeight={defaultRowHeight}
                width={window.innerWidth}
                compactType={null}
                onLayoutChange={(newLayout) => onUpdateLayout(newLayout)}    
                maxRows={defaultMaxRows}
            >
                {generateDOM()}
            </GridLayout>
        </div>
    );
} 