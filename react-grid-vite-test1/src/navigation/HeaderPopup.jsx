import React from 'react';
import "../utils/Background.css";

export default function HeaderPopup({ name, display, updateDisplay, colors }) {
    return(
        <li className='navItem' 
              style={{backgroundColor: colors.headerButton, 
                      color: colors.headerFont}}> 
            {display && (
                <div className='box' 
                    onClick={() => updateDisplay(false)}></div>)}
                <button className='navButton' 
                        onClick={() => updateDisplay(true)}>{name}</button>
        </li>
    );
}