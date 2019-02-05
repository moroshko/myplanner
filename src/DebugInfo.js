import React, { useContext } from 'react';
import { format } from 'date-fns';
import Badge from './shared/Badge';
import { isDebugInfoVisible } from './shared/sharedUtils';
import useNetworkStatus from './hooks/useNetworkStatus';
import { AppContext } from './reducer';
import { DEBUG_INFO_HEIGHT } from './constants';
import './DebugInfo.css';

function DebugInfo() {
  const { state } = useContext(AppContext);
  const { user, debugInfo } = state;
  const { lastTodayCheck } = debugInfo;
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
      {lastTodayCheck !== null && (
        <div className="DebugInfoBadge">
          <Badge
            text={`today checked: ${format(lastTodayCheck, 'MMM d, HH:mm')}`}
          />
        </div>
      )}
    </div>
  );
}

export default DebugInfo;
