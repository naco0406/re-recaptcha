// /app/components/ImageGrid.tsx
import React from 'react';
import { Grid } from '@mui/material';

interface ImageGridProps {
  image: string;
  rows: number;
  cols: number;
  selectedIndices: number[];
  onSelect: (index: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ image, rows, cols, selectedIndices, onSelect }) => {
  const handleSelect = (index: number) => {
    onSelect(index);
  };

  return (
    <div style={{ position: 'relative', width: '100%', paddingTop: `${(rows / cols) * 100}%` }}>
      <Grid container spacing={0} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {Array.from({ length: rows * cols }).map((_, index) => (
          <Grid item xs={12 / cols} key={index} style={{ padding: '1px' }}>
            <div
              style={{
                width: '100%',
                height: '0',
                paddingBottom: '100%',
                backgroundImage: `url(${image})`,
                backgroundPosition: `${(index % cols) * (100 / cols)}% ${Math.floor(index / cols) * (100 / rows)}%`,
                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                cursor: 'pointer',
                border: selectedIndices.includes(index) ? '2px solid blue' : '1px solid gray',
                boxSizing: 'border-box',
              }}
              onClick={() => handleSelect(index)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ImageGrid;
