//@ts-nocheck
import createKnex from 'knex';
import { Model as BaseBookshelfModel } from 'bookshelf';
import createFacade from '../src';

const knex = createKnex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

const facade = createFacade(knex);

export type BookshelfModel = BaseBookshelfModel<any>;

export const Model = facade.Model;
