import React, { useState, useEffect } from 'react';
import "../utils/Background.css";
import SkipNextIcon from '@mui/icons-material/SkipNext';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditableTextItem from '../utils/EditableText';
import getErrorMessage from '../utils/Errors';

import { colorType, backImgType, displayIcons, metadata } from './../grid-types';

type updateFunction = (trash: any, newImg: string) => void;

type updateBkgImgs = (newBkgImgs: backImgType[]) => void;

type getFunction = (img_name: string) => Promise<string>; 

type ChangeBackgroundProps = { 
    colors: colorType, display: boolean, env_HOSTNAME: string, backImg: backImgType,
    bkgImgs: backImgType[], updateBackImg: updateFunction, updateBkgImgs: updateBkgImgs, getImage: getFunction}

type IconNumber = 0 | 1 | 2;

export default function ChangeBackground({ colors, display, env_HOSTNAME, backImg, bkgImgs, updateBackImg, updateBkgImgs, getImage } : ChangeBackgroundProps) {

    const [disIcons, setDisIcons] = useState<displayIcons>({ next: false, upload: false, edit: false });
    const [disImgs, setDisImgs] = useState<backImgType[]>([]);

    useEffect(() => {
        setDisImgs(bkgImgs);
    }, [])

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

    async function fetchImages(start_img: number, num_imgs: number) {
        try {
            const newImages: backImgType[] = [];
            for (let i = start_img; i < num_imgs; i++) {
                const new_img_name = "Sample_Background_" + i + ".jpg";
                const new_img = await getImage("Sample_Background_" + i + ".jpg");
                newImages.push({
                    id: i.toString(), 
                    name: new_img_name, 
                    imgPath: new_img
                });
            }
            return newImages;
        } catch (e) {
            throw e; 
        }
    }

    function calculateNextImages(current_img: number, total_imgs: number) {
        const diff = total_imgs - current_img;
        if (diff < 5 && diff > 0) {
            return diff; 
        } else if (diff <= 0) {
            return 0;
        }else {
            return 5;
        }
    }
    
    function saveBkgImgs(new_imgs: backImgType[]) {
        const newBackImgs = bkgImgs.concat(new_imgs);
        updateBkgImgs(newBackImgs);
        setDisImgs(new_imgs);
    }

    async function getNextImgs() {
        try {
            const response = await fetch(`http://${env_HOSTNAME}:8082/api/s3/metadata/img_count`, { method: 'GET' }); 
            if (!response.ok) {
                throw new Error("Couldn't get img_count");
            }
            const metadata = await response.json(); 
            const img_count = metadata.data;
            const current_img = parseInt(disImgs[disImgs.length - 1].name.slice(18,-4));
            const numBkgImgs = bkgImgs.length; 

            const num_imgs = calculateNextImages(current_img, img_count);

            if (num_imgs == 0) {
                console.log("Looped :D"); 
                const new_imgs = bkgImgs.slice(0, 5);
                setDisImgs(new_imgs);
            } else if (numBkgImgs >= img_count) {
                console.log(`Fetching images from indexes ${current_img} to ${current_img+num_imgs}`); 
                const new_imgs = bkgImgs.slice(current_img, current_img + num_imgs);
                setDisImgs(new_imgs);
            } else {
                console.log(`Fetching ${num_imgs} images, Starting from image ${current_img+1}`); 
                const new_imgs = await fetchImages(current_img+1, current_img + num_imgs + 1);
                saveBkgImgs(new_imgs);
            }
        } catch (e) {
            console.log("Error: ", getErrorMessage(e));
        }
    }

    function nextImgs() {
        getNextImgs() 
            .then(() => { console.log("Got next images!!!") })
            .catch(e => { console.log(`Didn't catch errors properly: ${getErrorMessage(e)}`) });
    }

    if (display) {
        return (
            <div>
                <div className='background-theme-2' style={{backgroundColor: colors.headerButton}}>
                    <div className='backImg-gap'></div>
                    <div className='backImg-container'>
                        {disImgs.map(obj => (
                                <div key={obj.id} className='theme-image'>
                                    <img src={obj.imgPath} 
                                        alt="Triceratops" 
                                        onClick={() => updateBackImg(0, obj.name)}
                                        width="80px"
                                        height="40px"></img>
                                </div>
                        ))}
                    </div>
                    <div className='backImg-gap'></div>
                    <div className='backImg-options'>
                        <FileUploadIcon style={{cursor: "pointer"}} onClick={() => {updateDisIcon(1); console.log(bkgImgs)}}/>
                        <AddBoxIcon style={{cursor: "pointer"}} onClick={() => updateDisIcon(2)} />
                        <SkipNextIcon style={{cursor: "pointer"}} onClick={() => nextImgs()}/>
                    </div>
                    <div className='backImg-gap'></div>
                </div>
                {disIcons.edit && (
                    <div className='backImg-editbox' style={{backgroundColor: colors.headerButton}}>
                        <EditableTextItem initialText={backImg.name} id={"Background"} onStateChange={updateBackImg} colors={colors}/>
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