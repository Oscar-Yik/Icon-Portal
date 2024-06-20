//require('dotenv').config({ path: __dirname + "/../../../.env" });

import React, { useState } from 'react';
import EditableTextItem from '../utils/EditableText';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import getConstants from '../utils/Constants';
import youtubeMusicIcon from '../assets/youtube-music-icon.png';
import conversionIcon from '../assets/conversion-icon.png';
import failedIcon from '../assets/failed-download.png';

import '../utils/Background.css'

export default function VideoDownloader ({block, removeBlock, colors}) {
    
    const [display, setDisplay] = useState(false);
    const [failed, setFailed] = useState(false);
    const [download, setDownload] = useState(false);
    const [link, setLink] = useState("Choose Youtube Link");
    const [disDownload, setDisDownload] = useState(false);
    const [videos, setVideos] = useState([]);
    const [pathes, setPathes] = useState([]);
    const { defaultRowHeight, colWidth } = getConstants();

    const env_HOSTNAME = import.meta.env.VITE_HOSTNAME;

    function downloadVideo() {
        videos.forEach((video) => {
            downloadSingleVideo(video);
        });
    }

    async function downloadSingleVideo(video) {
        try {
            const response = await fetch(`http://${env_HOSTNAME}:3001/youtube?title=${video}`, 
                                    {method: 'GET'});
            const blob = await response.blob();
            const objectURL = window.URL.createObjectURL(blob);
            const element = document.createElement('a');
            element.href = objectURL;
            element.setAttribute('download', video)
            // document.body.appendChild(objectURL);
            element.click();
            // element.parentNode.removeChild(objectURL);
        } catch (error) {
            console.log("Error downloading video");
        }
    }

    function loadingIcon() {
        if (download) {
            return (<div className='loading-icon'></div>);
        } else if (failed) {
            return (<img src={failedIcon}
                         alt={"Stegosaurus"}
                         width={20}/>);
        } else if (disDownload) {
            return (<DownloadIcon className="download-icon" onClick={() => downloadVideo()}/>);
        } else {
            return null;
        }
    }

    function updateLink(trash, newLink) {
        console.log("new Link: ", newLink);
        setLink(newLink);
    }

    async function requestVideo() {
        console.log({ url: link });
        try {
            const youtube_url = { url: link };
            const header = {'Content-Type' : 'application/json'};
            const response = await fetch(`http://${env_HOSTNAME}:3001/youtube?playlist=false`, 
                                    {method: 'POST', headers: header, body: JSON.stringify(youtube_url)});
            if (!response.ok) {
                throw new Error();
            }
            const data = await response.json();
            return data;
        } catch (e) {
            console.log("Error: cannot download youtube", e.message);
            setFailed(true);
        }
    }

    async function convertVideo() {
        setDownload(true);
        setFailed(false);
        setDisDownload(false);
        console.log("youtube Link: ", link);
        requestVideo()
            .then(data => {
                setDownload(false);
                setDisDownload(true);
                console.log(data);
                let titles = data.title.map(path => {
                    // python-flask
                    return "./python-flask/Videos/" + path;
                })
                setPathes(titles);
                setVideos(data.title);
            })
            .catch(error => {
                console.log("Error: cannot download youtube", error.message);
                setFailed(true);
                setDownload(false);
            });
    }

    // for actual download function
    // return (<img className='failed-icon'
    //                      width={25}
    //                      height={25}
    //                      src={failedIcon}/>)

    return (
        <div width={block.data_grid.w*defaultRowHeight} 
             height={block.data_grid.h*defaultRowHeight}>
            <DeleteIcon className="widget-delete" onClick={() => removeBlock(block.data_grid.i)}/>
            <div className='choose-button' 
                 onClick={() => {setDisplay(true); setFailed(false);}}
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
                     onClick={() => {setDisplay(false); setFailed(false);}}></div>)}
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
                             onClick={() => convertVideo()}></div>
                    </div>
                    <div className='choose-video-down-triangle'
                         style={{borderTop: `10px solid ${colors.headerButton}`}}></div>
                </div>)}
        </div>
      );
}

