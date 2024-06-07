"use client"

// /app/success/page.tsx
import React, { Suspense } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';

const SuccessPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '알 수 없는 사용자';

  return (
    <>
      <Typography variant="h4">성공!</Typography>
      <Typography variant="body1" style={{ marginTop: '16px' }}>
        당신은 {name}이 맞습니다.
      </Typography>
    </>
  );
};

const SuccessPage: React.FC = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <Container style={{ marginTop: '16px' }}>
      <Suspense fallback={<Typography variant="body1">로딩 중...</Typography>}>
        <SuccessPageContent />
      </Suspense>
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
