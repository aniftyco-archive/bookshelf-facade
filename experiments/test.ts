//@ts-nocheck
// import {bookshelf} from './db';
import { User } from './user';
// import { Session } from './session';

(async () => {
  const user = await User.findById('56446a3a-d766-4afb-816b-05fbca5c57f2');

  console.log(user);
})()
  .then(() => process.exit())
  .catch((err) => {
    process.stderr.write(err.stack);
    process.exit(1);
  });

// // before:
// const user = await User.forge({id: 'foo' }).fetch({ withRelated: ['sessions'] });

// user.get('name'); // Jane Doe

// user.set('name', 'John Doe');

// await user.save();

// user.get('name'); // John Doe

// user.related('sessions')[0].get('ip'); // 127.0.0.1

// // now:
// const user = await User.with('sessions').findById('foo');

// user.name // John Doe

// user.name = 'Jane Doe';

// await user.save();

// user.name // Jane Doe

// user.sessions[0].ip // 127.0.0.1

// // before:
// const user = await User.forge({id: 'foo'}).fetch({ withRelated: ['sessions'] });

// const session = new Session({ip: '127.0.0.1' });

// await user.sessions().create(session);

// // now:
// const user = await User.with('sessions').findById('foo');

// const session = new Session({ip: '127.0.0.1'});

// await user.sessions.save(session);
