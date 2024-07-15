// models/Block.js

import {Schema, model, Document} from 'mongoose';
import { blockType } from '../../layout-types';

const BlockSchema = new Schema<blockType & Document>({
  data_grid: {
    i: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    w: { type: Number, required: true },
    h: { type: Number, required: true },
    isBounded: { type: Boolean, required: true },
    isResizable: { type: Boolean, required: true }
  },
  link: { type: String, required: true },
  img_url: { type: String, required: true }
});

export default model<blockType & Document>('block', BlockSchema);