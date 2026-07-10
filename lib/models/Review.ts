import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  id: string;
  name: string;
  quote: string;
  rating: number;
  date: string;
}

const ReviewSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
