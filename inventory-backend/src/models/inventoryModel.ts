import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
  name: string;
  quantity: number;
  category: string;
  qrCode?: string; // opcional: se genera si no lo mandas
}

const inventorySchema: Schema<IInventory> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    qrCode: { type: String }
  },
  { timestamps: true }
);

export const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);
