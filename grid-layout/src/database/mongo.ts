import { blockType, unitType } from '../../layout-types';
import Block from '../models/Block';
import Unit from '../models/Unit';
import connectDB from "../config/db";
import getErrorMessage from '../../Errors';

export async function connectToDatabase() {
    connectDB();
}

// Block functions

async function getAllBlocks() : Promise<blockType[] | null>{
    try {
        const Blocks = await Block.find({}).select('-_id -__v').lean<blockType[]>()
        return Blocks;
    } catch (error) {
        console.error("Error fetching Blocks:", getErrorMessage(error));
        return null;
    }
}

async function getBlock(i: string) : Promise<blockType | null> {
    try {
        const block = await Block.findOne({ "data_grid.i": i }).select('-_id -__v')
        return block;
    } catch (error) {
        console.error("Error fetching Specific Block:", getErrorMessage(error));
        return null;
    }
}

async function createBlock(data: blockType) : Promise<number | null> {
    try {
        await Block.create(data);
        return 1; 
    } catch (error) {
        console.error("Error couldn't create block:", getErrorMessage(error));
        return null;
    }
}

async function updateBlock(i: string, data: blockType) : Promise<number | null> {
    try {
        await Block.findOneAndUpdate({ "data_grid.i": i }, data, { new: true });
        return 1; 
    } catch (error) {
        console.error("Error couldn't update block:", getErrorMessage(error));
        return null;
    }
}

async function deleteBlock(i: string) : Promise<number | null> {
    try {
        await Block.findOneAndDelete({ "data_grid.i": i })
        return 1; 
    } catch (error) {
        console.error("Error couldn't delete block:", getErrorMessage(error));
        return null;
    }
}

// Unit functions 

async function getAllUnits() : Promise<unitType[] | null>{
    try {
        const Units = await Unit.find({}).select('-_id -__v').lean<unitType[]>()
        return Units;
    } catch (error) {
        console.error("Error fetching Units:", getErrorMessage(error));
        return null;
    }
}

async function getUnit(i: string) : Promise<unitType | null> {
    try {
        const unit = await Unit.findOne({ "key": i }).select('-_id -__v')
        return unit;
    } catch (error) {
        console.error("Error fetching Specific Unit:", getErrorMessage(error));
        return null;
    }
}

async function createUnit(data: unitType) : Promise<number | null> {
    try {
        await Unit.create(data);
        return 1; 
    } catch (error) {
        console.error("Error couldn't create unit:", getErrorMessage(error));
        return null;
    }
}

async function updateUnit(i: string, data: unitType) : Promise<number | null> {
    try {
        await Unit.findOneAndUpdate({ "key": i }, data, { new: true });
        return 1; 
    } catch (error) {
        console.error("Error couldn't update unit:", getErrorMessage(error));
        return null;
    }
}

async function deleteUnit(i: string) : Promise<number | null> {
    try {
        await Unit.findOneAndDelete({ "key": i })
        return 1; 
    } catch (error) {
        console.error("Error couldn't delete unit:", getErrorMessage(error));
        return null;
    }
}

const mongo = { connectToDatabase, getAllBlocks, getBlock, createBlock, updateBlock, deleteBlock, 
                getAllUnits, getUnit, createUnit, updateUnit, deleteUnit }; 

export default mongo;

