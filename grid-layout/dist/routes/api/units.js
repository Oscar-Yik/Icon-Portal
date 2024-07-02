"use strict";
// routes/api/units.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Load Unit model
const Unit_1 = __importDefault(require("../../models/Unit"));
// @route   GET api/units/test
// @desc    Tests units route
// @access  Public
router.get('/test', (req, res) => res.send('Unit route testing!'));
// @route   GET api/units
// @desc    Get all Units
// @access  Public
router.get('/', (req, res) => {
    Unit_1.default.find({})
        .select('-_id -__v')
        .then(Units => res.json(Units))
        .catch(err => res.status(404).json({ noUnitsfound: 'No Units found' }));
});
// @route   GET api/units/:i
// @desc    Get single Unit by i
// @access  Public
router.get('/:i', (req, res) => {
    Unit_1.default.findOne({ "key": req.params.i })
        .select('-_id -__v')
        .then(Unit => res.json(Unit))
        .catch(err => res.status(404).json({ noUnitsfound: 'No Units found' }));
});
// @route   POST api/units
// @desc    Add/save Unit
// @access  Public
router.post('/', (req, res) => {
    Unit_1.default.create(req.body)
        .then(Unit => res.json({ msg: 'Unit added successfully' }))
        .catch(err => res.status(400).json({ error: 'Unable to add this Unit' }));
});
// @route   PUT api/units/:i
// @desc    Update Unit by i
// @access  Public
router.put('/:i', (req, res) => {
    Unit_1.default.findOneAndUpdate({ "key": req.params.i }, req.body, { new: true })
        .then(Unit => {
        if (!Unit) {
            return res.status(404).json({ error: "Unit not found" });
        }
        res.json({ msg: 'Updated successfully', unit: Unit });
    })
        .catch(err => res.status(400).json({ error: 'Unable to update the Database' }));
});
// @route   DELETE api/units/:i
// @desc    Delete Unit by i
// @access  Public
router.delete('/:i', (req, res) => {
    Unit_1.default.findOneAndDelete({ "key": req.params.i })
        .then(Unit => res.json({ mgs: 'Unit entry deleted successfully' }))
        .catch(err => res.status(404).json({ error: 'No such a Unit' }));
});
exports.default = router;
