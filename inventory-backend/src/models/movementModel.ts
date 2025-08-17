import mongoose, { Document, Schema } from 'mongoose';

export interface IMovement extends Document {
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  date: Date;
}

const movementSchema = new Schema<IMovement>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
    type: { type: String, enum: ['in', 'out'], required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Movement = mongoose.model<IMovement>('Movement', movementSchema);
