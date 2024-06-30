import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import getConstants from '../utils/Constants';

import '../utils/Background.css'

export default function Block ({block, removeBlock, onUpdateEdit}) {
    
    const { defaultRowHeight } = getConstants();

    return (
        <div width={block.data_grid.w*defaultRowHeight} 
             height={block.data_grid.h*defaultRowHeight}>
          {(block.data_grid.h === 1) ?
            <DeleteIcon className="small-delete" onClick={() => removeBlock(block.data_grid.i)}/>
            :
            <DeleteIcon className="removeStyle" onClick={() => removeBlock(block.data_grid.i)}/>
          }
          {(block.data_grid.h === 1) ?
            <EditIcon className="small-edit" onClick={() => onUpdateEdit(block.data_grid.i, true)}/>
            :
            <EditIcon className="editButton" onClick={() => onUpdateEdit(block.data_grid.i, true)}/>
          }

            <img src={block.img_url} 
                alt="Dinosaur" 
                width={block.data_grid.w*defaultRowHeight} 
                height={block.data_grid.h*defaultRowHeight}>
            </img>
        </div>
      );
}

