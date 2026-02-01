import mongoose, { Document, Schema } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  description: string;
  partnerName: string;
  category: string;
  isLocked: boolean;
  eligibilityText: string;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    partnerName: { type: String, required: true },
    category: { type: String, required: true },
    isLocked: { type: Boolean, default: false },
    eligibilityText: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Index for category filtering
DealSchema.index({ category: 1 });

export default mongoose.models.Deal || mongoose.model<IDeal>('Deal', DealSchema);
