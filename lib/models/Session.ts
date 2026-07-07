import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  token: string;
  expiresAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true }
  },
  {
    timestamps: true
  }
);

// TTL index to automatically clean up expired sessions from the database
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
