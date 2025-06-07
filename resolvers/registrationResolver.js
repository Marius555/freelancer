import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export const registrationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  policy: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

export const registrationResolver = {
  resolver: yupResolver(registrationSchema),
  mode: 'onBlur',
}; 