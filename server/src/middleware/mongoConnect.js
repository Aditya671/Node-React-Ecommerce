import mongoose from "mongoose";

export const mongoDbConnect = (url) => mongoose.connect(url);