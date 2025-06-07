import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const clientOnboardingSchema = yup.object().shape({
  role: yup.string().required('Role is required'),
  employmentType: yup.string().required('Employment type is required'),
  companySize: yup.string().required('Company size is required'),
  purpose: yup.string().required('Purpose is required'),
  // Optional fields that might be used
  companyName: yup.string().optional(),
  industry: yup.string().optional(),
  projectBudget: yup.string().optional(),
  projectTimeline: yup.string().optional(),
  projectDescription: yup.string().optional(),
});

export const clientOnboardingResolver = yupResolver(clientOnboardingSchema); 