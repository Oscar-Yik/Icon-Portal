import React from 'react';
import styled, { keyframes, css } from 'styled-components'


const gridWipeAnimation = keyframes`
        0% {
            width: 0px;
            height: 0px;
        }
    
        100% {
            width: 100%;
            height: 100%;
        }
    `;
    
    const testOverlayStyle = css `
        z-index: -1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: block;
        content: " ";
        background-image: linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), 
                        linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px), 
                        linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), 
                        linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                        linear-gradient(${(props) => props.color} 2px, transparent 2px), 
                        linear-gradient(90deg, ${(props) => props.color} 2px, transparent 2px), 
                        linear-gradient(${(props) => props.color} 2px, transparent 2px), 
                        linear-gradient(90deg, ${(props) => props.color} 2px, transparent 2px);
        background-size: 100px 40px, 63px 100px, 100px 40px, 63px 100px,
                        100px 160px, 381px 100px, 100px 160px, 381px 100px;
        background-position: 10px 10px, 17px 0px, 10px 39px, 136px 0px,
                            10px 10px, 10px 0px, 10px 159px, 379px 0px;
        animation: ${gridWipeAnimation} 1s linear;
    `;

    const GridOverlay = styled.div`
        ${testOverlayStyle}
    `;

export default GridOverlay;