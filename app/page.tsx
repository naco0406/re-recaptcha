"use client";

// /app/page.tsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Skeleton } from '@mui/material';
import { fetchSteps, StepData, fetchCategories, Category } from '../api/firebaseService';
import RecaptchaCard from '../components/RecaptchaCard';
import CategorySelector from '../components/CategorySelector';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
  const [steps, setSteps] = useState<StepData[]>([]);
  const [step, setStep] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [imageURL, setImageURL] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const [majors, setMajors] = useState<Category[]>([]);
  const [mids, setMids] = useState<Category[]>([]);
  const [minors, setMinors] = useState<Category[]>([]);
  const [stepsAvailable, setStepsAvailable] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMajorCategories = async () => {
      const majorCategories = await fetchCategories('major');
      setMajors(majorCategories);
    };
    fetchMajorCategories();
  }, []);

  useEffect(() => {
    if (steps[step]) {
      setImageURL(steps[step].imagePath);
      console.log('Setting image URL for step:', step, steps[step].imagePath);
    }
  }, [step, steps]);

  const handleSelect = (index: number) => {
    setSelectedIndices(prevSelected =>
      prevSelected.includes(index)
        ? prevSelected.filter(i => i !== index)
        : [...prevSelected, index]
    );
    console.log('Selected indices:', selectedIndices);
  };

  const handleNext = () => {
    if (steps[step].answers.every(val => selectedIndices.includes(val)) &&
        selectedIndices.every(val => steps[step].answers.includes(val))) {
      setStep(step + 1);
      setSelectedIndices([]);
      console.log('Moving to next step:', step + 1);
    } else {
      alert('Incorrect! Try again.');
      console.log('Incorrect selection:', selectedIndices);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    console.log('Logging in and fetching steps...');
    try {
      const stepsData = await fetchSteps(selectedCategory.minor);
      setSteps(stepsData);
      setIsLoggedIn(true);
      console.log('Steps fetched and user logged in');
    } catch (error) {
      console.error('Error fetching steps:', error);
      alert('Failed to fetch steps. Please check your Firebase rules.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (level: 'major' | 'mid' | 'minor', id: string, name: string) => {
    if (level === 'major') {
      const midCategories = await fetchCategories('mid', id);
      setSelectedCategory({ major: id, mid: '', minor: '' });
      setSelectedCategoryNames({ major: name, mid: '', minor: '' });
      setMids(midCategories);
      setMinors([]);
    } else if (level === 'mid') {
      const minorCategories = await fetchCategories('minor', id);
      setSelectedCategory(prev => ({ ...prev, mid: id, minor: '' }));
      setSelectedCategoryNames(prev => ({ ...prev, mid: name, minor: '' }));
      setMinors(minorCategories);
    } else if (level === 'minor') {
      setSelectedCategory(prev => ({ ...prev, minor: id }));
      setSelectedCategoryNames(prev => ({ ...prev, minor: name }));

      // Check if there are any steps available for the selected minor category
      try {
        const stepsData = await fetchSteps(id);
        setStepsAvailable(stepsData.length > 0);
      } catch (error) {
        console.error('Error checking steps availability:', error);
        setStepsAvailable(false);
      }
    }
  };

  useEffect(() => {
    if (step >= steps.length && isLoggedIn) {
      router.push(`/success?name=${selectedCategoryNames.minor}`);
    }
  }, [step, steps.length, isLoggedIn, router, selectedCategoryNames.minor]);

  if (!isLoggedIn) {
    return (
      <Container>
        <CategorySelector
          selectedCategory={selectedCategory}
          selectedCategoryNames={selectedCategoryNames}
          onCategoryChange={handleCategoryChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          style={{ marginTop: '16px' }}
          disabled={!selectedCategory.minor || !stepsAvailable}
        >
          로그인
        </Button>
        {loading && (
          <div>
            <Skeleton variant="text" width={210} height={40} />
            <Skeleton variant="rectangular" width={210} height={118} />
          </div>
        )}
      </Container>
    );
  }

  if (step >= steps.length) {
    return <Typography variant="h4">검증을 완료했습니다!</Typography>;
  }

  return (
    <Container style={{ marginTop: '16px' }}>
      <RecaptchaCard
        stepData={steps[step]}
        imageURL={imageURL}
        selectedIndices={selectedIndices}
        onSelect={handleSelect}
        onNext={handleNext}
      />
    </Container>
  );
};

export default HomePage;
