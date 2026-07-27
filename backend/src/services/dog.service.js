import { Dog } from '../models/Dog.js';
const sortableFields = { name: 'name', newest: 'createdAt', updated: 'updatedAt' };

export async function listDogs({ page, limit, sort }) {
  const sortField = sortableFields[sort] || sortableFields.name;

  const [result] = await Dog.aggregate([
    { $match: {} },
    { $sort: { [sortField]: 1, _id: 1 } },
    {
      $facet: {
        items: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        metadata: [{ $count: 'total' }],
      },
    },
  ]);

  return { items: result.items, total: result.metadata[0]?.total || 0 };
}
