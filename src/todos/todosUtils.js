import { uppercaseFirstLetter } from '../shared/sharedUtils';

function isTodoValid({ description, ownerUid }) {
  return description.trim() !== '' && ownerUid !== undefined;
}

function cleanTodoDescription(description) {
  return uppercaseFirstLetter(description.trim());
}

export { isTodoValid, cleanTodoDescription };
