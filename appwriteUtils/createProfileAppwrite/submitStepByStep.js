"use server";
import { createSessionClient } from "../../appwriteServer";
import { ID } from "node-appwrite";
import decript from "../../components/middleware/decript";
import { cookies } from "next/headers";

// Helper function to convert CalendarDate to ISO string for Appwrite DateTime
const convertCalendarDateToISO = (calendarDate) => {
  if (!calendarDate) return null;
  
  // CalendarDate uses 1-based months, JavaScript Date uses 0-based months
  const jsDate = new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
  return jsDate.toISOString();
};

// Helper function to convert date string to ISO string for Appwrite DateTime
const convertDateStringToISO = (dateString) => {
  if (!dateString) return null;
  
  const jsDate = new Date(dateString);
  return jsDate.toISOString();
};

const submitStepByStep = async (stepNumber, stepData, parentProfileId = null) => {
  try {
    const { databases, storage } = await createSessionClient();
    const cookieStore = await cookies();
    const session = await cookieStore.get("localSession");
    const decriptedSession = await decript(session?.value);

    // Create parent profile first if it doesn't exist
    if (!parentProfileId) {
      const parentProfile = await databases.createDocument(
        process.env.DATABASE_ID,
        process.env.CREATE_PARENT_PROFILE,
        ID.unique(),
        {
          userId: decriptedSession.userId,
          firstName: stepData.firstName || "",
          lastName: stepData.lastName || "",
          description: stepData.description || "",
          profileStatus: "in_progress",
          currentStep: stepNumber,
          totalSteps: 7,
          completedSteps: [stepNumber],
        }
      );
      parentProfileId = parentProfile.$id;
    }

    // Handle different step data based on step number
    switch (stepNumber) {
      case 0:
        // Create zero step document with platform and content type data
        const zeroStepData = await databases.createDocument(
          process.env.DATABASE_ID,
          process.env.CREATE_PROFILE_ZERO_STEP,
          ID.unique(),
          {
            profileId: parentProfileId,
            userId: decriptedSession.userId,
            platforms: stepData.platforms || [],
            customPlatform: stepData.customPlatform || "",
            contentTypes: stepData.contentTypes || [],
            step: 0,
            completed: true,
          }
        );

        // Update parent profile
        await databases.updateDocument(
          process.env.DATABASE_ID,
          process.env.CREATE_PARENT_PROFILE,
          parentProfileId,
          {
            currentStep: 0,
            completedSteps: [0],
          }
        );

        return { 
          success: true, 
          message: "Step 0 data saved successfully", 
          data: zeroStepData,
          step: 0,
          parentProfileId: parentProfileId
        };

      case 1:
        // Create first step document
        const firstStepData = await databases.createDocument(
          process.env.DATABASE_ID,
          process.env.CREATE_PROFILE_FIRST_STEP,
          ID.unique(),
          {
            profileId: parentProfileId,
            userId: decriptedSession.userId,
            firstName: stepData.firstName,
            lastName: stepData.lastName,
            description: stepData.description,
            step: 1,
            completed: true,
          }
        );

        // Update parent profile
        await databases.updateDocument(
          process.env.DATABASE_ID,
          process.env.CREATE_PARENT_PROFILE,
          parentProfileId,
          {
            currentStep: 1,
            completedSteps: [1],
          }
        );

        return { 
          success: true, 
          message: "Step 1 data saved successfully", 
          data: firstStepData,
          step: 1,
          parentProfileId: parentProfileId
        };

      case 2:
        let profilePictureUrl = null;
        if (stepData.profilePicture) {
          const uploadedFile = await storage.createFile(
            process.env.PROFILE_BUKET_ID,
            ID.unique(),
            stepData.profilePicture
          );
          
          // Construct the file URL manually
          profilePictureUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.PROFILE_BUKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.PROJECT_ID}`;
        }
        
        // Create second step document
        const secondStepData = await databases.createDocument(
          process.env.DATABASE_ID,
          process.env.CREATE_PROFILE_SECOND_STEP,
          ID.unique(),
          {
            profileId: parentProfileId,
            userId: decriptedSession.userId,
            profilePictureUrl: profilePictureUrl,
            profilePictureFileId: stepData.profilePicture ? stepData.profilePicture.name : null,
            step: 2,
            completed: true,
          }
        );

        // Update parent profile
        await databases.updateDocument(
          process.env.DATABASE_ID,
          process.env.CREATE_PARENT_PROFILE,
          parentProfileId,
          {
            currentStep: 2,
            completedSteps: [1, 2],
          }
        );

        return { 
          success: true, 
          message: "Step 2 data saved successfully", 
          data: secondStepData,
          step: 2,
          parentProfileId: parentProfileId
        };

      case 3:
        // Create separate documents for each language
        const createdLanguages = [];
        
        for (const languageData of stepData.languages) {
          const languageDocument = await databases.createDocument(
            process.env.DATABASE_ID,
            process.env.CREATE_PROFILE_THIRD_STEP,
            ID.unique(),
            {
              profileId: [parentProfileId],
              userId: decriptedSession.userId,
              language: languageData.language,
              proficiency: languageData.proficiency,
              isCustom: languageData.isCustom || false,
              step: 3,
              completed: true,
            }
          );
          createdLanguages.push(languageDocument);
        }

        // Update parent profile
        await databases.updateDocument(
          process.env.DATABASE_ID,
          process.env.CREATE_PARENT_PROFILE,
          parentProfileId,
          {
            currentStep: 3,
            completedSteps: [1, 2, 3],
          }
        );

        return { 
          success: true, 
          message: `${createdLanguages.length} language(s) saved successfully`, 
          data: createdLanguages,
          step: 3,
          parentProfileId: parentProfileId
        };

      case 4:
        // Create fourth step document
        const fourthStepData = await databases.createDocument(
          process.env.DATABASE_ID,
          process.env.CREATE_PROFILE_FOURTH_STEP,
          ID.unique(),
          {
            profileId: parentProfileId,
            userId: decriptedSession.userId,
            occupation: stepData.occupation,
            startDate: stepData.startDate,
            endDate: stepData.endDate,
            isCurrentlyWorking: stepData.isCurrentlyWorking,
            skills: stepData.skills,
            step: 4,
            completed: true,
          }
        );

        // Update parent profile
        await databases.updateDocument(
          process.env.DATABASE_ID,
          process.env.CREATE_PARENT_PROFILE,
          parentProfileId,
          {
            currentStep: 4,
            completedSteps: [1, 2, 3, 4],
          }
        );

        return { 
          success: true, 
          message: "Step 4 data saved successfully", 
          data: fourthStepData,
          step: 4,
          parentProfileId: parentProfileId
        };

      case 5:
        // Submit each skill individually
        const submittedSkills = [];
        
        if (stepData.additionalSkills && stepData.additionalSkills.length > 0) {
          for (let i = 0; i < stepData.additionalSkills.length; i++) {
            const skill = stepData.additionalSkills[i];
            
            const skillData = await databases.createDocument(
              process.env.DATABASE_ID,
              process.env.CREATE_PROFILE_STEP_FIVE,
              ID.unique(),
              {
                profileId: [parentProfileId],
                userId: decriptedSession.userId,
                skillName: skill.skillName,
                proficiency: skill.proficiency,
                step: 5,
                completed: true,
              }
            );
            submittedSkills.push(skillData);
          }
        }

        // Update parent profile
        await databases.updateDocument(
          process.env.DATABASE_ID,
          process.env.CREATE_PARENT_PROFILE,
          parentProfileId,
          {
            currentStep: 5,
            completedSteps: [1, 2, 3, 4, 5],
          }
        );

        return { 
          success: true, 
          message: `${submittedSkills.length} additional skills saved successfully`, 
          data: submittedSkills,
          step: 5,
          parentProfileId: parentProfileId,
          totalSkillsCount: submittedSkills.length
        };

      case 6:
        // Create sixth step document
        const sixthStepData = await databases.createDocument(
          process.env.DATABASE_ID,
          process.env.CREATE_PROFILE_STEP_SIX,
          ID.unique(),
          {
            profileId: parentProfileId,
            userId: decriptedSession.userId,
            profession: stepData.education?.profession,
            country: stepData.education?.country,
            school: stepData.education?.school,
            educationLevel: stepData.education?.educationLevel,
            startDate: stepData.education?.startDate,
            endDate: stepData.education?.endDate,
            step: 6,
            completed: true,
          }
        );

        // Update parent profile as completed
        await databases.updateDocument(
          process.env.DATABASE_ID,
          process.env.CREATE_PARENT_PROFILE,
          parentProfileId,
          {
            profileStatus: "completed",
            currentStep: 6,
            completedSteps: [0, 1, 2, 3, 4, 5, 6],
          }
        );

        return { 
          success: true, 
          message: "Step 6 data saved successfully", 
          data: sixthStepData,
          step: 6,
          parentProfileId: parentProfileId
        };

      default:
        throw new Error(`Invalid step number: ${stepNumber}`);
    }
  } catch (error) {
    return { 
      success: false, 
      message: { error: error.message || `Failed to save step ${stepNumber} data` },
      step: stepNumber
    };
  }
};

export default submitStepByStep; 