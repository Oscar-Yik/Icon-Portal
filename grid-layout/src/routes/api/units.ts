// routes/api/units.js

import express from 'express';
const router = express.Router();

// Load Unit model
import Unit from '../../models/Unit';

// @route   GET api/units/test
// @desc    Tests units route
// @access  Public
router.get('/test', (req, res) => res.send('Unit route testing!'));

// @route   GET api/units
// @desc    Get all Units
// @access  Public
router.get('/', (req, res) => {
  Unit.find({})
    .select('-_id -__v')
    .then(Units => res.json(Units))
    .catch(err => res.status(404).json({ noUnitsfound: 'No Units found' }));
});

// @route   GET api/units/:i
// @desc    Get single Unit by i
// @access  Public
router.get('/:i', (req, res) => {
  Unit.findOne({ "key": req.params.i })
    .select('-_id -__v')
    .then(Unit => res.json(Unit))
    .catch(err => res.status(404).json({ noUnitsfound: 'No Units found' }));
});

// @route   POST api/units
// @desc    Add/save Unit
// @access  Public
router.post('/', (req, res) => {
  Unit.create(req.body)
    .then(Unit => res.json({ msg: 'Unit added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this Unit' }));
});

// @route   PUT api/units/:i
// @desc    Update Unit by i
// @access  Public
router.put('/:i', (req, res) => {
  Unit.findOneAndUpdate({ "key": req.params.i }, req.body, { new: true })
    .then(Unit => {
      if (!Unit) {
        return res.status(404).json({error: "Unit not found"});
      }  
      res.json({ msg: 'Updated successfully', unit: Unit })
    })
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route   DELETE api/units/:i
// @desc    Delete Unit by i
// @access  Public
router.delete('/:i', (req, res) => {
  Unit.findOneAndDelete({ "key": req.params.i })
    .then(Unit => res.json({ mgs: 'Unit entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such a Unit' }));
});

export default router;