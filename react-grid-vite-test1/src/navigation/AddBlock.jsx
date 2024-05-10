import React from 'react';
import "./../Background.css";

export default function AddBlock({ blocks2, addBlocks, nameID, edit, updateBlocks, updateAddBlocks, updateNameID, updateEdit }) {
    function addBlock() {
        const newBlock2 = { i: `block ${nameID}`, 
                            x: 0, 
                            y: 0, 
                            w: 2, 
                            h: 4, 
                            isBounded: true, 
                            url: "https://chat.openai.com"}; 
        updateAddBlocks([...addBlocks, newBlock2]);
        updateBlocks([...blocks2, newBlock2]);
        let newNameID = (nameID > 150) ? 0 : nameID + 1; 
        updateNameID(newNameID);
        updateEdit([...edit, {i: newBlock2.i, status: false}]);
      }

    return (
        <li className='navItem'>
            <button className='navButton' onClick={addBlock}>Add Block</button>
        </li>
    );
}