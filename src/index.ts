//@ts-nocheck
import createBookshelf, { Model as BookshelfModel, DestroyOptions, SyncOptions, WithRelatedQuery } from 'bookshelf';
import * as inflection from 'inflection';
import { camelCase, capitalize } from 'lodash';

const ACCESSOR_REGEX = /^get(.+)Attribute$/;
const MUTATOR_REGEX = /^set(.+)Attribute$/;

export default (knex: any) => {
  const bookshelf = createBookshelf(knex)
    .plugin('bookshelf-uuid')
    .plugin('bookshelf-paranoia');

  const Model = class Model<P extends Model<any>> extends bookshelf.Model<P> {
    public static tableName = undefined;
    public static hasTimestamps: boolean | string[] = true;
    public static softDelete: boolean = true;
    public static idAttribute: string = 'id';
    public static hidden: null | string[] = null;
    public static visible: null | string[] = null;

    private static $$withRelated = null;

    private static maskModel(model: BookshelfModel<any>) {
      const attributes = model.serialize({ shallow: true });
      const properties = Object.getOwnPropertyNames(this.constructor.prototype);
      const accessors = properties.filter((prop: string) => ACCESSOR_REGEX.test(prop));
      const mutators = properties.filter((prop: string) => MUTATOR_REGEX.test(prop));

      let masked = {
        [Symbol.for(`bookshelf:${model.tableName}:attributes`)]: {
          enumerable: true,
          value: attributes,
        },
        save: {
          value: async (attributes?: Record<string, any>, options?: SaveOptions) => {
            return model.save(attributes, options);
          },
        },
        destroy: {
          value: async (options?: DestroyOptions) => {
            return model.destroy(options);
          },
        },
        toString: {
          value: () => `[Model ${model.constructor.name}]`,
        },
        toJSON: {
          value: () => model.toJSON(),
        },
      };

      masked = Object.keys(attributes).reduce((descriptor, attribute) => {
        const key = camelCase(attribute);

        return {
          ...descriptor,
          [key]: {
            get: () => model.get(attribute),
            set: (value: any) => {
              const mutator = `set${capitalize(key)}Attribute`;

              if (mutators.includes(mutator)) {
                return model.set(attribute, this[mutator](value));
              }

              return model.set(attribute, value);
            },
          },
        };
      }, masked);

      masked = Object.keys(model.relations).reduce((descriptor, relatedKey) => {
        const key = camelCase(relatedKey);

        return {
          ...descriptor,
          [key]: {
            get: () => {
              const related = model.related(relatedKey);

              if (related instanceof bookshelf.Collection) {
                return Object.defineProperties(related.map(Model.maskModel.bind(this)), {
                  count: {
                    value: async (column?: string, options?: SyncOptions) => {
                      return related.count(column, options);
                    },
                  },
                  first: {
                    value: () => {
                      return Model.maskModel(related.first());
                    },
                  },
                  last: {
                    value: () => {
                      return Model.maskModel(related.last());
                    },
                  },
                  save: {
                    enumerable: false,
                    value: async (relation: BookshelfModel<any> | BookshelfModel<any>[]) => {
                      if (related.relatedData && related.relatedData.type === 'belongsToMany') {
                        await related.attach(relation);
                      } else {
                        await related.create(relation);
                      }
                    },
                  },
                  remove: {
                    enumerable: false,
                    value: async (relation: BookshelfModel<any> | BookshelfModel<any>[]) => {
                      if (related.relatedData && related.relatedData.type === 'belongsToMany') {
                        await related.detach(relation);
                      }
                    },
                  },
                });
              }

              return this.maskModel(related);
            },
          },
        };
      }, masked);

      masked = accessors.reduce((descriptor, accessor) => {
        const accessorKey = camelCase(accessor.replace(ACCESSOR_REGEX, '$1'));

        return {
          ...descriptor,
          [accessorKey]: {
            get: () => model[accessor](),
          },
        };
      }, masked);

      return Object.defineProperties({}, masked);
    }

    static with(relations: string | string[] | WithRelatedQuery) {
      this.$$withRelated = relations;

      return this;
    }

    static async all(options: Record<string, any> = {}) {
      return this.fetchAll({
        ...options,
        withRelated: this.$$withRelated,
      }).then((models: any) => models.map(this.maskModel));
    }

    static async findOne(query: Record<string, any> = {}, options: Record<string, any> = {}) {
      return this.forge(query)
        .fetch({ ...options, withRelated: this.$$withRelated })
        .then(this.maskModel);
    }

    static async findById(id: string, options: Record<string, any> = {}) {
      return this.findOne({ [this.idAttribute]: id }, options);
    }

    static async create(attributes: Record<string, any> = {}, options: Record<string, any> = {}) {
      return this.forge(attributes).save(null, options);
    }

    get tableName() {
      if (this.constructor.tableName) {
        return this.constructor.tableName;
      }

      return inflection.pluralize(this.constructor.name).toLowerCase();
    }

    get hasTimestamps() {
      return this.constructor.hasTimestamps;
    }

    get softDelete() {
      return this.constructor.softDelete;
    }

    get idAttribute() {
      return this.constructor.idAttribute;
    }

    get hidden() {
      return this.constructor.hidden;
    }

    get visible() {
      return this.constructor.visible;
    }

    get uuid() {
      return true;
    }
  };

  return {
    Model,
    bookshelf,
    knex,
  };
};
