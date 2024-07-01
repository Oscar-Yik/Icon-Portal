import React from 'react';
import "../utils/Background.css";

import { colorType } from './../grid-types';

type updateDisplayFn = (display: boolean) => void;

type HeaderPopupProps = { name: string, colors: colorType, display: boolean, updateDisplay: updateDisplayFn }

export default function HeaderPopup({ name, display, updateDisplay, colors } : HeaderPopupProps) {
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