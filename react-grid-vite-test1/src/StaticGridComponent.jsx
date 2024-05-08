import GridLayout from "react-grid-layout"; 

import './Background.css'

export default function StaticGridComponent({blocks2}) {

    const defaultRowHeight = 30; 
    const defaultCols = 24; 
    const defaultMaxRows = 15;
    const margins = 10;

    function generateNewDOM() {
        let grid = blocks2.map(obj => {
            const {url, ...rest} = obj;
            return rest; 
        })
        return blocks2.map(block => {
            let index = block.i;
            let gridItem = grid.find(item => item.i === index);
            return <div key={block.i}
                        data-grid={gridItem}
                        className="static-block">
                            <div width={block.w*defaultRowHeight} 
                                 height={block.h*defaultRowHeight}>
                                <a target="_blank" 
                                href={block.url}
                                className='link'>
                                    <img src={block.url + "/favicon.ico"} 
                                        alt="Dinosaur" 
                                        width={block.w*defaultRowHeight} 
                                        height={block.h*defaultRowHeight}>
                                    </img>
                                </a>
                            </div>
                    </div>
        })
    }

    return (
        <div className="static">
            <GridLayout
                className="layout"
                cols={defaultCols}
                rowHeight={defaultRowHeight}
                width={window.innerWidth}
                compactType={null}  
                maxRows={defaultMaxRows}
                isDraggable={false}
                isResizable={false}
            >
                {generateNewDOM()}
            </GridLayout>
        </div>
    );
} 