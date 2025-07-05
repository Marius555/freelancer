import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const educationSchema = yup.object({
  profession: yup
    .string()
    .required("Profession is required")
    .min(2, "Profession must be at least 2 characters")
    .max(100, "Profession max 100 characters"),
  country: yup
    .string()
    .required("Country is required"),
  school: yup
    .string()
    .required("School name is required")
    .min(2, "School name must be at least 2 characters")
    .max(100, "School name max 100 characters"),
  educationLevel: yup
    .string()
    .required("Education level is required"),
  startDate: yup
    .string()
    .required("Start date is required")
    .test('is-date', 'Start date cannot be in the future', function(value) {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today to allow today's date
      return selectedDate <= today;
    }),
  endDate: yup
    .string()
    .required("End date is required")
    .test('is-date', 'End date must be after start date', function(value) {
      if (!value || !this.parent.startDate) return false;
      const endDate = new Date(value);
      const startDate = new Date(this.parent.startDate);
      return endDate > startDate;
    })
    .test('is-date', 'End date cannot be in the future', function(value) {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today to allow today's date
      return selectedDate <= today;
    }),
});

export const sixStepResolver = yupResolver(educationSchema); 