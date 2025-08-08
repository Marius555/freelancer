import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export const reportSchema = yup.object().shape({
  reason: yup
    .string()
    .required('Please select a reason for reporting')
    .oneOf(
      ['spam', 'inappropriate', 'harassment', 'fake_profile', 'copyright', 'other'],
      'Please select a valid reason'
    ),
  additionalDetails: yup
    .string()
    .required('Additional details are required')
    .min(10, 'Please provide at least 10 characters')
    .max(1000, 'Details must be less than 1000 characters')
    .trim('Additional details cannot be empty'),
});

export const reportResolver = {
  resolver: yupResolver(reportSchema),
  mode: 'onChange',
};