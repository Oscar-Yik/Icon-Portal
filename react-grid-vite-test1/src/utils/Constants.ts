type constantType = { defaultRowHeight: number, 
                      defaultCols: number, 
                      margins: number, 
                      windowWidth: number, 
                      windowHeight: number, 
                      defaultMaxRows: number, 
                      colWidth: number }

type getConstantFn = () => constantType

const getConstants = () => {
    const defaultRowHeight = 30;
    const defaultCols = 24;
    const margins = 10;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const defaultMaxRows = Math.floor(windowHeight / (defaultRowHeight + margins)) - 1;
    const colWidth = Math.ceil((windowWidth - (margins*(defaultCols + 1)))/defaultCols);
  
    return {
      defaultRowHeight,
      defaultCols,
      margins,
      windowWidth,
      windowHeight,
      defaultMaxRows,
      colWidth,
    };
  };
    
  export default <getConstantFn> getConstants;
  