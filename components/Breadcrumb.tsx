// /app/components/Breadcrumb.tsx
import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';

interface BreadcrumbProps {
  selectedCategoryNames: {
    major: string;
    mid: string;
    minor: string;
  };
  onCategoryChange: (type: 'major' | 'mid' | 'minor', id: string, name: string) => void;
}

const CustomBreadcrumb: React.FC<BreadcrumbProps> = ({ selectedCategoryNames, onCategoryChange }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: '16px' }}>
      <Link
        color="inherit"
        onClick={() => onCategoryChange('major', '', '')}
      >
        {selectedCategoryNames.major || '카테고리 선택'}
      </Link>
      {selectedCategoryNames.major && (
        <Link
          color="inherit"
          onClick={() => onCategoryChange('mid', '', '')}
        >
          {selectedCategoryNames.mid || ''}
        </Link>
      )}
      {selectedCategoryNames.mid && (
        <Typography color="textPrimary">
          {selectedCategoryNames.minor || ''}
        </Typography>
      )}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumb;
