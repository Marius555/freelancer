import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address'),
  password: yup
    .string()
    .required('Password is required'),
});

export const loginResolver = {
  resolver: yupResolver(loginSchema),
  mode: 'onBlur',
}; 