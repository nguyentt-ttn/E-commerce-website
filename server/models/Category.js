const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Category", CategorySchema);
