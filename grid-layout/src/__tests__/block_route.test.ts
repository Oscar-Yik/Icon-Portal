import request from 'supertest';
import myApp from '../app';
import { blockType, unitType, databaseType, HTTPRequest } from '../../layout-types';

type simpleError = { error: string }; 
type simpleSuccess = { msg: string };

const connectToDatabase = async (type: databaseType) : Promise<void> => {};
const disconnectFromDatabase = async () : Promise<void> => {};
const getAllBlocks = jest.fn();
const getBlock = jest.fn();
const createBlock = jest.fn();
const updateBlock = jest.fn();
const deleteBlock = jest.fn();
const getAllUnits = async () : Promise<unitType[] | null> => { return null };
const getUnit = async (i: string) : Promise<unitType | null> => { return null; };
const createUnit = async (data: unitType) : Promise<number | null> => { return null; };
const updateUnit = async (i: string, data: unitType) : Promise<number | null> => { return null; };
const deleteUnit = async (i: string) : Promise<unitType | null> => { return null};

const app = myApp({
    connectToDatabase, disconnectFromDatabase, getAllBlocks, getBlock, createBlock, 
    updateBlock, deleteBlock, getAllUnits, getUnit, createUnit, updateUnit, deleteUnit
});

async function make_request(route: string, request_type: HTTPRequest, body?: blockType | simpleError) {
    let response; 
    switch(request_type) {
        case 'GET': response = await request(app).get(route); break;
        case 'POST': response = await request(app).post(route).send(body); break;
        case 'PUT': response = await request(app).put(route).send(body); break;
        case 'DELETE': response = await request(app).delete(route); break;
    }
    return response;
}

function test_status_code(test_name: string, route: string, status_code: number, 
                          request_type: HTTPRequest, body?: blockType | simpleError) : void {
    test(test_name, async () => {
        const response = await make_request(route, request_type, body);
        expect(response.statusCode).toBe(status_code);
    })
}

function test_content_type_json(test_name: string, route: string) : void {
    test(test_name, async () => {
        const response = await request(app).get(route); 
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
    })
}

function test_not_undefined(test_name: string, route: string) : void {
    test(test_name, async () => {
        const response = await request(app).get(route); 
        expect(response.body).toBeDefined();
    })
}

function test_response_equal_to(test_name: string, route: string, expected: simpleError | simpleSuccess,
                                request_type: HTTPRequest, body?: blockType | simpleError) : void {
    test(test_name, async () => {
        const response = await make_request(route, request_type, body); 
        expect(response.body).toEqual(expected);
    })
}

function test_only_called_once(test_name: string, route: string, mockFunction: jest.Mock,
                               request_type: HTTPRequest, body?: blockType | simpleError) : void {
    test(test_name, async () => {
        await make_request(route, request_type, body);
        expect(mockFunction.mock.calls.length).toBe(1);
    })
}

function test_returns_block(test_name: string, route: string,
                         request_type: HTTPRequest, body?: blockType | simpleError) {
    test(test_name, async () => {
        const response = await make_request(route, request_type, body);
        expect(response.body.data_grid.i).toBeDefined();
        expect(response.body.data_grid.x).toBeDefined();
        expect(response.body.data_grid.y).toBeDefined();
        expect(response.body.data_grid.h).toBeDefined();
        expect(response.body.data_grid.isBounded).toBeDefined();
        expect(response.body.data_grid.isResizable).toBeDefined();
        expect(response.body.link).toBeDefined();
        expect(response.body.img_url).toBeDefined();
        if (request_type === "POST") {
            expect(response.body._id).toBeDefined();
            expect(response.body.__v).toBeDefined();
        }
    })
}

function test_mock_receives_block(test_name: string, route: string, mockFunction: jest.Mock, 
                                  request_type: HTTPRequest, body: blockType) {
    test(test_name, async () => {
        await make_request(route, request_type, body);
        expect(mockFunction.mock.calls[0][0].data_grid.i).toBe(body.data_grid.i);
        expect(mockFunction.mock.calls[0][0].data_grid.x).toBe(body.data_grid.x);
        expect(mockFunction.mock.calls[0][0].data_grid.y).toBe(body.data_grid.y);
        expect(mockFunction.mock.calls[0][0].data_grid.h).toBe(body.data_grid.h)
        expect(mockFunction.mock.calls[0][0].data_grid.isBounded).toBe(body.data_grid.isBounded);
        expect(mockFunction.mock.calls[0][0].data_grid.isResizable).toBe(body.data_grid.isResizable);
        expect(mockFunction.mock.calls[0][0].link).toBe(body.link);
        expect(mockFunction.mock.calls[0][0].img_url).toBe(body.img_url);
    })
}

describe("GET /api/blocks", () => {
    describe("when database is not empty", () => {
        beforeEach(() => {
            getAllBlocks.mockReset();
            getAllBlocks.mockResolvedValue(1);
        });
        test_status_code("should respond with a 200 status code", "/api/blocks", 200, "GET");
        test_content_type_json("should specify json in the content type header", "/api/blocks");
        test_not_undefined("should not respond with undefined body", "/api/blocks");
        test_only_called_once("should only call getAllBlocks once", "/api/blocks", getAllBlocks, "GET");
    })

    describe("when database is empty", () => {
        const error_message = { error: "No Blocks found" };
        beforeEach(() => {
            getAllBlocks.mockReset();
            getAllBlocks.mockResolvedValue(null);
        })
        test_status_code("should respond with a 404 status code", "/api/blocks", 404, "GET");
        test_response_equal_to("should repond with error message", "/api/blocks", error_message, "GET");
        test_only_called_once("should only call getBlock once", "/api/blocks", getAllBlocks, "GET");
    })

    describe("when database throws error", () => {
        const error_message = { error: "Internal Service Error" };
        beforeEach(() => {
            getAllBlocks.mockReset();
            getAllBlocks.mockImplementation(() => {
                throw new Error("Internal Service Error");
            });
        })
        test_status_code("should respond with a 500 status code", "/api/blocks", 500, "GET");
        test_response_equal_to("should repond with error message", "/api/blocks", error_message, "GET");
        test_only_called_once("should only call getBlock once", "/api/blocks", getAllBlocks, "GET");
    })
})

describe("GET /api/blocks/:i", () => {
    describe("when database contains block i", () => {
        const validBlock = { 
            data_grid: { 
                i: "testing block", x: 0, y: 0, w: 4, h: 4, isBounded: true, isResizable: false }, 
            link: "https://twitch.tv", 
            img_url: "https://twitch.tv/favicon.ico" 
        };
        beforeEach(() => {
            getBlock.mockReset();
            getBlock.mockResolvedValue(validBlock);
        })
        test_status_code("should respond with a 200 status code", "/api/blocks/Block%204", 200, "GET");
        test_content_type_json("should specify json in the content type header", "/api/blocks/Block%204");
        test_not_undefined("should not respond with undefined body", "/api/blocks/Block%204");
        test_only_called_once("should only call getBlock once", "/api/blocks/Block%204", getBlock, "GET");
        test_returns_block("should respond with a block", "/api/blocks/Block%204", "GET");
    }) 

    describe("when database does not contain block i", () => {
        const error_message = { error: "Specific Block not found" };
        beforeEach(() => {
            getBlock.mockReset();
            getBlock.mockResolvedValue(null);
        })
        test_status_code("should respond with a 404 status code", "/api/blocks/ThisBlockDoesNotExist", 404, "GET");
        test_response_equal_to("should repond with error message", "/api/blocks/ThisBlockDoesNotExist", error_message, "GET");
        test_only_called_once("should only call getBlock once", "/api/blocks/ThisBlockDoesNotExist", getBlock, "GET");
    })

    describe("when database throws error", () => {
        const error_message = { error: "Internal Service Error" };
        beforeEach(() => {
            getBlock.mockReset();
            getBlock.mockImplementation(() => {
                throw new Error("Internal Service Error");
            });
        })
        test_status_code("should respond with a 500 status code", "/api/blocks/Block%204", 500, "GET");
        test_response_equal_to("should repond with error message", "/api/blocks/Block%204", error_message, "GET");
        test_only_called_once("should only call getBlock once", "/api/blocks/Block%204", getBlock, "GET");
    })
})

describe("POST /api/blocks", () => {
    describe("when request body is valid", () => {
        const validBlock = { 
            data_grid: { 
                i: "testing block", x: 0, y: 0, w: 4, h: 4, isBounded: true, isResizable: false }, 
            link: "https://twitch.tv", 
            img_url: "https://twitch.tv/favicon.ico" 
        };
        beforeEach(() => {
            createBlock.mockReset();
            createBlock.mockResolvedValue(validBlock);
        })
        test_status_code("should respond with a 200 status code", "/api/blocks", 200, "POST", validBlock);
        test_only_called_once("should only call createBlock once", "/api/blocks/", createBlock, "POST", validBlock);
        test_mock_receives_block("should save block to database", "/api/blocks", createBlock, "POST", validBlock);
    })

    describe("when request body is not valid", () => {
        const invalidBlock = { error: "This isn't a block" };
        const error_message = { error: 'Block not created' };
        beforeEach(() => {
            createBlock.mockReset();
            createBlock.mockResolvedValue(null);
        })
        test_status_code("should respond with a 404 status code", "/api/blocks", 404, "POST", invalidBlock);
        test_response_equal_to("should repond with error message", "/api/blocks/", error_message, "POST", invalidBlock);
        test_only_called_once("should only call createBlock once", "/api/blocks/", createBlock, "POST", invalidBlock);
    })

    describe("when database throws error", () => {
        const validBlock = { 
            data_grid: { 
                i: "testing block", x: 0, y: 0, w: 4, h: 4, isBounded: true, isResizable: false }, 
            link: "https://twitch.tv", 
            img_url: "https://twitch.tv/favicon.ico" 
        };
        const error_message = { error: "Internal Service Error" };
        beforeEach(() => {
            createBlock.mockReset();
            createBlock.mockImplementation(() => {
                throw new Error("Internal Service Error");
            });
        })
        test_status_code("should respond with a 500 status code", "/api/blocks/", 500, "POST", validBlock);
        test_response_equal_to("should repond with error message", "/api/blocks/", error_message, "POST", validBlock);
        test_only_called_once("should only call createBlock once", "/api/blocks/", createBlock, "POST", validBlock);
    })
})

describe("PUT /api/blocks/:i", () => {
    describe("when block exists", () => {
        const validBlock = { 
            data_grid: { 
                i: "testing block", x: 0, y: 0, w: 4, h: 4, isBounded: true, isResizable: false }, 
            link: "https://twitch.tv", 
            img_url: "https://twitch.tv/favicon.ico" 
        };
        const success_message = { msg: 'Block updated successfully' };
        beforeEach(() => {
            updateBlock.mockReset();
            updateBlock.mockResolvedValue(validBlock);
        })
        test_status_code("should respond with a 200 status code", "/api/blocks/testing%20block", 200, "PUT", validBlock);
        test_only_called_once("should only call updateBlock once", "/api/blocks/testing%20block", updateBlock, "PUT", validBlock);
        test_response_equal_to("should repond with success message", "/api/blocks/fake%20block", success_message, "PUT", validBlock);
    })

    describe("when block data is invalid", () => {
        const invalidBlock = { error: "This isn't a block" };
        const error_message = { error: 'Block not updated' };
        beforeEach(() => {
            updateBlock.mockReset();
            updateBlock.mockResolvedValue(null);
        })
        test_status_code("should respond with a 404 status code", "/api/blocks/bad", 404, "PUT", invalidBlock);
        test_response_equal_to("should repond with error message", "/api/blocks/bad", error_message, "PUT", invalidBlock);
        test_only_called_once("should only call updateBlock once", "/api/blocks/bad", updateBlock, "PUT", invalidBlock);
    })

    describe("when block does not exist", () => {
        const fakeBlock = { 
            data_grid: { 
                i: "fake block", x: 0, y: 0, w: 4, h: 4, isBounded: true, isResizable: false }, 
            link: "https://twitch.tv", 
            img_url: "https://twitch.tv/favicon.ico" 
        };
        const error_message = { error: 'Block not updated' };
        beforeEach(() => {
            updateBlock.mockReset();
            updateBlock.mockResolvedValue(null);
        })
        test_status_code("should respond with a 404 status code", "/api/blocks/fake%20block", 404, "PUT", fakeBlock);
        test_response_equal_to("should repond with error message", "/api/blocks/fake%20block", error_message, "PUT", fakeBlock);
        test_only_called_once("should only call updateBlock once", "/api/blocks/fake%20block", updateBlock, "PUT", fakeBlock);
    })

    describe("when database throws error", () => {
        const validBlock = { 
            data_grid: { 
                i: "testing block", x: 0, y: 0, w: 4, h: 4, isBounded: true, isResizable: false }, 
            link: "https://twitch.tv", 
            img_url: "https://twitch.tv/favicon.ico" 
        };
        const error_message = { error: "Internal Service Error" };
        beforeEach(() => {
            updateBlock.mockReset();
            updateBlock.mockImplementation(() => {
                throw new Error("Internal Service Error");
            });
        })
        test_status_code("should respond with a 500 status code", "/api/blocks/Block%204", 500, "PUT", validBlock);
        test_response_equal_to("should repond with error message", "/api/blocks/Block%204", error_message, "PUT", validBlock);
        test_only_called_once("should only call updateBlock once", "/api/blocks/Block%204", updateBlock, "PUT", validBlock);
    })
})

describe("DELETE /api/blocks/:i", () => {
    describe("when a block is deleted", () => {
        const success_message = { msg: 'Block deleted successfully' };
        beforeEach(() => {
            deleteBlock.mockReset();
            deleteBlock.mockResolvedValue(1);
        })
        test_status_code("should respond with a 200 status code", "/api/blocks/Block%204", 200, "DELETE");
        test_response_equal_to("should repond with success message", "/api/blocks/fake%20block", success_message, "DELETE");
        test_only_called_once("should only call deleteBlock once", "/api/blocks/Block%204", deleteBlock, "DELETE");
    })

    describe("when a block doesn't get deleted", () => {
        const error_message = { error: 'Block not deleted' };
        beforeEach(() => {
            deleteBlock.mockReset();
            deleteBlock.mockResolvedValue(null);
        })
        test_status_code("should respond with a 404 status code", "/api/blocks/fake%20block", 404, "DELETE");
        test_response_equal_to("should repond with error message", "/api/blocks/fake%20block", error_message, "DELETE");
        test_only_called_once("should only call deleteBlock once", "/api/blocks/fake%20block", deleteBlock, "DELETE");
    })

    describe("when database throws error", () => {
        const error_message = { error: "Internal Service Error" };
        beforeEach(() => {
            deleteBlock.mockReset();
            deleteBlock.mockImplementation(() => {
                throw new Error("Internal Service Error");
            });
        })
        test_status_code("should respond with a 500 status code", "/api/blocks/Block%204", 500, "DELETE");
        test_response_equal_to("should repond with error message", "/api/blocks/Block%204", error_message, "DELETE");
        test_only_called_once("should only call deleteBlock once", "/api/blocks/Block%204", deleteBlock, "DELETE");
    })
})
