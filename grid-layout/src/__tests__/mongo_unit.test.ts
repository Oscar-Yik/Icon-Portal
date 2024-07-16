import mongo from '../database/mongo';
import { unitType, HTTPRequest } from '../../layout-types';

const testUnit : unitType = { key: "testing unit", value: "value" }

const modUnit : unitType = { key: "testing unit", value: "different value" }

async function make_unit_request(request_type: HTTPRequest | "GET ALL", unitKey?: string, body?: unitType) {
    let response; 
    switch(request_type) {
        case 'GET ALL': const temp = await mongo.getAllUnits(); if (temp) { response = temp[0]; } break;
        case 'GET': if (unitKey) { response = await mongo.getUnit(unitKey); } break;
        case 'POST': if (body) { response = await mongo.createUnit(body); } break;
        case 'PUT': if (body && unitKey) { response = await mongo.updateUnit(unitKey, body); } break;
        case 'DELETE': if (unitKey) { response = await mongo.deleteUnit(unitKey); } break;
    }
    return response;
}

function test_returns_unit(test_name: string, actual_unit: unitType, request_type: HTTPRequest | "GET ALL", 
                            unitKey?: string, body?: unitType) {
    test(test_name, async () => {
        const res_unit = await make_unit_request(request_type, unitKey, body);
        if (res_unit && typeof res_unit !== 'number') {
            expect(res_unit.key).toBe(actual_unit.key);
            expect(res_unit.value).toBe(actual_unit.value);
        }
    });
}

beforeAll(async () => {
    await mongo.connectToDatabase("TEST"); 
    await mongo.createUnit(testUnit)
});

afterAll(async () => {
    // await mongo.deleteUnit("testing unit");
    await mongo.disconnectFromDatabase();
});

describe("test: getAllUnits()", () => {
    // recreate the default unit because last test deletes it
    afterAll(async () => {
        await mongo.createUnit(testUnit)
    });
    describe("when database is not empty", () => {
        test("should return an array with 1 item", async () => {
            const Units = await mongo.getAllUnits(); 
            expect(Units).toBeDefined();
            if (Units) { 
                expect(Units.length).toBe(1); 
            }
        });
        test_returns_unit("should return an array of units", testUnit, "GET ALL");
    })
    describe("when database is empty", () => {
        // delete item in database 
        beforeAll(async () => {
            await mongo.deleteUnit("testing unit");
        });
        test("should return empty array", async () => {
            const Units = await mongo.getAllUnits();
            expect(Units).toBeDefined();
            if (Units) { 
                expect(Units.length).toBe(0); 
            }
        });
    })
})

describe("test: getUnit()", () => {
    describe("when the specific unit exists", () => {
        test_returns_unit("should return a unit", testUnit, "GET", "testing unit");
    })
    describe("when the specific unit does not exist", () => {
        test("should return null", async () => {
            const Units = await mongo.getUnit("hello");
            expect(Units).toBeNull();
        })
    })
})

describe("test: createUnit()", () => {
    describe("when the new unit is a unit",() => {
        const newUnit = { key: "newUnit", value: "new value" }
        test("should not have newUnit in database", async () => {
            const status = await mongo.getUnit("newUnit"); 
            expect(status).toBeNull();
        })
        test("should return 1", async () => {
            const status = await mongo.createUnit(newUnit);
            expect(status).toBe(1);
        })
        test_returns_unit("should have newUnit in database", newUnit, "DELETE", "newUnit");
    })
})

describe("test: updateUnit()", () => {
    describe("when unit exists", () => {
        test_returns_unit("should have unit in database", testUnit, "GET", "testing unit");
        test("should return 1", async () => {
            const status = await mongo.updateUnit("testing unit", modUnit);
            expect(status).toBe(1);
        })
        test_returns_unit("should still have unit in database", modUnit, "GET", "testing unit");
    })

    describe("when unit does not exist", () => {
        test("should return null", async () => {
            const Units = await mongo.updateUnit("hello", testUnit);
            expect(Units).toBeNull();
        })
    })
})

describe("test: deleteUnit()", () => {
    describe("when unit exists", () => {
        test_returns_unit("should have modUnit in database", modUnit, "GET", "testing unit");
        test_returns_unit("should delete modUnit", modUnit, "DELETE", "testing unit");
        test("should not have modUnit in database", async () => {
            const status = await mongo.getUnit("testing unit"); 
            expect(status).toBeNull();
        })
    })

    describe("when unit does not exist", () => {
        test("should return null", async () => {
            const Units = await mongo.deleteUnit("hello");
            expect(Units).toBeNull();
        })
    })
})

