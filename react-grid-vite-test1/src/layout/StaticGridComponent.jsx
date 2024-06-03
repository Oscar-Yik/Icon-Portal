import GridLayout from "react-grid-layout"; 
import VideoDownloader from './VideoDownloader';
import getConstants from "../utils/Constants";
import '../utils/Background.css'

export default function StaticGridComponent({blocks2, colors, updateEdit}) {

    const { defaultRowHeight, defaultCols, defaultMaxRows, windowHeight, windowWidth } = getConstants();

    function generateNewDOM() {
        return blocks2.map(block => {
            if (block.data_grid.i === "Youtube") {
                block.data_grid.isResizable = false;
                return <div key={block.data_grid.i}
                        data-grid={block.data_grid}
                        className="block"
                        style={{backgroundColor: colors.block}}>
                            <VideoDownloader block={block} 
                                             removeBlock={(i) => removeBlock(i)}
                                             onUpdateEdit={(i, bool) => updateEdit(i, bool)}
                                             colors={colors}/>
                    </div>
            } else { 
                return <div key={block.data_grid.i}
                            data-grid={block.data_grid}
                            className="static-block">
                                <div width={block.data_grid.w*defaultRowHeight} 
                                    height={block.data_grid.h*defaultRowHeight}>
                                    <a target="_blank" 
                                    href={block.link}
                                    className='link'>
                                        <img src={block.img_url} 
                                            alt="Dinosaur" 
                                            width={block.data_grid.w*defaultRowHeight} 
                                            height={block.data_grid.h*defaultRowHeight}>
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