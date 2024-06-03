import React from 'react';
import EditableTextItem from "../utils/EditableText";
import getConstants from '../utils/Constants';

import '../utils/Background.css'

export default function EditBox({showEdit, updateEdit, blocks2, updateBlocks2, colors, env_HOSTNAME}) {

    const { defaultRowHeight, margins, colWidth } = getConstants();

    async function fetchIcons(url) {
        try {
            const img_url = url.replace(/\//g, '%2F');
            console.log(img_url);
            const response = await fetch(`http://${env_HOSTNAME}:3000/icon_url?i=${img_url}`);
            if (!response.ok) {
              console.log("Bad Query: fetchIcons()");
            }
            const data = await response.text();
            return data;
        } catch (e) {
            console.log("Error: couldn't get icon image");
            return url + "/favicon.ico";
        }
    }

    function updateInfo(id, text) {
        fetchIcons(text).then(icon => {
            console.log("Got icon: ", icon);
            let blocks2copy = blocks2.slice();
            let block = blocks2copy.find(item => item.data_grid.i === id);
            block.link = text;
            block.img_url = icon; 
            updateBlocks2(blocks2copy);
        });
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
            const block = blocks2.find(item => item.data_grid.i === edit.i);
            const boxX = getX(block.data_grid.x, block.data_grid.w);
            const boxY = getY(block.data_grid.y);
            const boxWidth = (block.link.length)*9;
            return <div key={edit.i+"e"} 
                        className="box"
                        onClick={() => clearEditAll()}>
                        <div className="exp" 
                             style={{top: boxY, left: boxX+25, 
                                     width: boxWidth, 
                                     backgroundColor: colors.editBox,
                                     color: colors.editBoxFont}}
                             onClick={(event) => event.stopPropagation()}>
                                <EditableTextItem key={block.data_grid.i} 
                                                  initialText={block.link} 
                                                  id={block.data_grid.i} 
                                                  onStateChange={updateInfo}
                                                  colors={colors}/>
                                <div>Block ID: {block.data_grid.i}</div>
                        </div>
                        <div className="left-arrow" 
                             style={{top: boxY+10, left: boxX-15, borderRight: `10px solid ${colors.editBox}`}}
                             onClick={(event) => event.stopPropagation()}> </div>
            </div> 
        } else {
            return null;
        }
    })
}