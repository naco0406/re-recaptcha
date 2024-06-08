// /app/components/RecaptchaCard.tsx
import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Skeleton } from '@mui/material';
import ImageGrid from './ImageGrid';

interface RecaptchaCardProps {
  stepData: {
    title: string;
    imagePath: string;
    answers: number[];
    rows: number;
    cols: number;
  };
  imageURL: string;
  selectedIndices: number[];
  onSelect: (index: number) => void;
  onNext: () => void;
}

const RecaptchaCard: React.FC<RecaptchaCardProps> = ({ stepData, imageURL, selectedIndices, onSelect, onNext }) => {
  return (
    <Card style={{ marginTop: '16px', maxWidth: '736px' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {stepData.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          이 있는 타일을 모두 선택하세요.
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          아무것도 없으면 건너뛰기를 클릭하세요.
        </Typography>
        {imageURL ? (
          <ImageGrid
            image={imageURL}
            rows={stepData.rows}
            cols={stepData.cols}
            selectedIndices={selectedIndices}
            onSelect={onSelect}
          />
        ) : (
          <Skeleton variant="rectangular" width="100%" height={400} />
        )}
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={onNext}
          // disabled={selectedIndices.length === 0}
          style={{ marginTop: '16px' }}
        >
          {selectedIndices.length === 0 ? '건너뛰기' : '확인'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default RecaptchaCard;
