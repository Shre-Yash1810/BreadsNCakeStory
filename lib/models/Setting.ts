import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  bakeryName: string;
  logoUrl: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  businessHours: string;
  heroTitle: string;
  heroSubtitle: string;
  swiggyUrl?: string;
  zomatoUrl?: string;
  googleMapsUrl?: string;
  bakerySubtitle: string;
  deliveryCharge: number;
}

const SettingSchema: Schema = new Schema(
  {
    bakeryName: { type: String, required: true },
    logoUrl: { type: String, default: '' },
    contactNumber: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, required: true },
    businessHours: { type: String, default: '' },
    heroTitle: { type: String, required: true },
    heroSubtitle: { type: String, required: true },
    swiggyUrl: { type: String, default: '' },
    zomatoUrl: { type: String, default: '' },
    googleMapsUrl: { type: String, default: '' },
    bakerySubtitle: { type: String, default: 'Boutique Patisserie' },
    deliveryCharge: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
