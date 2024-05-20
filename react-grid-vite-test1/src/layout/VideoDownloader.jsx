import React, { useState } from 'react';
import EditableTextItem from '../utils/EditableText';
import DeleteIcon from '@mui/icons-material/Delete';
import getConstants from '../utils/Constants';
import youtubeMusicIcon from '../assets/youtube-music-icon.png';
import conversionIcon from '../assets/conversion-icon.png';
import failedIcon from '../assets/failed-download.png';

import '../utils/Background.css'

export default function VideoDownloader ({block, removeBlock, onUpdateEdit, colors}) {
    
    const [display, setDisplay] = useState(true);
    const [failed, setFailed] = useState(false);
    const [download, setDownload] = useState(true);
    const [link, setLink] = useState("Choose Youtube Link");
    const { defaultRowHeight, colWidth, windowHeight, windowWidth } = getConstants();

    function loadingIcon() {
        if (download) {
            return (<div className='loading-icon'></div>)
        } else {
            return null;
        }
    }

    function updateLink(trash, newLink) {
        setLink(newLink);
    }

    function downloadVideo() {
        console.log("clicked");
    }

    // for actual download function
    // return (<img className='failed-icon'
    //                      width={25}
    //                      height={25}
    //                      src={failedIcon}/>)

    return (
        <div width={block.w*defaultRowHeight} 
             height={block.h*defaultRowHeight}>
            <DeleteIcon className="widget-delete" onClick={() => removeBlock(block.i)}/>
            <div className='choose-button' 
                 onClick={() => setDisplay(true)}
                 style={{backgroundColor: colors.headerButton, color: colors.headerFont}}>Choose Video</div>
            <img src={youtubeMusicIcon}
                 className='youtubeDown-image'/>
            <div className='widget-header' style={{width: (4.4)*colWidth, backgroundColor: colors.header}}></div>
            {loadingIcon()}
            {display && (
                <div className='choose-video-box' 
                     style={{position: 'fixed',
                             top: '0',
                             left: '0',
                             width: '100%', 
                             height:  '100%'}}
                     onClick={() => setDisplay(false)}></div>)}
            {display && (
                <div className='choose-video-container'>
                    <div className='choose-video'
                        style={{backgroundColor: colors.headerButton}}>
                        <EditableTextItem initialText={link} id={"youtube-link"} onStateChange={updateLink} colors={colors}/>
                        <img className="choose-video-conversion" 
                             src={conversionIcon}
                             alt="Triceratops"
                             width={20}></img>
                        <div className='conversion-overlay'
                             onClick={() => downloadVideo()}></div>
                    </div>
                    <div className='choose-video-down-triangle'
                         style={{borderTop: `10px solid ${colors.headerButton}`}}></div>
                </div>)}
        </div>
      );
}

