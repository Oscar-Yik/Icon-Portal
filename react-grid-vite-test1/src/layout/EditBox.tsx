import React from 'react';
import EditableTextItem from "../utils/EditableText";
import getConstants from '../utils/Constants';

import { blockType, colorType, updateBlocks2Fn, blockModalType, updateEditFn } from './../grid-types';

import '../utils/Background.css'

type EditBoxProps = { 
    blocks2: blockType[], updateBlocks2: updateBlocks2Fn, colors: colorType
    showEdit: blockModalType[], updateEdit: updateEditFn
};

export default function EditBox({showEdit, updateEdit, blocks2, updateBlocks2, colors } : EditBoxProps) {

    const { defaultRowHeight, margins, colWidth, serverIP, protocol } = getConstants();
    const icon_IP = (import.meta.env.VITE_ICON_IP) ? 
        (import.meta.env.VITE_ICON_IP) : (`${serverIP}/icon-proxy`);

    async function fetchIcons(url: string) {
        try {
            const img_url = url.replace(/\//g, '%2F');
            console.log(img_url);
            const response = await fetch(`${protocol}://${icon_IP}/icon_url?i=${img_url}`);
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function updateInfo(id: any, text: string) {
        fetchIcons(text).then(icon => {
            console.log("Got icon: ", icon);
            const blocks2copy = blocks2.slice();
            const block = blocks2copy.find(item => item.data_grid.i === id);
            if (block) {
                block.link = text;
                block.img_url = icon; 
            } else {
                console.log("Couldn't find block");
            }
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

    function getX(x: number, w: number) {
        console.log("colWidth: ", colWidth);
        return (colWidth * x) + (margins * (x -1)) + colWidth*w + margins*(w-1);
    }

    function getY(y: number) {
        return (defaultRowHeight * y) + (margins * (y-1)) + 50;
    }

    return showEdit.map(edit => {
        if (edit.status) {
            const block = blocks2.find(item => item.data_grid.i === edit.i);
            if (block) {
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
        } else {
            return null;
        }
    })
}