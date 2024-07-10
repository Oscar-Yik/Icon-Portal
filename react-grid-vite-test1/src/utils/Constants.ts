type constantType = { defaultRowHeight: number, 
                      defaultCols: number, 
                      margins: number, 
                      windowWidth: number, 
                      windowHeight: number, 
                      defaultMaxRows: number, 
                      colWidth: number,
                      serverIP: string,
                      prod: boolean,
                      protocol: string }

type getConstantFn = () => constantType

const getConstants = () => {
    const defaultRowHeight = 30;
    const defaultCols = 24;
    const margins = 10;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const defaultMaxRows = Math.floor(windowHeight / (defaultRowHeight + margins)) - 1;
    const colWidth = Math.ceil((windowWidth - (margins*(defaultCols + 1)))/defaultCols);
    const serverIP = "icon-portal.click";
    const prod = true;
    const protocol = (prod) ? "https" : "http";
  
    return {
      defaultRowHeight,
      defaultCols,
      margins,
      windowWidth,
      windowHeight,
      defaultMaxRows,
      colWidth,
      serverIP,
      prod,
      protocol, 
    };
  };
    
  export default <getConstantFn> getConstants;
  