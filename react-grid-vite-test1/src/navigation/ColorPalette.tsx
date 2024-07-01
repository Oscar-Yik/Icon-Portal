import React, { useState, useEffect } from 'react';
import "../utils/Background.css";

import { colorType, colorOptions } from './../grid-types';

type updateColorsFn = (colors: colorType) => void;

type ColorPaletteProps = { colors: colorType, display: boolean, updateColors: updateColorsFn }

type colorArrayType = { type: colorOptions, url: string };

export default function ColorPalette({ colors, display, updateColors }: ColorPaletteProps) {

    const [colorArr, setColorArr] = useState<colorArrayType[]>([]);

    useEffect(() => {
        if (display) {
            const colorsArray: colorArrayType[] = Object.entries(colors).map(([key, value]) => ({
                type: key as colorOptions, 
                url: value
            }));
            setColorArr(colorsArray); 
            console.log(colorsArray);
        }
    }, [display]);


    function handleColorChange(event: React.ChangeEvent<HTMLInputElement>, key: colorOptions) {
        let newColor = { ...colors };
        // const index = newColor.findIndex(obj => obj.type === key);
        // if (index !== -1) {
            //newColor[index].url = event.target.value; 
            newColor[key] = event.target.value; 
            updateColors(newColor);
        // } else {
        //     console.log("Error: Color not found");
        // }
        // console.log("colors: ", colors);
    }

    if (display) {
        return (
            <div className='color-palette' style={{backgroundColor: colors.headerButton}}>
                {colorArr.map(obj => (
                    <div key={obj.type} className='color-palette-container'>
                        <div className='color-palette-item' style={{color: colors.headerFont}}>
                            {obj.type}
                        </div>
                        <div className='color-palette-box'>
                            <input type="color" value={obj.url} onChange={(event) => handleColorChange(event, obj.type)}/>
                        </div>
                    </div>
                ))}
            </div>
        );
    } else {
        return null;
    }
}