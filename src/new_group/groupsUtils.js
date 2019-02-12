const GROUP_NAME_REGEX = /^[a-z][a-z_]{1,}$/;

function isGroupValid({ name }) {
  const cleanName = cleanGroupName(name);

  return GROUP_NAME_REGEX.test(cleanName);
}

function cleanGroupName(name) {
  return name.trim();
}

export { isGroupValid, cleanGroupName };
