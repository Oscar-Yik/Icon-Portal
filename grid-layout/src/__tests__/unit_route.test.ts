import request from 'supertest';
import myApp from '../app';
import { blockType, unitType, databaseType } from '../../layout-types';

type HTTPRequest = 'GET'| 'POST' | 'PUT' | 'DELETE';
type simpleError = { error: string }; 
type simpleSuccess = { msg: string };

const connectToDatabase = async (type: databaseType) : Promise<void> => {};
const disconnectFromDatabase = async () : Promise<void> => {};
const getAllBlocks = async () : Promise<blockType[] | null> => { return null };
const getBlock = async (i: string) : Promise<blockType | null> => { return null; };
const createBlock = async (data: blockType) : Promise<number | null> => { return null; };
const updateBlock = async (i: string, data: blockType) : Promise<number | null> => { return null; };
const deleteBlock = async (i: string) : Promise<blockType | null> => { return null};
const getAllUnits = jest.fn();
const getUnit = jest.fn();
const createUnit = jest.fn();
const updateUnit = jest.fn();
const deleteUnit = jest.fn();

const app = myApp({
    connectToDatabase, disconnectFromDatabase, getAllBlocks, getBlock, createBlock, 
    updateBlock, deleteBlock, getAllUnits, getUnit, createUnit, updateUnit, deleteUnit
});

async function make_request(route: string, request_type: HTTPRequest, body?: unitType | simpleError) {
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
                          request_type: HTTPRequest, body?: unitType | simpleError) : void {
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
                                request_type: HTTPRequest, body?: unitType | simpleError) : void {
    test(test_name, async () => {
        const response = await make_request(route, request_type, body); 
        expect(response.body).toEqual(expected);
    })
}

function test_only_called_once(test_name: string, route: string, mockFunction: jest.Mock,
                               request_type: HTTPRequest, body?: unitType | simpleError) : void {
    test(test_name, async () => {
        await make_request(route, request_type, body);
        expect(mockFunction.mock.calls.length).toBe(1);
    })
}

function test_returns_unit(test_name: string, route: string,
                         request_type: HTTPRequest, body?: unitType | simpleError) {
    test(test_name, async () => {
        const response = await make_request(route, request_type, body);
        expect(response.body.key).toBeDefined();
        expect(response.body.value).toBeDefined();
        if (request_type === "POST") {
            expect(response.body._id).toBeDefined();
            expect(response.body.__v).toBeDefined();
        }
    })
}

function test_mock_receives_unit(test_name: string, route: string, mockFunction: jest.Mock, 
                                  request_type: HTTPRequest, body: unitType) {
    test(test_name, async () => {
        await make_request(route, request_type, body);
        expect(mockFunction.mock.calls[0][0].key).toBe(body.key);
        expect(mockFunction.mock.calls[0][0].value).toBe(body.value);
    })
}

describe("GET /api/units", () => {
    describe("when database is not empty", () => {
        beforeEach(() => {
            getAllUnits.mockReset();
            getAllUnits.mockResolvedValue(1);
        });
        test_status_code("should respond with a 200 status code", "/api/units", 200, "GET");
        test_content_type_json("should specify json in the content type header", "/api/units");
        test_not_undefined("should not respond with undefined body", "/api/units");
        test_only_called_once("should only call getAllUnits once", "/api/units", getAllUnits, "GET");
    })

    describe("when database is empty", () => {
        const error_message = { error: "No units found" };
        beforeEach(() => {
            getAllUnits.mockReset();
            getAllUnits.mockResolvedValue(null);
        })
        test_status_code("should respond with a 404 status code", "/api/units", 404, "GET");
        test_response_equal_to("should repond with error message", "/api/units", error_message, "GET");
        test_only_called_once("should only call getAllUnits once", "/api/units", getAllUnits, "GET");
    })

    describe("when database throws error", () => {
        const error_message = { error: "Internal Service Error" };
        beforeEach(() => {
            getAllUnits.mockReset();
            getAllUnits.mockImplementation(() => {
                throw new Error("Internal Service Error");
            });
        })
        test_status_code("should respond with a 500 status code", "/api/units", 500, "GET");
        test_response_equal_to("should repond with error message", "/api/units", error_message, "GET");
        test_only_called_once("should only call getUnit once", "/api/units", getAllUnits, "GET");
    })
})

describe("GET /api/units/:i", () => {
    describe("when database contains unit i", () => {
        const validunit = { key: "key", value: "value" };
        beforeEach(() => {
            getUnit.mockReset();
            getUnit.mockResolvedValue(validunit);
        })
        test_status_code("should respond with a 200 status code", "/api/units/unit%204", 200, "GET");
        test_content_type_json("should specify json in the content type header", "/api/units/unit%204");
        test_not_undefined("should not respond with undefined body", "/api/units/unit%204");
        test_only_called_once("should only call getunit once", "/api/units/unit%204", getUnit, "GET");
        test_returns_unit("should respond with a unit", "/api/units/unit%204", "GET");
    }) 

    describe("when database does not contain unit i", () => {
        const error_message = { error: "Specific unit not found" };
        beforeEach(() => {
            getUnit.mockReset();
            getUnit.mockResolvedValue(null);
        })
        test_status_code("should respond with a 404 status code", "/api/units/ThisunitDoesNotExist", 404, "GET");
        test_response_equal_to("should repond with error message", "/api/units/ThisunitDoesNotExist", error_message, "GET");
        test_only_called_once("should only call getunit once", "/api/units/ThisunitDoesNotExist", getUnit, "GET");
    })

    describe("when database throws error", () => {
        const error_message = { error: "Internal Service Error" };
        beforeEach(() => {
            getUnit.mockReset();
            getUnit.mockImplementation(() => {
                throw new Error("Internal Service Error");
            });
        })
        test_status_code("should respond with a 500 status code", "/api/units/unit%204", 500, "GET");
        test_response_equal_to("should repond with error message", "/api/units/unit%204", error_message, "GET");
        test_only_called_once("should only call getunit once", "/api/units/unit%204", getUnit, "GET");
    })
})

describe("POST /api/units", () => {
    describe("when request body is valid", () => {
        const validunit = { key: "key", value: "value" };
        beforeEach(() => {
            createUnit.mockReset();
            createUnit.mockResolvedValue(validunit);
        })
        test_status_code("should respond with a 200 status code", "/api/units", 200, "POST", validunit);
        test_only_called_once("should only call createunit once", "/api/units/", createUnit, "POST", validunit);
        test_mock_receives_unit("should save unit to database", "/api/units", createUnit, "POST", validunit);
    })

    describe("when request body is not valid", () => {
        const invalidunit = { error: "This isn't a unit" };
        const error_message = { error: 'unit not created' };
        beforeEach(() => {
            createUnit.mockReset();
            createUnit.mockResolvedValue(null);
        })
        test_status_code("should respond with a 404 status code", "/api/units", 404, "POST", invalidunit);
        test_response_equal_to("should repond with error message", "/api/units/", error_message, "POST", invalidunit);
        test_only_called_once("should only call createunit once", "/api/units/", createUnit, "POST", invalidunit);
    })

    describe("when database throws error", () => {
        const validunit = { key: "key", value: "value" };
        const error_message = { error: "Internal Service Error" };
        beforeEach(() => {
            createUnit.mockReset();
            createUnit.mockImplementation(() => {
                throw new Error("Internal Service Error");
            });
        })
        test_status_code("should respond with a 500 status code", "/api/units/", 500, "POST", validunit);
        test_response_equal_to("should repond with error message", "/api/units/", error_message, "POST", validunit);
        test_only_called_once("should only call createunit once", "/api/units/", createUnit, "POST", validunit);
    })
})

describe("PUT /api/units/:i", () => {
    describe("when unit exists", () => {
        const validunit = { key: "key", value: "value" };
        const success_message = { msg: 'unit updated successfully' };
        beforeEach(() => {
            updateUnit.mockReset();
            updateUnit.mockResolvedValue(validunit);
        })
        test_status_code("should respond with a 200 status code", "/api/units/testing%20unit", 200, "PUT", validunit);
        test_only_called_once("should only call updateunit once", "/api/units/testing%20unit", updateUnit, "PUT", validunit);
        test_response_equal_to("should repond with success message", "/api/units/fake%20unit", success_message, "PUT", validunit);
    })

    describe("when unit data is invalid", () => {
        const invalidunit = { error: "This isn't a unit" };
        const error_message = { error: 'unit not updated' };
        beforeEach(() => {
            updateUnit.mockReset();
            updateUnit.mockResolvedValue(null);
        })
        test_status_code("should respond with a 404 status code", "/api/units/bad", 404, "PUT", invalidunit);
        test_response_equal_to("should repond with error message", "/api/units/bad", error_message, "PUT", invalidunit);
        test_only_called_once("should only call updateunit once", "/api/units/bad", updateUnit, "PUT", invalidunit);
    })

    describe("when unit does not exist", () => {
        const fakeunit = { key: "key", value: "value" };
        const error_message = { error: 'unit not updated' };
        beforeEach(() => {
            updateUnit.mockReset();
            updateUnit.mockResolvedValue(null);
        })
        test_status_code("should respond with a 404 status code", "/api/units/fake%20unit", 404, "PUT", fakeunit);
        test_response_equal_to("should repond with error message", "/api/units/fake%20unit", error_message, "PUT", fakeunit);
        test_only_called_once("should only call updateunit once", "/api/units/fake%20unit", updateUnit, "PUT", fakeunit);
    })

    describe("when database throws error", () => {
        const validunit = { key: "key", value: "value" };
        const error_message = { error: "Internal Service Error" };
        beforeEach(() => {
            updateUnit.mockReset();
            updateUnit.mockImplementation(() => {
                throw new Error("Internal Service Error");
            });
        })
        test_status_code("should respond with a 500 status code", "/api/units/unit%204", 500, "PUT", validunit);
        test_response_equal_to("should repond with error message", "/api/units/unit%204", error_message, "PUT", validunit);
        test_only_called_once("should only call updateunit once", "/api/units/unit%204", updateUnit, "PUT", validunit);
    })
})

describe("DELETE /api/units/:i", () => {
    describe("when a unit is deleted", () => {
        const success_message = { msg: 'unit deleted successfully' };
        beforeEach(() => {
            deleteUnit.mockReset();
            deleteUnit.mockResolvedValue(1);
        })
        test_status_code("should respond with a 200 status code", "/api/units/unit%204", 200, "DELETE");
        test_response_equal_to("should repond with success message", "/api/units/fake%20unit", success_message, "DELETE");
        test_only_called_once("should only call deleteunit once", "/api/units/unit%204", deleteUnit, "DELETE");
    })

    describe("when a unit doesn't get deleted", () => {
        const error_message = { error: 'unit not deleted' };
        beforeEach(() => {
            deleteUnit.mockReset();
            deleteUnit.mockResolvedValue(null);
        })
        test_status_code("should respond with a 404 status code", "/api/units/fake%20unit", 404, "DELETE");
        test_response_equal_to("should repond with error message", "/api/units/fake%20unit", error_message, "DELETE");
        test_only_called_once("should only call deleteunit once", "/api/units/fake%20unit", deleteUnit, "DELETE");
    })

    describe("when database throws error", () => {
        const error_message = { error: "Internal Service Error" };
        beforeEach(() => {
            deleteUnit.mockReset();
            deleteUnit.mockImplementation(() => {
                throw new Error("Internal Service Error");
            });
        })
        test_status_code("should respond with a 500 status code", "/api/units/unit%204", 500, "DELETE");
        test_response_equal_to("should repond with error message", "/api/units/unit%204", error_message, "DELETE");
        test_only_called_once("should only call deleteunit once", "/api/units/unit%204", deleteUnit, "DELETE");
    })
})
