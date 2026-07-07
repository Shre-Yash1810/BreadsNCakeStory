import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  imageUrl: string;
}

const GallerySchema: Schema = new Schema(
  {
    imageUrl: { type: String, required: true, unique: true }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
