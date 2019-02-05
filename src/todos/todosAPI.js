import { getDb } from '../firebase';
import { cleanTodoDescription } from './todosUtils';

function getTodosCollection() {
  return getDb().collection('todos');
}

function createTodo({ description, ownerUid }) {
  return getDb().runTransaction(async transaction => {
    const todos = await getTodos();
    const todosCount = todos.length;
    const ownerFirstIndex = todos.findIndex(todo => todo.ownerUid === ownerUid);
    const newTodoRef = getTodosCollection().doc();
    const newTodo = {
      description: cleanTodoDescription(description),
      ownerUid,
      index: 0,
    };

    // move all the existing todos (if they exist)
    if (ownerFirstIndex > -1) {
      for (
        let i = ownerFirstIndex;
        i < todosCount && todos[i].ownerUid === ownerUid;
        i++
      ) {
        const todoRef = getTodosCollection().doc(todos[i].id);

        transaction.update(todoRef, { index: todos[i].index + 1 });
      }
    }

    // add the new todo
    transaction.set(newTodoRef, newTodo);
  });
}

function getTodosFromSnapshot(snapshot) {
  return snapshot.docs.map(doc => {
    const { description, ownerUid, index } = doc.data();

    return {
      id: doc.id,
      description,
      ownerUid,
      index,
    };
  });
}

function orderedTodos() {
  return getTodosCollection()
    .orderBy('ownerUid', 'asc')
    .orderBy('index', 'asc');
}

function getTodos() {
  return orderedTodos()
    .get()
    .then(getTodosFromSnapshot);
}

function updateTodosIndices(updates) {
  const batch = getDb().batch();

  updates.forEach(({ id, index }) => {
    batch.update(getTodosCollection().doc(id), { index });
  });

  return batch.commit();
}

function subscribeToTodosUpdates({ onUpdate, onError }) {
  return orderedTodos().onSnapshot(snapshot => {
    onUpdate({
      todos: getTodosFromSnapshot(snapshot),
    });
  }, onError);
}

async function updateTodo({ id, description, ownerUid }) {
  const todoRef = getTodosCollection().doc(id);
  const todoSnapshot = await todoRef.get();

  if (!todoSnapshot.exists) {
    throw new Error("This todo doesn't exist anymore.");
  }

  const currentOwnerUid = todoSnapshot.data().ownerUid;

  if (ownerUid === currentOwnerUid) {
    return todoRef.update({
      description: cleanTodoDescription(description),
    });
  }

  // when the owner is updated, we potentially need to move todos both of the
  // current owner and the new owner.
  return getDb().runTransaction(async transaction => {
    const todos = await getTodos();
    const todosCount = todos.length;
    const currentOwnerFirstIndex = todos.findIndex(
      todo => todo.ownerUid === currentOwnerUid
    );
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (currentOwnerFirstIndex === -1 || todoIndex === -1) {
      throw new Error("This todo doesn't exist anymore.");
    }

    // move all the existing todos after the todo that is moving
    for (
      let i = todoIndex + 1;
      i < todosCount && todos[i].ownerUid === currentOwnerUid;
      i++
    ) {
      const todoRef = getTodosCollection().doc(todos[i].id);

      transaction.update(todoRef, { index: todos[i].index - 1 });
    }

    const newOwnerFirstIndex = todos.findIndex(
      todo => todo.ownerUid === ownerUid
    );

    // move all the existing todos of the new owner (if they exist)
    if (newOwnerFirstIndex > -1) {
      for (
        let i = newOwnerFirstIndex;
        i < todosCount && todos[i].ownerUid === ownerUid;
        i++
      ) {
        const todoRef = getTodosCollection().doc(todos[i].id);

        transaction.update(todoRef, { index: todos[i].index + 1 });
      }
    }

    // update the todo itself
    transaction.update(todoRef, {
      description: cleanTodoDescription(description),
      ownerUid,
    });
  });
}

function deleteTodo({ id }) {
  return getDb().runTransaction(async transaction => {
    const todos = await getTodos();
    const todosCount = todos.length;
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      throw new Error("This todo doesn't exist anymore.");
    }

    const { ownerUid } = todos[todoIndex];
    const ownerFirstIndex = todos.findIndex(todo => todo.ownerUid === ownerUid);

    if (ownerFirstIndex === -1) {
      throw new Error('Oops! This should never happen.');
    }

    // move all the existing todos after `todoIndex`
    for (
      let i = todoIndex + 1;
      i < todosCount && todos[i].ownerUid === ownerUid;
      i++
    ) {
      const todoRef = getTodosCollection().doc(todos[i].id);

      transaction.update(todoRef, { index: todos[i].index - 1 });
    }

    // delete the todo itself
    const todoToDeleteRef = getTodosCollection().doc(id);

    transaction.delete(todoToDeleteRef);
  });
}

export {
  createTodo,
  getTodos,
  updateTodosIndices,
  subscribeToTodosUpdates,
  updateTodo,
  deleteTodo,
};
