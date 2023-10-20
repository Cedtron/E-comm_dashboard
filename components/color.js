import React from 'react';

export default function Color({ colors }) {
  return (
    <div>
      {colors.map((color, index) => (
        <div
          key={index}
          style={{
            backgroundColor: color,
            width: '20px',
            height: '20px',
            display: 'inline-block',
            marginRight: '5px',
            borderRadius: '50%',
          }}
        ></div>
      ))}
    </div>
  );
}
    


