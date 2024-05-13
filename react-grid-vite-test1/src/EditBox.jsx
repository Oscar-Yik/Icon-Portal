import React from 'react';
import EditableTextItem from "./EditableText";
import getConstants from './Constants';

import "./Background.css"

export default function EditBox({showEdit, updateEdit, blocks2, updateBlocks2, getColor}) {

    const { defaultRowHeight, margins, colWidth } = getConstants();

    function updateInfo(id, text) {
        let blocks2copy = blocks2.slice();
        let block = blocks2copy.find(item => item.i === id);
        block.url = text; 
        updateBlocks2(blocks2copy);
    }

    function clearEditAll() {
        const clearEdit = showEdit.map(edit => {
            edit.status = false; 
            return edit;
        })
        updateEdit(clearEdit);
    }

    function getX(x, w) {
        console.log("colWidth: ", colWidth);
        return (colWidth * x) + (margins * (x -1)) + colWidth*w + margins*(w-1);
    }

    function getY(y) {
        return (defaultRowHeight * y) + (margins * (y-1)) + 50;
    }

    return showEdit.map(edit => {
        if (edit.status) {
            const block = blocks2.find(item => item.i === edit.i);
            const boxX = getX(block.x, block.w);
            const boxY = getY(block.y);
            const boxWidth = (block.url.length)*9;
            return <div key={edit.i+"e"} 
                        className="box"
                        onClick={() => clearEditAll()}>
                        <div className="exp" 
                             style={{top: boxY, left: boxX+25, 
                                     width: boxWidth, 
                                     backgroundColor: getColor("editBox"),
                                     color: getColor("editBoxFont")}}
                             onClick={(event) => event.stopPropagation()}>
                                <EditableTextItem key={block.i} 
                                                  initialText={block.url} 
                                                  id={block.i} 
                                                  onStateChange={updateInfo}/>
                                <div>Block ID: {block.i}</div>
                        </div>
                        <div className="left-arrow" 
                             style={{top: boxY+10, left: boxX-15, borderRight: `10px solid ${getColor("editBox")}`}}
                             onClick={(event) => event.stopPropagation()}> </div>
            </div> 
        } else {
            return null;
        }
    })
}