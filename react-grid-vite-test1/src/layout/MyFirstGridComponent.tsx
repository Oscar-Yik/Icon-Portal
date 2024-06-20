import React from 'react';
import GridLayout from "react-grid-layout"; 
import Block from "./Block";
import EditBox from "./EditBox";
import GridContainer from '../animations/GridContainer';
import GridOverlay from '../animations/GridOverlay';
import VideoDownloader from './VideoDownloader';
import getConstants from '../utils/Constants';

import '../utils/Background.css'
import { themeType, blockType, data_grid_type, blockModalType, colorType, 
    unitType, apiKeys, themeNames, httpRequestType, updateBlocks2Fn, updateDelBlocksFn, updateEditFn } from './../grid-types';

type MyFirstGridProps = { blocks2: blockType[], delBlocks: blockType[], showEdit: blockModalType[], 
    onUpdateBlocks2: updateBlocks2Fn, onUpdateDelBlocks: updateDelBlocksFn, 
    onUpdateShowEdit: updateEditFn, colors: colorType, env_HOSTNAME: string }

export default function MyFirstGridComponent({blocks2, delBlocks, showEdit, onUpdateBlocks2, 
                                              onUpdateDelBlocks, onUpdateShowEdit, colors, env_HOSTNAME }: MyFirstGridProps) {

    const { defaultRowHeight, defaultCols, defaultMaxRows, windowHeight, windowWidth } = getConstants();

    function removeBlock(id: string) {
        console.log(blocks2);
        let blocks2copy = [...blocks2];
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

    function updateLayout(nlayout: data_grid_type[]) {
        // console.log("new layout: ", nlayout);
        let oldLayout = blocks2.slice();
        for (let i = 0; i < blocks2.length; i++) {
            oldLayout[i].data_grid.x = nlayout[i].x;
            oldLayout[i].data_grid.y = nlayout[i].y;
            oldLayout[i].data_grid.w = nlayout[i].w;
            oldLayout[i].data_grid.h = nlayout[i].h;
        }
        onUpdateBlocks2(oldLayout);
        // console.log("After: ", blocks2);
    }

    function updateEdit(i: string, bool: boolean) {
        let newEdit = showEdit.slice();
        let edit = newEdit.find(item => item.i === i);
        console.log("i: ", i, " bool: ", bool);
        console.log("showEdit: ", showEdit);
        if (edit) {
            edit.status = bool; 
            onUpdateShowEdit(newEdit);
        }
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
                        className="block"
                        style={{backgroundColor: colors.block}}>
                            <Block block={block} 
                                   removeBlock={(i: string) => removeBlock(i)}
                                   onUpdateEdit={(i: string, bool: boolean) => updateEdit(i, bool)}/>
                    </div>
            }
        })
    }

    return (
        <GridContainer width={windowWidth} height={windowHeight}>
            <GridOverlay color={colors.grid}>
                <GridLayout
                    className="layout"
                    cols={defaultCols}
                    rowHeight={defaultRowHeight}
                    width={windowWidth}
                    compactType={null}
                    preventCollision={true}
                    onLayoutChange={(newLayout: data_grid_type[]) => updateLayout(newLayout)}    
                    maxRows={defaultMaxRows}
                >
                    {generateNewDOM()}
                </GridLayout>
                <EditBox showEdit={showEdit} updateEdit={onUpdateShowEdit} blocks2={blocks2} 
                         updateBlocks2={onUpdateBlocks2} colors={colors} env_HOSTNAME={env_HOSTNAME}/>
            </GridOverlay>
        </GridContainer>
    );
} 