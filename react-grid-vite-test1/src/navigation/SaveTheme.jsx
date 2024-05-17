import React, { useState, useEffect } from 'react';
import "./../Background.css";

export default function SaveTheme({ colors, display, theme, updateTheme, saveGrid }) {

    const [allThemes, setAllThemes] = useState([]);

    useEffect(() => {
        if (display) {
            fetchThemes().then(data => setAllThemes(data));
        }
    }, [display])

    async function fetchThemes() {
        try {
            const response = await fetch(`http://localhost:8082/api/themes`, {method: "GET"});
            if (!response.ok) {
              console.log("Bad Query: fetchThemes()");
            }
            const data = await response.json();
            return data;
        } catch (e) {
            console.log("Error: couldn't get all themes");
        }
    }

    if (display) {
        return (
            <div className='save-theme' style={{backgroundColor: colors.headerButton}}>
                {allThemes.map(obj => (
                    <div key={obj.name} className='theme-container'>
                        <div className='theme-item' style={{color: colors.headerFont}}>
                            {obj.name}
                        </div>
                        <div className='theme-image'>
                            <img src={obj.backImg} 
                                 alt="Triceratops" 
                                 onClick={() => saveGrid(obj.name)}
                                 width="80px"
                                 height="40px"></img>
                        </div>
                    </div>
                ))}
            </div>
        );
    } else {
        return null;
    }
}