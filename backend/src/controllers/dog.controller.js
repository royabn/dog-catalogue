import mongoose from 'mongoose';
import { z } from 'zod';
import { Dog } from '../models/Dog.js';
import { listDogs } from '../services/dog.service.js';
import { normalizeDogName, normalizeSubBreeds } from '../utils/dog.js';
import { sanitizePlainText } from '../utils/input.js';

const maxSubBreeds = 20;
const maxSubBreedTextLength = 500;
const maxSearchLength = 80;
export const maxResultWindow = 10_000;
const textField = (maxLength) => z.string().transform(sanitizePlainText).pipe(z.string().min(1).max(maxLength));
const dogInput = z.object({
  name: textField(80),
  subBreeds: z.array(textField(80)).max(maxSubBreeds).default([]),
}).strict().superRefine(({ subBreeds }, context) => {
  if (subBreeds.join(',').length > maxSubBreedTextLength) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['subBreeds'], message: `Sub-breed text must not exceed ${maxSubBreedTextLength} characters` });
  }
});

const listInput = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  sort: z.enum(['name', 'newest', 'updated']).default('name'),
  search: z.string().max(maxSearchLength).transform(sanitizePlainText).default(''),
}).superRefine(({ page, limit }, context) => {
  if (page > getMaxPage(limit)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['page'],
      message: `Page exceeds the ${maxResultWindow}-record result window`,
    });
  }
});

export function getMaxPage(limit) {
  return Math.max(1, Math.ceil(maxResultWindow / limit));
}

export function parseListQuery(query) {
  return listInput.parse(query);
}

export async function getDogs(req, res) {
  const query = parseListQuery(req.query);
  const { items, total } = await listDogs(query);
  const totalPages = Math.max(1, Math.min(Math.ceil(total / query.limit), getMaxPage(query.limit)));
  res.json({
    data: items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      capped: total > maxResultWindow,
    },
  });
}

export async function getDog(req, res) {
  const dog = await Dog.findById(req.params.id).lean();
  if (!dog) return res.status(404).json({ message: 'Dog breed not found' });
  res.json({ data: dog });
}

export async function createDog(req, res) {
  const input = dogInput.parse(req.body);
  const dog = await Dog.create({ name: normalizeDogName(input.name), subBreeds: normalizeSubBreeds(input.subBreeds) });
  res.status(201).json({ data: dog });
}

export async function updateDog(req, res) {
  const input = dogInput.parse(req.body);
  const dog = await Dog.findByIdAndUpdate(
    req.params.id,
    { name: normalizeDogName(input.name), subBreeds: normalizeSubBreeds(input.subBreeds) },
    { new: true, runValidators: true }
  );
  if (!dog) return res.status(404).json({ message: 'Dog breed not found' });
  res.json({ data: dog });
}

export async function deleteDog(req, res) {
  const dog = await Dog.findByIdAndDelete(req.params.id);
  if (!dog) return res.status(404).json({ message: 'Dog breed not found' });
  res.status(204).send();
}

export function validateObjectId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid dog ID' });
  next();
}
