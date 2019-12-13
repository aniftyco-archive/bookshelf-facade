//@ts-nocheck
import createKnex from 'knex';
import createFacade from '../src';

const knex = createKnex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

const facade = createFacade(knex);

export const Model = facade.Model;
