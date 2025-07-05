# CreateProfile Resolvers

This directory contains all the form validation resolvers extracted from the createProfile components.

## Resolvers

### 1. `firstStepResolver.js`
- **Component**: FirstStep.jsx
- **Purpose**: Validates basic user information
- **Fields**:
  - `firstName`: Required, min 2 characters
  - `lastName`: Required, min 2 characters
  - `description`: Required, min 10 characters, max 500 characters

### 2. `fourthStepResolver.js`
- **Component**: FourthStep.jsx
- **Purpose**: Validates occupation and work experience
- **Fields**:
  - `occupation`: Required
  - `startDate`: Required, valid date format
  - `endDate`: Required unless currently working, must be after start date
  - `skills`: Array, min 2 items, max 5 items
  - `isCurrentlyWorking`: Boolean

### 3. `fifthStepResolver.js`
- **Component**: FifthStep.jsx
- **Purpose**: Validates individual skill entries
- **Fields**:
  - `skillName`: Required, min 2 characters, max 50 characters
  - `proficiency`: Required number, min 1, max 5

### 4. `sixStepResolver.js`
- **Component**: SixStep.jsx
- **Purpose**: Validates education information
- **Fields**:
  - `profession`: Required, min 2 characters, max 100 characters
  - `country`: Required
  - `school`: Required, min 2 characters, max 100 characters
  - `educationLevel`: Required
  - `startDate`: Required, cannot be in the future
  - `endDate`: Required, must be after start date, cannot be in the future

## Usage

Import resolvers in your components:

```javascript
import { firstStepResolver, fourthStepResolver, fifthStepResolver, sixStepResolver } from '../../resolvers/createProfileResolvers';

// Use in useForm hook
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: firstStepResolver,
  defaultValues: {
    // your default values
  }
});
```

## Notes

- SecondStep.jsx and ThirdStep.jsx don't use yup validation schemas
- SecondStep uses file upload validation logic
- ThirdStep uses custom validation logic for language selection
- All resolvers are exported from the index.js file for easy importing 