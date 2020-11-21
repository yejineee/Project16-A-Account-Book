import { Schema, model, Document } from 'mongoose';

export const CategoryType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  TRANSFER: 'TRANSFER',
};
const CategorySchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['INCOME', 'EXPENSE', 'TRANSFER'],
  },
  title: {
    type: String,
    required: true,
  },
});

export interface Category extends Document {
  type: String;
  title: String;
}

export const CategoryModel = model<Category>('category', CategorySchema);
