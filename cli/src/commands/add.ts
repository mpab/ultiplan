// alias to add a todo task

//import todo from './todo';

module.exports = async (handle: string) => {
  const todo = require('./todo');
  todo(handle);
};

