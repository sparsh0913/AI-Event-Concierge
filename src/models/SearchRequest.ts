import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISearchRequest extends Document {
  prompt: string;
  venueName: string;
  location: string;
  estimatedCost: string;
  whyItFits: string;
  createdAt: Date;
}

const SearchRequestSchema: Schema = new Schema(
  {
    prompt: { type: String, required: true },
    venueName: { type: String, required: true },
    location: { type: String, required: true },
    estimatedCost: { type: String, required: true },
    whyItFits: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

// Check if model already exists to avoid recompilation errors during hot reloading in Next.js
const SearchRequest: Model<ISearchRequest> =
  mongoose.models.SearchRequest ||
  mongoose.model<ISearchRequest>("SearchRequest", SearchRequestSchema);

export default SearchRequest;
