import React from "react";
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);

export default function BasicLayoutFunc() {
//   static defaultProps = {
//     className: "layout",
//     items: 20,
//     rowHeight: 30,
//     onLayoutChange: function() {},
//     cols: 12
//   };

    const layout = generateLayout();
    const items = 20; 

//   constructor(props) {
//     super(props);

//     const layout = this.generateLayout();
//     this.state = { layout };
//   }

  function generateDOM() {
    return _.map(_.range(items), function(i) {
      return (
        <div key={i}>
          <span className="text">{i}</span>
        </div>
      );
    });
  }

  function generateLayout() {
    return _.map(new Array(items), function(i) {
      const y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString()
      };
    });
  }

  function onLayoutChange(layout) {
    onLayoutChange(layout);
  }

    return (
        <ReactGridLayout
            layout={layout}
            //onLayoutChange={onLayoutChange}
            className="layout"
            items={items}
            rowHeight={30}
            //onLayoutChange: function() {}
            cols={12}
        >
            {generateDOM()}
        </ReactGridLayout>
    );
}