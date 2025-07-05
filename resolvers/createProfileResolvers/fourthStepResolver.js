import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const fourthStepSchema = yup.object({
  occupation: yup.string().required("Please select an occupation"),
  startDate: yup.mixed().required("Start date is required").test('is-valid-date', 'Start date is required', function(value) {
    // Check if value is a valid Date object or CalendarDate object
    if (!value) return false;
    if (value instanceof Date) return !isNaN(value.getTime());
    if (value && typeof value === 'object' && value.year && value.month && value.day) {
      return true; // CalendarDate object
    }
    return false;
  }),
  endDate: yup.mixed().nullable().test('end-date-or-currently-working', 'Please provide an end date or check "Currently working in this role"', function(value) {
    const { isCurrentlyWorking } = this.parent;
    
    // If currently working is checked, end date is not required
    if (isCurrentlyWorking) {
      return true;
    }
    
    // If not currently working, end date is required
    if (!value) {
      return false;
    }
    
    // Validate end date format
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }
    if (value && typeof value === 'object' && value.year && value.month && value.day) {
      return true; // CalendarDate object
    }
    
    return false;
  }),
  skills: yup.array().min(2, "Please select at least 2 specializations").max(5, "You can select up to 5 specializations"),
  isCurrentlyWorking: yup.boolean(),
});

export const fourthStepResolver = yupResolver(fourthStepSchema); 