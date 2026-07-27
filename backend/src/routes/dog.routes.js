import { Router } from 'express';
import { createDog, deleteDog, getDog, getDogs, updateDog, validateObjectId } from '../controllers/dog.controller.js';

export const dogRouter = Router();
const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

dogRouter.route('/').get(asyncHandler(getDogs)).post(asyncHandler(createDog));
dogRouter.route('/:id').all(validateObjectId).get(asyncHandler(getDog)).put(asyncHandler(updateDog)).delete(asyncHandler(deleteDog));
