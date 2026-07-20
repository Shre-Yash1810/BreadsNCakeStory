import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  isAddon?: boolean;
}

const ProductSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    isAddon: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
