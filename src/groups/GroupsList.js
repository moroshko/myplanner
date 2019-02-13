import React from 'react';
import { List, ListItem, ListItemButton } from '../shared/list-components';

function GroupsList({ groups }) {
  return (
    <List>
      {groups.map(({ id, name }) => (
        <ListItem key={id}>
          <ListItemButton>{name}</ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default GroupsList;
