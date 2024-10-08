
export type themeNames = "current" | "Theme 1" | "Theme 2" | "Theme 3" | "Theme 4"

export type themeType = {
    name: themeNames,
    block: string, 
    header: string, 
    headerButton: string, 
    headerFont: string, 
    grid: string, 
    editBox: string, 
    editBoxFont: string, 
    backImg: string
}

export type blockType = {
    data_grid: {
        i: string,
        x: number,
        y: number,
        w: number,
        h: number,
        isBounded: boolean,
        isResizable: boolean
    },
    link: string,
    img_url: string
}

export type data_grid_type = { i: string, x: number, y: number, w: number, h: number, isBounded: boolean, isResizable: boolean }

export type blockModalType = { i: string, status: boolean }

export type colorType = {
    block: string, 
    header: string, 
    headerButton: string, 
    headerFont: string, 
    grid: string, 
    editBox: string, 
    editBoxFont: string
}

export type unitType = "nameID"

export type apiKeys = "blocks" | "nameID" | "theme";

export type httpRequestType = "POST" | "GET" | "PUT" | "DELETE"

export type updateBlocks2Fn = (blocks2: blockType[]) => void;

export type updateDelBlocksFn = (delBlocks: blockType[]) => void;

export type updateEditFn = (showEdit: blockModalType[]) => void;

export type backImgType = { id: string, name: string, imgPath: string }

export type displayIcons = {
    next: boolean,
    upload: boolean, 
    edit: boolean 
}

export type metadata = { name: string, data: number }

export type updateBkgImgs = (newBkgImgs: backImgType[]) => void;

export type getFunction = (img_name: string) => Promise<string>; 

export type colorOptions = "block" | "header" | "headerButton" | "headerFont" | "grid" | "editBox" | "editBoxFont"; 