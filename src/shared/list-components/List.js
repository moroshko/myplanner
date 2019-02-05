import React from 'react';
import './List.css';

function List({ droppableProps, containerRef, children }) {
  return (
    <ul className="List" {...droppableProps} ref={containerRef}>
      {children}
    </ul>
  );
}

export default List;
