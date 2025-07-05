import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const skillSchema = yup.object({
  skillName: yup
    .string()
    .required("Skill name is required")
    .min(2, "Skill name must be at least 2 characters")
    .max(50, "Skill name max 50 characters"),
  proficiency: yup
    .number()
    .required("Proficiency level is required")
    .min(1, "Proficiency must be at least 1")
    .max(5, "Proficiency must not exceed 5"),
});

export const fifthStepResolver = yupResolver(skillSchema); 