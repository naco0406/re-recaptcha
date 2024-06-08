"use client"

// /app/upload/page.tsx
import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Grid, Card, CardContent } from '@mui/material';
import { uploadImage, addStep, StepData } from '../../api/firebaseService';
import RecaptchaPreviewCard from '../../components/RecaptchaPreviewCard';
import CategorySelector from '../../components/CategorySelector';

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(3);
  const [imageURL, setImageURL] = useState<string>('');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState({
    major: '',
    mid: '',
    minor: ''
  });
  const [selectedCategoryNames, setSelectedCategoryNames] = useState({
    major: '',
    mid: '',
    minor: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      const url = URL.createObjectURL(e.target.files[0]);
      setImageURL(url);
      console.log('Selected file:', e.target.files[0]);
    }
  };

  const handleSelectTile = (index: number) => {
    const newSelectedIndices = selectedIndices.includes(index)
      ? selectedIndices.filter(i => i !== index)
      : [...selectedIndices, index];

    setSelectedIndices(newSelectedIndices);
    setAnswers(newSelectedIndices.sort((a, b) => a - b));
  };

  const handleCategoryChange = (type: 'major' | 'mid' | 'minor', id: string, name: string) => {
    setSelectedCategory(prev => ({
      ...prev,
      [type]: id,
      ...(type === 'major' && { mid: '', minor: '' }),
      ...(type === 'mid' && { minor: '' })
    }));
    setSelectedCategoryNames(prev => ({
      ...prev,
      [type]: name,
      ...(type === 'major' && { mid: '', minor: '' }),
      ...(type === 'mid' && { minor: '' })
    }));
  };

  const handleSubmit = async () => {
    if (file && title && answers.length > 0 && selectedCategory.minor) {
      try {
        console.log('Uploading step with title:', title);
        const uploadedImageUrl = await uploadImage(file);
        const stepData: StepData = {
          title,
          imagePath: uploadedImageUrl,
          answers,
          rows,
          cols,
          minorId: selectedCategory.minor
        };
        await addStep(stepData);
        alert('Step added successfully!');
        setFile(null);
        setTitle('');
        setAnswers([]);
        setRows(3);
        setCols(3);
        setImageURL('');
        setSelectedIndices([]);
        setSelectedCategory({ major: '', mid: '', minor: '' });
        setSelectedCategoryNames({ major: '', mid: '', minor: '' });
      } catch (error) {
        console.error('Error uploading step:', error);
        alert('Failed to add step. Please try again.');
      }
    } else {
      alert('All fields are required!');
    }
  };

  return (
    <Container>
      <Grid container spacing={2} style={{ marginTop: '16px' }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>새로운 froCAPTCHA 업로드하기</Typography>
              <TextField
                label="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                style={{ marginBottom: '16px' }}
              />
              <CategorySelector
                selectedCategory={selectedCategory}
                selectedCategoryNames={selectedCategoryNames}
                onCategoryChange={handleCategoryChange}
                allowAddNew={true}
              />
              <TextField
                label="세로"
                type="number"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
                fullWidth
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label="가로"
                type="number"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value))}
                fullWidth
                style={{ marginBottom: '16px' }}
              />
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: 'block', marginBottom: '16px' }}
              />
              <TextField
                label="정답"
                value={answers.join(', ')}
                fullWidth
                style={{ marginBottom: '16px' }}
                InputProps={{
                  readOnly: true,
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                disabled={!selectedCategory.minor}
              >
                업로드
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <RecaptchaPreviewCard
            title={title}
            imageURL={imageURL}
            rows={rows}
            cols={cols}
            selectedIndices={selectedIndices}
            onSelect={handleSelectTile}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default UploadPage;
