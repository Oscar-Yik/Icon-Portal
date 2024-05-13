import React, { useState } from 'react';
import "./../Background.css";

export default function ColorPalette({ colors, display, updateColors, getColor }) {

    function handleColorChange(event, key) {
        let newColor = colors.slice();
        const index = newColor.findIndex(obj => obj.type === key);
        if (index !== -1) {
            newColor[index].url = event.target.value; 
            updateColors(newColor);
        } else {
            console.log("Error: Color not found");
        }
        // console.log("colors: ", colors);
    }

    if (display) {
        return (
            <div className='color-palette' style={{backgroundColor: getColor("headerButton")}}>
                {colors.map(obj => (
                    <div key={obj.type} className='color-palette-container'>
                        <div className='color-palette-item' style={{color: getColor("headerFont")}}>
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