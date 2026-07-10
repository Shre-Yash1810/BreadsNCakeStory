import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: number;
  image: string;
}

export interface IOrder extends Document {
  id: string;
  customerName: string;
  mobile: string;
  whatsapp: string;
  address: string;
  landmark: string;
  notes: string;
  items: IOrderItem[];
  total: number;
  status: 'Pending' | 'Completed' | 'Sold';
  date: string;
  deliveryDate: Date;
  eventType: 'Birthday' | 'Anniversary' | 'Baby Shower' | 'Corporate' | 'Other' | 'General';
}

const OrderItemSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  weight: { type: Number, required: true },
  image: { type: String, required: true }
}, { _id: false });

const OrderSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    mobile: { type: String, required: true },
    whatsapp: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String, default: '' },
    notes: { type: String, default: '' },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    status: { type: String, required: true, enum: ['Pending', 'Completed', 'Sold'], default: 'Pending' },
    date: { type: String, required: true },
    deliveryDate: { type: Date, required: true },
    eventType: { type: String, required: true, enum: ['Birthday', 'Anniversary', 'Baby Shower', 'Corporate', 'Other', 'General'], default: 'General' }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
