# CreateProfile Appwrite Submit Functions

This directory contains all the submit functions for the createProfile stepper components that save data to Appwrite using a parent-child relationship structure.

## Architecture

### Parent-Child Relationship
- **Parent Profile**: Created in `submitFirstStep`, contains overall profile status and metadata
- **Child Steps**: Each step creates a separate document with a reference to the parent profile
- **Relationship**: All child documents include a `profileId` field that references the parent profile

## Functions

### Individual Step Submissions

#### 0. `submitZeroStep.js`
- **Purpose**: Creates parent profile and saves platform/content type preferences
- **Creates**: Parent profile document (if doesn't exist) + Zero step document
- **Database Collections**: `CREATE_PARENT_PROFILE` + `CREATE_PROFILE_ZERO_STEP`
- **Returns**: `{ success, message, data, parentProfileId }`
- **Usage**:
  ```javascript
  const result = await submitZeroStep({
    platforms: ["youtube", "instagram"],
    customPlatform: "LinkedIn",
    contentTypes: ["short_form", "long_form"]
  });
  const parentProfileId = result.parentProfileId; // Save this for subsequent steps
  ```

#### 1. `submitFirstStep.js`
- **Purpose**: Creates parent profile and saves basic user information
- **Creates**: Parent profile document + First step document
- **Database Collections**: `PROFILE_PARENT_ID` + `PROFILE_FIRST_STEP_ID`
- **Returns**: `{ success, message, data, parentProfileId }`
- **Usage**:
  ```javascript
  const result = await submitFirstStep({
    firstName: "John",
    lastName: "Doe", 
    description: "A passionate developer..."
  });
  const parentProfileId = result.parentProfileId; // Save this for subsequent steps
  ```

#### 2. `submitSecondStep.js`
- **Purpose**: Saves profile picture and uploads file to storage
- **Requires**: `parentProfileId` from step 1
- **Database Collection**: `PROFILE_SECOND_STEP_ID`
- **Storage Bucket**: `PROFILE_PICTURES_BUCKET_ID`
- **Usage**:
  ```javascript
  const result = await submitSecondStep({
    profilePicture: fileObject
  }, parentProfileId);
  ```

#### 3. `submitThirdStep.js`
- **Purpose**: Saves language information
- **Requires**: `parentProfileId` from step 1
- **Database Collection**: `PROFILE_THIRD_STEP_ID`
- **Usage**:
  ```javascript
  const result = await submitThirdStep({
    languages: [...]
  }, parentProfileId);
  ```

#### 4. `submitFourthStep.js`
- **Purpose**: Saves occupation and skills information
- **Requires**: `parentProfileId` from step 1
- **Database Collection**: `PROFILE_FOURTH_STEP_ID`
- **Usage**:
  ```javascript
  const result = await submitFourthStep({
    occupation: "web_developer",
    startDate: "2020-01-01",
    endDate: "2023-12-31",
    isCurrentlyWorking: false,
    skills: ["React", "Node.js"]
  }, parentProfileId);
  ```

#### 5. `submitFifthStep.js`
- **Purpose**: Saves additional skills information
- **Requires**: `parentProfileId` from step 1
- **Database Collection**: `PROFILE_FIFTH_STEP_ID`
- **Usage**:
  ```javascript
  const result = await submitFifthStep({
    skills: [...]
  }, parentProfileId);
  ```

#### 6. `submitSixStep.js`
- **Purpose**: Saves education information and marks profile as complete
- **Requires**: `parentProfileId` from step 1
- **Database Collection**: `PROFILE_SIX_STEP_ID`
- **Usage**:
  ```javascript
  const result = await submitSixStep({
    education: {
      profession: "Software Engineer",
      country: "us",
      school: "MIT",
      educationLevel: "bachelor",
      startDate: "2016-09-01",
      endDate: "2020-05-15"
    }
  }, parentProfileId);
  ```

### Utility Functions

#### 7. `submitCompleteProfile.js`
- **Purpose**: Updates parent profile with all complete data
- **Requires**: `parentProfileId` from step 1
- **Database Collection**: `PROFILE_PARENT_ID` (updates existing document)
- **Usage**:
  ```javascript
  const result = await submitCompleteProfile(allFormData, parentProfileId);
  ```

#### 8. `submitStepByStep.js`
- **Purpose**: Universal function for submitting any step
- **Parameters**: `(stepNumber, stepData, parentProfileId)`
- **Creates parent profile automatically** for step 0 or 1 if not provided
- **Usage**:
  ```javascript
  // Step 0 (creates parent automatically)
  const result0 = await submitStepByStep(0, step0Data);
  const parentProfileId = result0.parentProfileId;
  
  // Step 1 (creates parent automatically if not from step 0)
  const result1 = await submitStepByStep(1, step1Data, parentProfileId);
  
  // Subsequent steps
  const result2 = await submitStepByStep(2, step2Data, parentProfileId);
  const result3 = await submitStepByStep(3, step3Data, parentProfileId);
  ```

## Data Structure

### Parent Profile Document
```javascript
{
  userId: string,
  firstName: string,
  lastName: string,
  description: string,
  profileStatus: "in_progress" | "completed",
  currentStep: number,
  totalSteps: 7,
  completedSteps: number[],
  // ... all other profile data (updated as steps complete)
  createdAt: string,
  updatedAt: string
}
```

### Child Step Documents
```javascript
{
  profileId: string, // Reference to parent profile
  userId: string,
  step: number,
  completed: true,
  // ... step-specific data
  createdAt: string
}
```

## Usage Examples

### Complete Flow Example
```javascript
import { 
  submitZeroStep,
  submitFirstStep, 
  submitSecondStep, 
  submitThirdStep,
  submitFourthStep,
  submitFifthStep,
  submitSixStep
} from '../../appwriteUtils/createProfileAppwrite';

// Step 0: Platform and content type preferences
const step0Result = await submitZeroStep({
  platforms: ["youtube", "instagram"],
  customPlatform: "",
  contentTypes: ["short_form", "long_form"]
});

if (step0Result.success) {
  const parentProfileId = step0Result.parentProfileId;
  
  // Step 1: Basic Info
  await submitFirstStep({
    firstName: "John",
    lastName: "Doe",
    description: "A passionate developer..."
  }, parentProfileId);
  
  // Step 2: Profile picture
  await submitSecondStep({
    profilePicture: fileObject
  }, parentProfileId);
  
  // Step 3: Languages
  await submitThirdStep({
    languages: [
      { language: "english", proficiency: "native" },
      { language: "spanish", proficiency: "intermediate" }
    ]
  }, parentProfileId);
  
  // Continue with other steps...
}
```

### Using submitStepByStep for All Steps
```javascript
import { submitStepByStep } from '../../appwriteUtils/createProfileAppwrite';

let parentProfileId = null;

// Step 0
const result0 = await submitStepByStep(0, step0Data);
parentProfileId = result0.parentProfileId;

// Step 1
await submitStepByStep(1, step1Data, parentProfileId);

// Step 2
await submitStepByStep(2, step2Data, parentProfileId);

// Step 3
await submitStepByStep(3, step3Data, parentProfileId);

// Continue for all steps...
```

## Environment Variables Required

```env
# Database IDs
DATABASE_ID=your_database_id
PROFILE_PARENT_ID=your_parent_profile_collection_id
CREATE_PROFILE_ZERO_STEP=your_zero_step_collection_id
PROFILE_FIRST_STEP_ID=your_first_step_collection_id
PROFILE_SECOND_STEP_ID=your_second_step_collection_id
PROFILE_THIRD_STEP_ID=your_third_step_collection_id
PROFILE_FOURTH_STEP_ID=your_fourth_step_collection_id
PROFILE_FIFTH_STEP_ID=your_fifth_step_collection_id
PROFILE_SIX_STEP_ID=your_six_step_collection_id

# Storage Bucket ID
PROFILE_PICTURES_BUCKET_ID=your_profile_pictures_bucket_id

# Appwrite Configuration
APPWRITE_ENDPOINT=your_appwrite_endpoint
PROJECT_ID=your_project_id
KEY=your_api_key
```

## Notes

- **Parent Profile ID**: Must be saved after step 1 and passed to all subsequent steps
- **Progress Tracking**: Parent profile tracks current step and completed steps
- **File Uploads**: Handled automatically in steps 2 and complete profile
- **Status Updates**: Parent profile status updates from "in_progress" to "completed"
- **Error Handling**: All functions return consistent `{ success, message, data }` format
- **Authentication**: Uses session cookie and decryption pattern
- **Timestamps**: All stored in ISO format 