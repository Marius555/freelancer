import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const zeroStepSchema = yup.object({
  platforms: yup
    .array()
    .of(yup.string())
    .test('platform-required', 'Please select at least one platform or specify a custom platform', function(value) {
      const { customPlatform } = this.parent;
      return (value && value.length > 0) || (customPlatform && customPlatform.trim().length > 0);
    }),
  customPlatform: yup
    .string()
    .max(100, "Custom platform must not exceed 100 characters"),
  contentTypes: yup
    .array()
    .of(yup.string())
    .min(1, "Please select at least one content type")
    .required("Content type selection is required"),
});

export const zeroStepResolver = yupResolver(zeroStepSchema); 