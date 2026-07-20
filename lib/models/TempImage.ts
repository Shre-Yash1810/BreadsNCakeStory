import mongoose from 'mongoose';

const tempImageSchema = new mongoose.Schema({
  data: { type: String, required: true }, // Base64 string of the image
  contentType: { type: String, required: true }, // e.g. "image/jpeg"
  createdAt: { type: Date, default: Date.now, expires: 604800 } // Auto-deletes after 7 days (604800 seconds)
});

const TempImage = mongoose.models.TempImage || mongoose.model('TempImage', tempImageSchema);

export default TempImage;
