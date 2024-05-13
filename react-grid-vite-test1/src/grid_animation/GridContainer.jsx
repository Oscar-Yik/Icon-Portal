import React from 'react';
import styled, { css } from 'styled-components'


const testContainerStyle = css`
    position: relative;
    z-index: 0;
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
`;

const GridContainer = styled.div`
    ${testContainerStyle}
`;

export default GridContainer;
