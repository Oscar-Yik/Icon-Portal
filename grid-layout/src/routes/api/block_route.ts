// routes/api/blocks.js

import express from 'express';
import { Database } from '../../../layout-types';

export default function(database: Database) {
    const router = express.Router();

    // @route   GET api/blocks/test
    // @desc    Tests blocks route
    // @access  Public
    router.get('/test', (req, res) => res.send('Block route testing!'));

    // @route   GET api/blocks
    // @desc    Get all Blocks
    // @access  Public
    router.get('/', async (req, res) => {
        try {
            const blocks = await database.getAllBlocks(); 
            if (!blocks) {
                res.status(404).json({ error: 'No Blocks found' });
            } else {
                res.json(blocks);
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Service Error" });
        }
    });

    // @route   GET api/blocks/:i
    // @desc    Get single Block by i
    // @access  Public
    router.get('/:i', async (req, res) => {
        try {
            const block = await database.getBlock(req.params.i); 
            if (!block) {
                res.status(404).json({ error: 'Specific Block not found' });
            } else {
                res.json(block);
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Service Error" });
        }
    });

    // @route   POST api/blocks
    // @desc    Add/save Block
    // @access  Public
    router.post('/', async (req, res) => {
        try {
            const created = await database.createBlock(req.body); 
            if (!created) {
                res.status(404).json({ error: 'Block not created' });
            } else {
                res.json({ msg: 'Block added successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Service Error" });
        } 
    });

    // @route   PUT api/blocks/:i
    // @desc    Update Block by i
    // @access  Public
    router.put('/:i', async (req, res) => {
        try {
            const updated = await database.updateBlock(req.params.i, req.body); 
            if (!updated) {
                res.status(404).json({ error: 'Block not updated' });
            } else {
                res.json({ msg: 'Block updated successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Service Error" });
        } 
    });

    // @route   DELETE api/blocks/:i
    // @desc    Delete Block by i
    // @access  Public
    router.delete('/:i', async(req, res) => {
        try {
            const deleted = await database.deleteBlock(req.params.i); 
            if (!deleted) {
                res.status(404).json({ error: 'Block not deleted' });
            } else {
                res.json({ msg: 'Block deleted successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Service Error" });
        } 
    });

    return router;
}

