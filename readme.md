# Bookshelf Facade

> Modern JavaScript wrapping Bookshelf Models

## DO NOT USE: This is currently just a proof of concept!

### What is this?

So in my opinion [Bookshelf](https://bookshelfjs.org) is the best ORM available for Node apps today. It was inspired by and heavily modeled after the best ORM in my opinion Laravel's [Eloquent ORM](https://laravel.com/docs/6.x/eloquent). The goal with this package is to abstract a lot of the warts of it being bound to legacy Node and give it a nice clean API to build your apps using modern style stuff.

### What does it do differently?

It comes pre packed with a new `Model` base class that has static methods built right into it for working with creating and fetching models, and when a model its fetched it returns a masked model that has a better api for working with your data.

### Examples

#### Defining a Model:

To get started all you have to do is create a new instance of the facade, very similarly to how you do it normally with Bookshelf.

**db.ts:**

```typescript
import createKnex from 'knex';
import createFacade from 'bookshelf-facade';

const knex = createKnex({...});
const facade = createFacade(knex);

export {
    Model: facade.Model
}
```

**user.ts:**

```typescript
import { Model } from './db';

export default class User extends Model {}
```

Now anywhere you want to use the `User` model you can.
