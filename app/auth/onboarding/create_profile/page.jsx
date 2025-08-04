"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import CreateProfileStepper from '../../../../components/CreateProfile/CreateProfileStepper';

export default function CreateProfilePage() {
  const searchParams = useSearchParams();
  const onboardingId = searchParams.get('onboardingId');

  return <CreateProfileStepper onboardingId={onboardingId} />;
}
