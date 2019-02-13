import React, { useCallback, useContext } from 'react';
import { List, ListItem, ListItemButton } from '../shared/list-components';
import { AppContext } from '../reducer';
import { EDIT_GROUP_DIALOG } from '../constants';

function GroupsList({ groups }) {
  const { dispatchChange } = useContext(AppContext);
  const onEditButtonClick = useCallback(group => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: EDIT_GROUP_DIALOG,
      dialogData: {
        group,
      },
    });
  }, []);

  return (
    <List>
      {groups.map(group => {
        const { id, name } = group;

        return (
          <ListItem key={id}>
            <ListItemButton
              onClick={() => {
                onEditButtonClick(group);
              }}
            >
              {name}
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

export default GroupsList;
