import React from 'react';

type GridContainerProps = { children: React.ReactNode, width: number, height: number }

export default function GridContainer({ children, width, height}: GridContainerProps ) {

    return (
        <div style={{
            position: "relative", 
            zIndex: 0,
            width: width, 
            height: height
        }}>
            {children}
        </div>
      );
}