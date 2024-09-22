import React from 'react'

const Loading = ({size = 'md'}) => {
  
    const sizeClass = `loading-${size}`;

	  return <span className={`loading loading-spinner ${sizeClass}`} />;
};


export default Loading
