// src/models/productLogModel.ts
import mongoose, { Document, Schema } from 'mongoose';

// Interfaz para el documento de historial
export interface IProductLog extends Document {
  productId: mongoose.Types.ObjectId;
  action: 'created' | 'updated' | 'deleted' | 'quantity_change';
  details?: Record<string, any>; // Puede ser un objeto con los cambios
  timestamp: Date;
}

const productLogSchema: Schema<IProductLog> = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
    action: { type: String, required: true, enum: ['created', 'updated', 'deleted', 'quantity_change'] },
    details: { type: Object }, // Objeto para guardar los cambios, ej: { oldName: 'A', newName: 'B' }
  },
  { timestamps: { createdAt: 'timestamp', updatedAt: false } }
);

export const ProductLog = mongoose.model<IProductLog>('ProductLog', productLogSchema);
