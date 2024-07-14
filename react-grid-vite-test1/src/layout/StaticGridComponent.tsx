import React from 'react';
import GridLayout from "react-grid-layout"; 
import VideoDownloader from './VideoDownloader';
import getConstants from "../utils/Constants";
import '../utils/Background.css'
import { blockType, colorType, updateBlocks2Fn, updateDelBlocksFn } from './../grid-types';

type StaticGridProps = { blocks2: blockType[], colors: colorType, delBlocks: blockType[], 
                         onUpdateBlocks2: updateBlocks2Fn, onUpdateDelBlocks: updateDelBlocksFn }

export default function StaticGridComponent({ blocks2, colors, delBlocks, onUpdateBlocks2, onUpdateDelBlocks }: StaticGridProps) {

    const { defaultRowHeight, defaultCols, defaultMaxRows, windowHeight, windowWidth } = getConstants();

    function removeBlock(id: string) {
        console.log(blocks2);
        const blocks2copy = [...blocks2];
        let findBlock = blocks2copy.find(item => item.data_grid.i === id);
        if (!findBlock) {
            findBlock = { data_grid: { i: "null", x: 0, y: 0, w: 0, h: 0, isBounded: false, isResizable: false }, 
                          link: "", 
                          img_url: "" }
        }
        onUpdateDelBlocks([...delBlocks, findBlock]);
        console.log(blocks2);
        onUpdateBlocks2(blocks2copy.filter(item => item.data_grid.i !== id));
    }

    function generateNewDOM() {
        return blocks2.map(block => {
            if (block.data_grid.i === "Youtube") {
                block.data_grid.isResizable = false;
                return <div key={block.data_grid.i}
                        data-grid={block.data_grid}
                        className="block"
                        style={{backgroundColor: colors.block}}>
                            <VideoDownloader block={block} 
                                             removeBlock={(i: string) => removeBlock(i)}
                                             colors={colors}/>
                    </div>
            } else { 
                return <div key={block.data_grid.i}
                            data-grid={block.data_grid}
                            className="static-block">
                                {/* <div width={block.data_grid.w*defaultRowHeight} 
                                    height={block.data_grid.h*defaultRowHeight}></div> */}
                                <div>
                                    <a target="_blank" 
                                       rel="noopener noreferrer"
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