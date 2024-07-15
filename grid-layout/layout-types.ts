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

export type unitType = {
    key: string, 
    value: string
}

export interface Database {
    connectToDatabase: () => Promise<void>;
    getAllBlocks: () => Promise<blockType[] | null>;
    getBlock: (i: string) => Promise<blockType | null>;
    createBlock: (data: blockType) => Promise<number | null>;
    updateBlock: (i: string, data: blockType) => Promise<number | null>;
    deleteBlock: (i: string) => Promise<number | null>;
    getAllUnits: () => Promise<unitType[] | null>;
    getUnit: (i: string) => Promise<unitType | null>;
    createUnit: (data: unitType) => Promise<number | null>;
    updateUnit: (i: string, data: unitType) => Promise<number | null>;
    deleteUnit: (i: string) => Promise<number | null>;
}