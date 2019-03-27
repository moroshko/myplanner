import React from 'react';
import Badge from './shared/Badge';
import useNetworkStatus from './hooks/useNetworkStatus';
import { DEBUG_INFO_HEIGHT } from './constants';
import './DebugInfo.css';

function DebugInfo() {
  const isOnline = useNetworkStatus();

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
