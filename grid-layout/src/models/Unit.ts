// models/Unit.js

import {Schema, model, Document} from 'mongoose';
import { unitType } from '../../layout-types';

const UnitSchema = new Schema<unitType & Document>({
  key: { type: String, required: true }, 
  value: { type: String, required: true }
});

export default model<unitType & Document>('unit', UnitSchema);