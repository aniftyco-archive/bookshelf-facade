//@ts-nocheck
import { Model } from './db';
import { Session } from './session';

export class User extends Model {
  public static hidden = ['password'];

  getFirstNameAttribute() {
    return this.attributes.name.replace(/^(.+)\s(.+)$/, '$1');
  }

  setNameAttribute(value: string) {
    return value;
  }

  sessions() {
    return this.hasMany(Session);
  }
}
