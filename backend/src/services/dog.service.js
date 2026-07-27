import { Dog } from '../models/Dog.js';

const sortOptions = {
  name: { name: 1 },
  newest: { createdAt: -1, _id: 1 },
  updated: { updatedAt: -1, _id: 1 },
};

function escapeRegularExpression(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createSearchFilter(search) {
  if (!search) return {};
  const prefix = new RegExp(`^${escapeRegularExpression(search.toLowerCase())}`);
  return { $or: [{ name: prefix }, { subBreeds: prefix }] };
}

export async function listDogs({ page, limit, sort, search }) {
  const filter = createSearchFilter(search);
  const [items, total] = await Promise.all([
    Dog.find(filter).sort(sortOptions[sort] || sortOptions.name).skip((page - 1) * limit).limit(limit).lean(),
    Dog.countDocuments(filter),
  ]);

  return { items, total };
}
