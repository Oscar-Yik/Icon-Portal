import GridLayout from "react-grid-layout"; 
import VideoDownloader from './VideoDownloader';
import getConstants from "../utils/Constants";
import '../utils/Background.css'

export default function StaticGridComponent({blocks2, colors, updateEdit}) {

    const { defaultRowHeight, defaultCols, defaultMaxRows, windowHeight, windowWidth } = getConstants();

    function generateNewDOM() {
        let grid = blocks2.map(obj => {
            const {url, ...rest} = obj;
            return rest; 
        })
        return blocks2.map(block => {
            let index = block.i;
            let gridItem = grid.find(item => item.i === index);
            if (block.i === "Youtube") {
                gridItem.isResizable = false;
                return <div key={block.i}
                        data-grid={gridItem}
                        className="block"
                        style={{backgroundColor: colors.block}}>
                            <VideoDownloader block={block} 
                                             removeBlock={(i) => removeBlock(i)}
                                             onUpdateEdit={(i, bool) => updateEdit(i, bool)}
                                             colors={colors}/>
                    </div>
            } else { 
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
            }
        })
    }

    return (
        <div style={{width: windowWidth, height: windowHeight}}>
            <GridLayout
                className="layout"
                cols={defaultCols}
                rowHeight={defaultRowHeight}
                width={windowWidth}
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