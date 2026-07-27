import { Router } from 'express';
import { createDog, deleteDog, getDog, getDogs, updateDog, validateObjectId } from '../controllers/dog.controller.js';

export const dogRouter = Router();

dogRouter.route('/').get(getDogs).post(createDog);
dogRouter.route('/:id').all(validateObjectId).get(getDog).put(updateDog).delete(deleteDog);
