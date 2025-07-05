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

    let documentData = {
      userId: decriptedSession.userId,
      step: stepNumber,
      completed: true,
    };

    // For step 1, create parent profile if not provided
    if (stepNumber === 1 && !parentProfileId) {
      const parentProfile = await databases.createDocument(
        process.env.DATABASE_ID,
        process.env.CREATE_PARENT_PROFILE,
        ID.unique(),
        {
          userId: decriptedSession.userId,
          firstName: stepData.firstName,
          lastName: stepData.lastName,
          description: stepData.description,
          profileStatus: "in_progress",
          currentStep: 1,
          totalSteps: 6,
          completedSteps: [1],
        }
      );
      parentProfileId = parentProfile.$id;
    }

    // Add parent profile reference to all steps
    if (parentProfileId) {
      documentData.profileId = parentProfileId;
    }

    // Handle different step data based on step number
    switch (stepNumber) {
      case 1:
        documentData = {
          ...documentData,
          firstName: stepData.firstName,
          lastName: stepData.lastName,
          description: stepData.description,
        };
        break;

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
        
        documentData = {
          ...documentData,
          profilePictureUrl: profilePictureUrl,
          profilePictureFileId: stepData.profilePicture ? stepData.profilePicture.name : null,
        };
        break;

      case 3:
        documentData = {
          ...documentData,
          languages: stepData.languages,
        };
        break;

      case 4:
        documentData = {
          ...documentData,
          occupation: stepData.occupation,
          startDate: convertCalendarDateToISO(stepData.startDate),
          endDate: convertCalendarDateToISO(stepData.endDate),
          isCurrentlyWorking: stepData.isCurrentlyWorking,
          skills: stepData.skills,
          yearsOfExperience: stepData.yearsOfExperience || 0,
        };
        break;

      case 5:
        documentData = {
          ...documentData,
          additionalSkills: stepData.additionalSkills,
          totalSkillsCount: stepData.additionalSkills ? stepData.additionalSkills.length : 0,
        };
        break;

      case 6:
        documentData = {
          ...documentData,
          profession: stepData.education?.profession,
          country: stepData.education?.country,
          school: stepData.education?.school,
          educationLevel: stepData.education?.educationLevel,
          startDate: convertDateStringToISO(stepData.education?.startDate),
          endDate: convertDateStringToISO(stepData.education?.endDate),
        };
        break;

      default:
        throw new Error(`Invalid step number: ${stepNumber}`);
    }

    // Update parent profile with current step progress
    if (parentProfileId) {
      const completedSteps = Array.from({ length: stepNumber }, (_, i) => i + 1);
      const updateData = {
        currentStep: stepNumber,
        completedSteps: completedSteps,
      };

      // Mark as completed on final step
      if (stepNumber === 6) {
        updateData.profileStatus = "completed";
      }

      await databases.updateDocument(
        process.env.DATABASE_ID,
        process.env.CREATE_PARENT_PROFILE,
        parentProfileId,
        updateData
      );
    }

    // Get the appropriate collection ID based on step
    const collectionIds = {
      1: process.env.CREATE_PROFILE_FIRST_STEP,
      2: process.env.CREATE_PROFILE_SECOND_STEP,
      3: process.env.CREATE_PROFILE_THIRD_STEP,
      4: process.env.CREATE_PROFILE_FOURTH_STEP,
      5: process.env.CREATE_PROFILE_FIFTH_STEP,
      6: process.env.CREATE_PROFILE_SIX_STEP,
    };

    const collectionId = collectionIds[stepNumber];
    if (!collectionId) {
      throw new Error(`Collection ID not found for step ${stepNumber}`);
    }

    const stepDocument = await databases.createDocument(
      process.env.DATABASE_ID,
      collectionId,
      ID.unique(),
      documentData
    );

    return { 
      success: true, 
      message: `Step ${stepNumber} data saved successfully`, 
      data: stepDocument,
      step: stepNumber,
      parentProfileId: parentProfileId
    };
  } catch (error) {
    return { 
      success: false, 
      message: { error: error.message || `Failed to save step ${stepNumber} data` },
      step: stepNumber
    };
  }
};

export default submitStepByStep; 