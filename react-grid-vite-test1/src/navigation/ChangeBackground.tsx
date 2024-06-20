import React, { useState, useEffect } from 'react';
import "../utils/Background.css";
import SkipNextIcon from '@mui/icons-material/SkipNext';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditableTextItem from '../utils/EditableText';

import { colorType, backImgType, displayIcons } from './../grid-types';

type updateFunction = (trash: any, newImg: string) => void;

type ChangeBackgroundProps = { colors: colorType, display: boolean, backImg: string, updateBackImg: updateFunction}

type IconNumber = 0 | 1 | 2;

export default function ChangeBackground({ colors, display, backImg, updateBackImg } : ChangeBackgroundProps) {

    const [bkgImgs, setBkgImgs] = useState<backImgType[]>([
        { id: "current", imgPath: backImg }, 
        { id: "2", imgPath: "./src/assets/images/Sample_Background_1.jpg" }, 
        { id: "3", imgPath: "./src/assets/images/Sample_Background_2.jpg" }, 
        { id: "4", imgPath: "https://wallpapercave.com/wp/wp13129045.jpg" }, 
        { id: "5", imgPath: "https://wallpapercave.com/wp/wp13129045.jpg" }])

    const [disIcons, setDisIcons] = useState<displayIcons>({ next: false, upload: false, edit: false });

    // fetch from mongo and s3

    // useEffect(() => {
    //     if (display) {
    //         fetchThemes().then(data => setAllThemes(data));
    //     }
    // }, [display])

    // async function fetchThemes() {
    //     try {
    //         const response = await fetch(`http://${env_HOSTNAME}:8082/api/themes`, {method: "GET"});
    //         if (!response.ok) {
    //           console.log("Bad Query: fetchThemes()");
    //         }
    //         const data = await response.json();
    //         return data;
    //     } catch (e) {
    //         console.log("Error: couldn't get all themes");
    //     }
    // }

    function updateDisIcon(icon: IconNumber) {
        let newDisIcons = { ...disIcons }
        if (icon === 0) {
            newDisIcons.next ? newDisIcons.next = false : newDisIcons.next = true;
        } else if (icon === 1) {
            newDisIcons.upload ? newDisIcons.upload = false : newDisIcons.upload = true;
        } else {
            newDisIcons.edit ? newDisIcons.edit = false : newDisIcons.edit = true;
        }
        setDisIcons(newDisIcons);
    }

    if (display) {
        return (
            <div>
                <div className='background-theme-2' style={{backgroundColor: colors.headerButton}}>
                    <div className='backImg-gap'></div>
                    <div className='backImg-container'>
                        {bkgImgs.map(obj => (
                                <div key={obj.id} className='theme-image'>
                                    <img src={obj.imgPath} 
                                        alt="Triceratops" 
                                        onClick={() => console.log("image url:", obj.imgPath)}
                                        width="80px"
                                        height="40px"></img>
                                </div>
                        ))}
                    </div>
                    <div className='backImg-gap'></div>
                    <div className='backImg-options'>
                        <FileUploadIcon style={{cursor: "pointer"}} onClick={() => updateDisIcon(1)}/>
                        <AddBoxIcon style={{cursor: "pointer"}} onClick={() => updateDisIcon(2)} />
                        <SkipNextIcon style={{cursor: "pointer"}} onClick={() => updateDisIcon(0)}/>
                    </div>
                    <div className='backImg-gap'></div>
                </div>
                {disIcons.edit && (
                    <div className='backImg-editbox' style={{backgroundColor: colors.headerButton}}>
                        <EditableTextItem initialText={backImg} id={"Background"} onStateChange={updateBackImg} colors={colors}/>
                    </div>
                )}
            </div>
            // <div className='background-theme' style={{backgroundColor: colors.headerButton}}>
            //     <EditableTextItem initialText={backImg} id={"Background"} onStateChange={updateBackImg} colors={colors}/>
            // </div>
        );
    } else {
        return null;
    }
}