import React, { useContext } from 'react';
import Badge from './shared/Badge';
import { isDebugInfoVisible } from './shared/sharedUtils';
import useNetworkStatus from './hooks/useNetworkStatus';
import { AppContext } from './reducer';
import { DEBUG_INFO_HEIGHT } from './constants';
import './DebugInfo.css';

function DebugInfo() {
  const { state } = useContext(AppContext);
  const { user } = state;
  const isOnline = useNetworkStatus();

  if (!isDebugInfoVisible(user)) {
    return null;
  }

  return (
    <div
      className="DebugInfo"
      style={{ height: DEBUG_INFO_HEIGHT - 32 /* padding */ }}
    >
      <div className="DebugInfoBadge">
        <Badge
          color={isOnline ? 'green' : 'red'}
          text={isOnline ? 'online' : 'offline'}
        />
      </div>
    </div>
  );
}

export default DebugInfo;
