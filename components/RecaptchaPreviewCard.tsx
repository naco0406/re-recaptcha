// /app/components/RecaptchaPreviewCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Grid, CardActions, Skeleton } from '@mui/material';
import ImageGrid from './ImageGrid';

interface RecaptchaPreviewCardProps {
    title: string;
    imageURL: string;
    rows: number;
    cols: number;
    selectedIndices: number[];
    onSelect: (index: number) => void;
}

const RecaptchaPreviewCard: React.FC<RecaptchaPreviewCardProps> = ({ title, imageURL, rows, cols, selectedIndices, onSelect }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {title || '제목'}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    이 있는 타일을 모두 선택하세요. 아무것도 없으면 건너뛰기를 클릭하세요.
                </Typography>
                {imageURL ? (
                    <ImageGrid
                        image={imageURL}
                        rows={rows}
                        cols={cols}
                        selectedIndices={selectedIndices}
                        onSelect={onSelect}
                    />
                ) : (
                    <Skeleton variant="rectangular" width="100%" height={400} />
                )}
            </CardContent>
        </Card>
    );
};

export default RecaptchaPreviewCard;
