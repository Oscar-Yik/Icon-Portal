// routes/api/units.js

import express from 'express';
import { Database } from '../../../layout-types';

export default function(database: Database) {
    const router = express.Router();

    // @route   GET api/units/test
    // @desc    Tests units route
    // @access  Public
    router.get('/test', (req, res) => res.send('unit route testing!'));

    // @route   GET api/units
    // @desc    Get all units
    // @access  Public
    router.get('/', async (req, res) => {
        try {
            const units = await database.getAllUnits(); 
            if (!units) {
                res.status(404).json({ error: 'No units found' });
            } else {
                res.json(units);
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Service Error" });
        }
    });

    // @route   GET api/units/:i
    // @desc    Get single unit by i
    // @access  Public
    router.get('/:i', async (req, res) => {
        try {
            const unit = await database.getUnit(req.params.i); 
            if (!unit) {
                res.status(404).json({ error: 'Specific unit not found' });
            } else {
                res.json(unit);
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Service Error" });
        }
    });

    // @route   POST api/units
    // @desc    Add/save unit
    // @access  Public
    router.post('/', async (req, res) => {
        try {
            const created = await database.createUnit(req.body); 
            if (!created) {
                res.status(404).json({ error: 'unit not created' });
            } else {
                res.json({ msg: 'unit added successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Service Error" });
        } 
    });

    // @route   PUT api/units/:i
    // @desc    Update unit by i
    // @access  Public
    router.put('/:i', async (req, res) => {
        try {
            const updated = await database.updateUnit(req.params.i, req.body); 
            if (!updated) {
                res.status(404).json({ error: 'unit not updated' });
            } else {
                res.json({ msg: 'unit updated successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Service Error" });
        } 
    });

    // @route   DELETE api/units/:i
    // @desc    Delete unit by i
    // @access  Public
    router.delete('/:i', async(req, res) => {
        try {
            const deleted = await database.deleteUnit(req.params.i); 
            if (!deleted) {
                res.status(404).json({ error: 'unit not deleted' });
            } else {
                res.json({ msg: 'unit deleted successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Service Error" });
        } 
    });

    return router;
}

