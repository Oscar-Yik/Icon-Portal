// routes/api/blocks.js

import express from 'express';
const router = express.Router();

// Load Block model
import Block from '../../models/Block';

// @route   GET api/blocks/test
// @desc    Tests blocks route
// @access  Public
router.get('/test', (req, res) => res.send('Block route testing!'));

// @route   GET api/blocks
// @desc    Get all Blocks
// @access  Public
router.get('/', (req, res) => {
  // const query = {
  //   i: { $exists: true }
  // };
  Block.find({})
    .select('-_id -__v')
    .then(Blocks => res.json(Blocks))
    .catch(err => res.status(404).json({ noBlocksfound: 'No Blocks found' }));
});

// @route   GET api/blocks/:i
// @desc    Get single Block by i
// @access  Public
router.get('/:i', (req, res) => {
  //Block.findById(req.params.i)
  Block.findOne({ "data_grid.i": req.params.i })
    .select('-_id -__v')
    .then(Block => res.json(Block))
    .catch(err => res.status(404).json({ noBlockfound: 'No Block found' }));
});

// @route   POST api/blocks
// @desc    Add/save Block
// @access  Public
router.post('/', (req, res) => {
  Block.create(req.body)
    .then(Block => res.json({ msg: 'Block added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this Block' }));
});

// @route   PUT api/blocks/:i
// @desc    Update Block by i
// @access  Public
router.put('/:i', (req, res) => {
  //Block.findByIdAndUpdate(req.params.i, req.body)
  Block.findOneAndUpdate({ "data_grid.i": req.params.i }, req.body, { new: true })
    .then(Block => {
      if (!Block) {
        return res.status(404).json({error: "Block not found"});
      }  
      res.json({ msg: 'Updated successfully', block: Block })
    })
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route   DELETE api/blocks/:i
// @desc    Delete Block by i
// @access  Public
router.delete('/:i', (req, res) => {
  //Block.findByIdAndDelete(req.params.i)
  Block.findOneAndDelete({ "data_grid.i": req.params.i })
    .then(Block => res.json({ mgs: 'Block entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such a Block' }));
});

export default router;