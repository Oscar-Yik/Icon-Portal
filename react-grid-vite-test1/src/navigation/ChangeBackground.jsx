import React from 'react';
import "../utils/Background.css";
import EditableTextItem from '../utils/EditableText';

export default function ChangeBackground({ colors, display, backImg, updateBackImg }) {

    if (display) {
        return (
            <div className='background-theme' style={{backgroundColor: colors.headerButton}}>
                <EditableTextItem initialText={backImg} id={"Background"} onStateChange={updateBackImg} colors={colors}/>
            </div>
        );
    } else {
        return null;
    }
}