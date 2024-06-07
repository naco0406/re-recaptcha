"use client"

// /app/success/page.tsx
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';

const SuccessPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '알 수 없는 사용자';

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <Container style={{ marginTop: '16px' }}>
      <Typography variant="h4">성공!</Typography>
      <Typography variant="body1" style={{ marginTop: '16px' }}>
        인증되었습니다 - {name}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackToHome}
        style={{ marginTop: '16px' }}
      >
        홈으로 돌아가기
      </Button>
    </Container>
  );
};

export default SuccessPage;