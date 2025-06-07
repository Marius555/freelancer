import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const freelancerOnboardingSchema = yup.object().shape({
  role: yup.string().required('Role is required'),
  employmentType: yup.string().required('Employment type is required'),
  freelanceType: yup.string().required('Freelance type is required'),
  // Only validate fields that are actually used in the form
  skills: yup.array().of(yup.string()).optional(),
  experience: yup.number().optional(),
  hourlyRate: yup.number().optional(),
  availability: yup.string().optional(),
  bio: yup.string().optional(),
});

export const freelancerOnboardingResolver = yupResolver(freelancerOnboardingSchema); 