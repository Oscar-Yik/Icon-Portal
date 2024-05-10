import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import getConstants from './Constants';

import "./Background.css"

export default function Block ({block, removeBlock, onUpdateEdit}) {
    
    const { defaultRowHeight } = getConstants();

    return (
        <div width={block.w*defaultRowHeight} 
             height={block.h*defaultRowHeight}>
          {(block.h === 1) ?
            <DeleteIcon className="small-delete" onClick={() => removeBlock(block.i)}/>
            :
            <DeleteIcon className="removeStyle" onClick={() => removeBlock(block.i)}/>
          }
          {(block.h === 1) ?
            <EditIcon className="small-edit" onClick={() => onUpdateEdit(block.i, true)}/>
            :
            <EditIcon className="editButton" onClick={() => onUpdateEdit(block.i, true)}/>
          }
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

