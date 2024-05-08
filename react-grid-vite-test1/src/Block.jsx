import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import "./Background.css"

export default function Block ({block, removeBlock, onUpdateEdit}) {
    
    const defaultRowHeight = 30; 
    const defaultCols = 24; 
    const defaultMaxRows = 15;
    const margins = 10;

    return (
        <div width={block.w*defaultRowHeight} 
             height={block.h*defaultRowHeight}>
          <DeleteIcon className="removeStyle" onClick={() => removeBlock(block.i)}/>
          <EditIcon className="editButton" onClick={() => onUpdateEdit(block.i, true)}/>
            <a target="_blank" 
              href={block.url}
              className='link'>
                <img src={block.url + "/favicon.ico"} 
                    alt="Dinosaur" 
                    width={block.w*defaultRowHeight} 
                    height={block.h*defaultRowHeight}>
                </img>
            </a>
        </div>
      );
}

