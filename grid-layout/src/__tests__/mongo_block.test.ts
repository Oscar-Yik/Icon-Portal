import mongo from '../database/mongo';
import { blockType, HTTPRequest } from '../../layout-types';

const testBlock = {
    data_grid: { 
        i: "testing block", x: 0, y: 0, w: 4, h: 4, isBounded: true, isResizable: false }, 
    link: "https://twitch.tv", 
    img_url: "https://twitch.tv/favicon.ico" 
}

const modBlock = {
    data_grid: { 
        i: "testing block", x: 6, y: 9, w: 6, h: 9, isBounded: true, isResizable: false }, 
    link: "https://twitch.tv", 
    img_url: "https://twitch.tv/favicon.ico" 
}

// make_request function?
async function make_block_request(request_type: HTTPRequest | "GET ALL", blockID?: string, body?: blockType) {
    let response; 
    switch(request_type) {
        case 'GET ALL': const temp = await mongo.getAllBlocks(); if (temp) { response = temp[0]; } break;
        case 'GET': if (blockID) { response = await mongo.getBlock(blockID); } break;
        case 'POST': if (body) { response = await mongo.createBlock(body); } break;
        case 'PUT': if (body && blockID) { response = await mongo.updateBlock(blockID, body); } break;
        case 'DELETE': if (blockID) { response = await mongo.deleteBlock(blockID); } break;
    }
    return response;
}

function test_returns_block(test_name: string, actual_block: blockType, request_type: HTTPRequest | "GET ALL", 
                            blockID?: string, body?: blockType) {
    test(test_name, async () => {
        const res_block = await make_block_request(request_type, blockID, body);
        if (res_block && typeof res_block !== 'number') {
            expect(res_block.data_grid.i).toBe(actual_block.data_grid.i);
            expect(res_block.data_grid.x).toBe(actual_block.data_grid.x);
            expect(res_block.data_grid.y).toBe(actual_block.data_grid.y);
            expect(res_block.data_grid.w).toBe(actual_block.data_grid.w);
            expect(res_block.data_grid.h).toBe(actual_block.data_grid.h);
            expect(res_block.data_grid.isBounded).toBe(actual_block.data_grid.isBounded);
            expect(res_block.data_grid.isResizable).toBe(actual_block.data_grid.isResizable);
            expect(res_block.link).toBe(actual_block.link);
            expect(res_block.img_url).toBe(actual_block.img_url);
        }
    });
}

beforeAll(async () => {
    await mongo.connectToDatabase("TEST"); 
    await mongo.createBlock(testBlock)
});

afterAll(async () => {
    // await mongo.deleteBlock("testing block");
    await mongo.disconnectFromDatabase();
});

describe("test: getAllBlocks()", () => {
    // recreate the default block because last test deletes it
    afterAll(async () => {
        await mongo.createBlock(testBlock)
    });
    describe("when database is not empty", () => {
        test("should return an array with 1 item", async () => {
            const Blocks = await mongo.getAllBlocks(); 
            expect(Blocks).toBeDefined();
            if (Blocks) { 
                expect(Blocks.length).toBe(1); 
            }
        });
        test_returns_block("should return an array of blocks", testBlock, "GET ALL");
    })
    describe("when database is empty", () => {
        // delete item in database 
        beforeAll(async () => {
            await mongo.deleteBlock("testing block");
        });
        test("should return empty array", async () => {
            const Blocks = await mongo.getAllBlocks();
            expect(Blocks).toBeDefined();
            if (Blocks) { 
                expect(Blocks.length).toBe(0); 
            }
        });
    })
})

describe("test: getBlock()", () => {
    describe("when the specific block exists", () => {
        test_returns_block("should return a block", testBlock, "GET", "testing block");
    })
    describe("when the specific block does not exist", () => {
        test("should return null", async () => {
            const Blocks = await mongo.getBlock("hello");
            expect(Blocks).toBeNull();
        })
    })
})

describe("test: createBlock()", () => {
    describe("when the new block is a block",() => {
        const newBlock = {
            data_grid: { 
                i: "newblock", x: 0, y: 0, w: 4, h: 4, isBounded: true, isResizable: false }, 
            link: "https://twitch.tv", 
            img_url: "https://twitch.tv/favicon.ico" 
        }
        test("should not have newBlock in database", async () => {
            const status = await mongo.getBlock("newblock"); 
            expect(status).toBeNull();
        })
        test("should return 1", async () => {
            const status = await mongo.createBlock(newBlock);
            expect(status).toBe(1);
        })
        test_returns_block("should have newBlock in database", newBlock, "DELETE", "newblock");
    })
})

describe("test: updateBlock()", () => {
    describe("when block exists", () => {
        test_returns_block("should have block in database", testBlock, "GET", "testing block");
        test("should return 1", async () => {
            const status = await mongo.updateBlock("testing block", modBlock);
            expect(status).toBe(1);
        })
        test_returns_block("should still have block in database", modBlock, "GET", "testing block");
    })

    describe("when block does not exist", () => {
        test("should return null", async () => {
            const Blocks = await mongo.updateBlock("hello", testBlock);
            expect(Blocks).toBeNull();
        })
    })
})

describe("test: deleteBlock()", () => {
    describe("when block exists", () => {
        test_returns_block("should have modBlock in database", modBlock, "GET", "testing block");
        test_returns_block("should delete modBlock", modBlock, "DELETE", "testing block");
        test("should not have modBlock in database", async () => {
            const status = await mongo.getBlock("testing block"); 
            expect(status).toBeNull();
        })
    })

    describe("when block does not exist", () => {
        test("should return null", async () => {
            const Blocks = await mongo.deleteBlock("hello");
            expect(Blocks).toBeNull();
        })
    })
})

