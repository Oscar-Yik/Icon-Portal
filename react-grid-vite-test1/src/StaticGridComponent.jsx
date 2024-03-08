import _, { remove } from "lodash";
import GridLayout from "react-grid-layout"; 

import './App.css'

export default function StaticGridComponent({layout, info}) {

    const defaultRowHeight = 30; 
    const defaultCols = 12; 
    const defaultMaxRows = 11;
    const margins = 10;

    function generateDOM() {
    
        return _.map(_.range(layout.length), (j) => {
            return (
              <div key={layout[j].i} 
                   data-grid={layout[j]} 
                   style={{ background: '#242424'}}>
                <a className="try" target="_blank" 
                href={info[j]} 
                height={100}>
                    <img src={info[j] + "/favicon.ico"} 
                        alt="Dinosaur" 
                        width={layout[j].w*defaultRowHeight} 
                        height={layout[j].h*defaultRowHeight}/>
                </a>
              </div>
            );
          });
    }

    return (
        <div>
            <GridLayout
                className="layout"
                //layout={layout}
                cols={defaultCols}
                rowHeight={defaultRowHeight}
                width={window.innerWidth}
                compactType={null}
                //onLayoutChange={(newLayout) => setLayout(newLayout)}    
                maxRows={defaultMaxRows}
                isDraggable={false}
                isResizable={false}
            >
                {generateDOM()}
            </GridLayout>
        </div>
    );
} 