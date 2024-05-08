// routes/api/blocks.js

const express = require('express');
const router = express.Router();

// Load Block model
const Block = require('../../models/Block');
const Thing = require('../../models/Thing');

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
  Block.find({ i: { $exists: true } })
    .then(Blocks => res.json(Blocks))
    .catch(err => res.status(404).json({ noBlocksfound: 'No Blocks found' }));
});

// @route   GET api/blocks/background
// @desc    Get background image 
// @access  Public
router.get('/background', (req, res) => {
  Thing.findOne({type: "backgroundImage"})
    .then(Thing => res.json(Thing))
    .catch(err => res.status(404).json({ noBlockfound: 'No background image found' }));
});


// @route   GET api/blocks/:i
// @desc    Get single Block by i
// @access  Public
// router.get('/:i', (req, res) => {
//   //Block.findById(req.params.i)
//   Block.findOne({i: req.params.i})
//     .then(Block => res.json(Block))
//     .catch(err => res.status(404).json({ noBlockfound: 'No Block found' }));
// });

// @route   POST api/blocks
// @desc    Add/save Block
// @access  Public
router.post('/', (req, res) => {
  Block.create(req.body)
    .then(Block => res.json({ msg: 'Block added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this Block' }));
});

// @route   PUT api/blocks/background
// @desc    Update Background Image
// @access  Public
router.put('/background', (req, res) => {
  //Block.findByIdAndUpdate(req.params.i, req.body)
  Thing.findOneAndUpdate({type: "backgroundImage"}, {url: req.body.url}, {new: true})
    .then(() => res.json({ msg: 'Updated successfully', url: req.body.url }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route   PUT api/blocks/:i
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

// @route   DELETE api/blocks/:i
// @desc    Delete Block by i
// @access  Public
router.delete('/:i', (req, res) => {
  //Block.findByIdAndDelete(req.params.i)
  Block.findOneAndDelete({i: req.params.i})
    .then(Block => res.json({ mgs: 'Block entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such a Block' }));
});

module.exports = router;