// routes/api/things.js

const express = require('express');
const router = express.Router();

// Load Thing model
const Thing = require('../../models/Thing');

// @route   GET api/things/test
// @desc    Tests things route
// @access  Public
router.get('/test', (req, res) => res.send('Thing route testing!'));

// @route   GET api/things
// @desc    Get all Things
// @access  Public
router.get('/', (req, res) => {
  Thing.find({})
    .select('-_id -__v')
    .then(Things => res.json(Things))
    .catch(err => res.status(404).json({ noThingsfound: 'No Things found' }));
});

// @route   GET api/things/background
// @desc    Get background image 
// @access  Public
router.get('/background', (req, res) => {
  Thing.findOne({type: "backgroundImage"})
    .select('-_id')
    .then(Thing => res.json(Thing))
    .catch(err => res.status(404).json({ noThingfound: 'No background image found' }));
});

// @route   GET api/things/color
// @desc    Get all colors
// @access  Public
router.get('/color', (req, res) => {
  Thing.find({ type: { $nin: ['backgroundImage', 'nameID'] } })
    .select('-_id -__v')
    .then(Thing => res.json(Thing))
    .catch(err => res.status(404).json({ noThingfound: 'No colors found' }));
});

// @route   GET api/things/nameID
// @desc    Get header nameID
// @access  Public
router.get('/nameID', (req, res) => {
  Thing.findOne({type: "nameID"})
    .select('-_id')
    .then(Thing => res.json(Thing))
    .catch(err => res.status(404).json({ noBlockfound: 'No nameID found' }));
});

// @route   POST api/things
// @desc    Add/save Thing
// @access  Public
router.post('/', (req, res) => {
  Thing.create(req.body)
    .then(Thing => res.json({ msg: 'Thing added successfully', Thing: Thing }))
    .catch(err => res.status(400).json({ error: 'Unable to add this Thing' }));
});

// @route   PUT api/things/:i
// @desc    Update Thing by i
// @access  Public
router.put('/:i', (req, res) => {
  //Block.findByIdAndUpdate(req.params.i, req.body)
  Thing.findOneAndUpdate({ type: req.params.i }, req.body, { new: true })
    .then(Thing => {
      if (!Thing) {
        return res.status(404).json({error: "Thing not found"});
      }  
      res.json({ msg: 'Updated successfully', thing: Thing })
    })
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route   DELETE api/things/:i
// @desc    Delete Thing by i
// @access  Public
router.delete('/:i', (req, res) => {
  //Block.findByIdAndDelete(req.params.i)
  Thing.findOneAndDelete({type: req.params.i})
    .then(Block => res.json({ mgs: 'Thing entry deleted successfully', type: req.params.i }))
    .catch(err => res.status(404).json({ error: 'No such a Thing' }));
});

module.exports = router;