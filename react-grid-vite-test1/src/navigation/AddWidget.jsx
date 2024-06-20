import React from 'react';
import "../utils/Background.css";
import youtubeMusicIcon from '../assets/youtube-music-icon.png';
import asuraScans from '../assets/asura-scans.png';


export default function AddWidget({ colors, display, blocks2, addBlocks, edit, updateAddBlocks, updateEdit, updateBlocks }) {

    async function addYoutube() {
        const newBlock2 = { data_grid: { i: "Youtube", 
                                         x: 0, 
                                         y: 0, 
                                         w: 4, 
                                         h: 2, 
                                         isBounded: true, 
                                         isResizable: true },
                            link: "https://postgresql.org", 
                            img_url: "https://postgresql.org/favicon.ico" };
        updateAddBlocks([...addBlocks, newBlock2]);
        updateBlocks([...blocks2, newBlock2]);
        updateEdit([...edit, {i: newBlock2.data_grid.i, status: false}]);

    }

    if (display) {
        return (
            <div className='add-widget' style={{backgroundColor: colors.headerButton}}>
                <div className='theme-container'>
                    <div className='widget-text' style={{color: colors.headerFont}}>
                        Add Youtube Downloader
                    </div>
                    <div className='widget-icon'>
                        <img src={youtubeMusicIcon} 
                                alt="Triceratops" 
                                onClick={() => addYoutube()}
                                width="45px"
                                height="40px"></img>
                    </div>
                </div>
                <div className='theme-container'>
                    <div className='widget-text' style={{color: colors.headerFont}}>
                        Webtoon Tracker
                    </div>
                    <div className='widget-icon'>
                        <img src={asuraScans} 
                                alt="Triceratops" 
                                onClick={() => addYoutube()}
                                width="45px"
                                height="40px"></img>
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
}