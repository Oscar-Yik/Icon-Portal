import React from 'react';
import "../utils/Background.css";
import { blockType, blockModalType, colorType, updateBlocks2Fn, updateEditFn } from './../grid-types';

type updateAddBlocksFn = (addBlocks: blockType[]) => void;

type nameIDFunction = (nameID: number) => void;

type AddBlockProps = { blocks2: blockType[], addBlocks: blockType[], nameID: number, edit: blockModalType[], 
    updateBlocks: updateBlocks2Fn, updateAddBlocks: updateAddBlocksFn, updateNameID: nameIDFunction, 
    updateEdit: updateEditFn, colors: colorType }

export default function AddBlock({ 
    blocks2, addBlocks, nameID, edit, updateBlocks, 
    updateAddBlocks, updateNameID, updateEdit, colors } : AddBlockProps) {
    function addBlock() {
        const newBlock2 = { data_grid: { i: `block ${nameID}`, 
                                         x: 0, 
                                         y: 0, 
                                         w: 2, 
                                         h: 2, 
                                         isBounded: true, 
                                         isResizable: true },
                            link: "https://chat.openai.com", 
                            img_url: "https://chat.openai.com/favicon.ico" };
        updateAddBlocks([...addBlocks, newBlock2]);
        updateBlocks([...blocks2, newBlock2]);
        let newNameID = (nameID > 150) ? 0 : nameID + 1; 
        updateNameID(newNameID);
        updateEdit([...edit, {i: newBlock2.data_grid.i, status: false}]);
      }

    return (
        <li className='navItem' style={{backgroundColor: colors.headerButton, 
                                        color: colors.headerFont}}>
            <button className='navButton' onClick={addBlock}>Add Block</button>
        </li>
    );
}