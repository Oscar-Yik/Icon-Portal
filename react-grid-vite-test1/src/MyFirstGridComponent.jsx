import React from 'react';
import GridLayout from "react-grid-layout"; 
import Block from "./Block";
import EditBox from "./EditBox";

import "./Background.css"

export default function MyFirstGridComponent({blocks2, delBlocks, showEdit, onUpdateBlocks2, onUpdateDelBlocks, onUpdateShowEdit}) {

    const defaultRowHeight = 30; 
    const defaultCols = 24; 
    const defaultMaxRows = 15;
    const margins = 10;
    const windowHeight = 970;
    const windowWidth = 1535;
    const colWidth = Math.ceil((windowWidth - (margins*(defaultCols + 1)))/defaultCols);


    function removeBlock(id) {
        console.log(blocks2);
        let blocks2copy = [...blocks2];
        let findBlock = blocks2copy.find(item => item.i === id);
        onUpdateDelBlocks([...delBlocks, findBlock]);
        console.log(blocks2);
        onUpdateBlocks2(blocks2copy.filter(item => item.i !== id));
    }

    function updateLayout(nlayout) {
        let oldLayout = blocks2.slice();
        for (let i = 0; i < blocks2.length; i++) {
            oldLayout[i].x = nlayout[i].x;
            oldLayout[i].y = nlayout[i].y;
            oldLayout[i].w = nlayout[i].w;
            oldLayout[i].h = nlayout[i].h;
        }
        onUpdateBlocks2(oldLayout);
        console.log("After: ", blocks2);
    }

    function updateEdit(i, bool) {
        let newEdit = showEdit.slice();
        let edit = newEdit.find(item => item.i === i);
        console.log("i: ", i, " bool: ", bool);
        console.log("showEdit: ", showEdit);
        if (edit) {
            edit.status = bool; 
            onUpdateShowEdit(newEdit);
        }
    }

    function generateNewDOM() {
        let grid = blocks2.map(obj => {
            const {url, ...rest} = obj;
            return rest; 
        })
        return blocks2.map(block => {
            let index = block.i;
            let edit = showEdit.find(item => item.i === index);
            let gridItem = grid.find(item => item.i === index);
            return <div key={block.i}
                        data-grid={gridItem}
                        className="block">
                            <Block block={block} 
                                   removeBlock={(i) => removeBlock(i)}
                                   onUpdateEdit={(i, bool) => updateEdit(i, bool)}/>
                    </div>
        })
    }

    return (
        <div className="test">
            <GridLayout
                className="layout"
                cols={defaultCols}
                rowHeight={defaultRowHeight}
                width={window.innerWidth}
                compactType={null}
                preventCollision={true}
                onLayoutChange={(newLayout) => updateLayout(newLayout)}    
                maxRows={defaultMaxRows}
            >
                {generateNewDOM()}
            </GridLayout>
            <EditBox showEdit={showEdit} updateEdit={onUpdateShowEdit} blocks2={blocks2} updateBlocks2={onUpdateBlocks2}/>
        </div>
    );
} 