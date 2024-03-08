// routes/api/blocks.js

const express = require('express');
const router = express.Router();

// Load Block model
const Block = require('../../models/Block');

// @route   GET api/blocks/test
// @desc    Tests blocks route
// @access  Public
router.get('/test', (req, res) => res.send('Block route testing!'));

// @route   GET api/Blocks
// @desc    Get all Blocks
// @access  Public
router.get('/', (req, res) => {
  Block.find()
    .then(Blocks => res.json(Blocks))
    .catch(err => res.status(404).json({ noBlocksfound: 'No Blocks found' }));
});

// @route   GET api/Blocks/:i
// @desc    Get single Block by i
// @access  Public
router.get('/:i', (req, res) => {
  //Block.findById(req.params.i)
  Block.findOne({i: req.params.i})
    .then(Block => res.json(Block))
    .catch(err => res.status(404).json({ noBlockfound: 'No Block found' }));
});

// @route   POST api/Blocks
// @desc    Add/save Block
// @access  Public
router.post('/', (req, res) => {
  Block.create(req.body)
    .then(Block => res.json({ msg: 'Block added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this Block' }));
});

// @route   PUT api/Blocks/:i
// @desc    Update Block by i
// @access  Public
router.put('/:i', (req, res) => {
  //Block.findByIdAndUpdate(req.params.i, req.body)
  Block.findOneAndUpdate({i: req.params.i})
    .then(Block => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route   DELETE api/Blocks/:i
// @desc    Delete Block by i
// @access  Public
router.delete('/:i', (req, res) => {
  //Block.findByIdAndDelete(req.params.i)
  Block.findOneAndDelete({i: req.params.i})
    .then(Block => res.json({ mgs: 'Block entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such a Block' }));
});

module.exports = router;