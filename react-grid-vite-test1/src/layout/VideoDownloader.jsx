import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import getConstants from '../utils/Constants';
import youtubeMusicIcon from '../assets/youtube-music-icon.png';
import failedIcon from '../assets/failed-download.png';

import '../utils/Background.css'

export default function VideoDownloader ({block, removeBlock, onUpdateEdit, colors}) {
    
    const [display, setDisplay] = useState(false);
    const [failed, setFailed] = useState(false);
    const [download, setDownload] = useState(1);
    const { defaultRowHeight } = getConstants();

    function displayChoose() {
        setDisplay(true);
    }

    function loadingIcon() {
        if (download === 1) {
            return (<div className='loading-icon'></div>)
        } else if (download === -1) {
            return (<img className='failed-icon'
                         width={25}
                         height={25}
                         src={failedIcon}/>)
        } else {
            return null;
        }
    }

    return (
        <div width={block.w*defaultRowHeight} 
             height={block.h*defaultRowHeight}>
            <DeleteIcon className="widget-delete" onClick={() => removeBlock(block.i)}/>
            <div className='choose-button' 
                 onClick={() => displayChoose()}
                 style={{backgroundColor: colors.headerButton, color: colors.headerFont}}>Choose Video</div>
            <img src={youtubeMusicIcon}
                 className='youtubeDown-image'/>
            <div className='widget-header' style={{width: 308, backgroundColor: colors.header}}></div>
            {loadingIcon()}
        </div>
      );
}

