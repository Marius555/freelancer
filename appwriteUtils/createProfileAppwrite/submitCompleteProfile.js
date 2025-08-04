"use server";
import { createSessionClient } from "../../appwriteServer";
import { ID } from "node-appwrite";
import decript from "../../components/middleware/decript";
import { cookies } from "next/headers";

const submitCompleteProfile = async (allFormData, parentProfileId) => {
  try {
    const { databases, storage } = await createSessionClient();
    const cookieStore = await cookies();
    const session = await cookieStore.get("localSession");
    const decriptedSession = await decript(session?.value);

    // Create parent profile first
    // const parentProfile = await databases.createDocument(
    //   process.env.DATABASE_ID,
    //   process.env.CREATE_PARENT_PROFILE,
    //   ID.unique(),
    //   {
    //     profileId: parentProfileId,
    //     userId: decriptedSession.userId,
    //     firstName: allFormData.firstName,
    //     lastName: allFormData.lastName,
    //     description: allFormData.description,
    //   }
    // );

    

    let profilePictureUrl = null;
    
    // Upload profile picture to storage if provided
    if (allFormData.profilePicture) {
      const file = allFormData.profilePicture;
      const uploadedFile = await storage.createFile(
        process.env.PROFILE_BUKET_ID,
        ID.unique(),
        file
      );
      
      // Construct the file URL manually
      profilePictureUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.PROFILE_BUKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.PROJECT_ID}`;
    }

    // Create step documents for each step
    const createdDocuments = {};

    // Step 0: Platform and Content Type Preferences
    const zeroStepData = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PROFILE_ZERO_STEP,
      ID.unique(),
      {
        profileId: parentProfileId,
        userId: decriptedSession.userId,
        platforms: allFormData.platforms || [],
        customPlatform: allFormData.customPlatform || "",
        contentTypes: allFormData.contentTypes || [],
        step: 0,
        completed: true,
      }
    );
    createdDocuments.step0 = zeroStepData;

    // Step 1: Basic Info
    const firstStepData = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PROFILE_FIRST_STEP,
      ID.unique(),
      {
        profileId: parentProfileId,
        userId: decriptedSession.userId,
        firstName: allFormData.firstName,
        lastName: allFormData.lastName,
        description: allFormData.description,
        step: 1,
        completed: true,
      }
    );
    createdDocuments.step1 = firstStepData;

    // Step 2: Profile Picture
    const secondStepData = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PROFILE_SECOND_STEP,
      ID.unique(),
      {
        profileId: parentProfileId,
        userId: decriptedSession.userId,
        profilePictureUrl: profilePictureUrl,
        profilePictureFileId: allFormData.profilePicture ? allFormData.profilePicture.name : null,
        step: 2,
        completed: true,
      }
    );
    createdDocuments.step2 = secondStepData;

    // Step 3: Languages (create separate documents for each language)
    const createdLanguages = [];
    if (allFormData.languages && allFormData.languages.length > 0) {
      for (const languageData of allFormData.languages) {
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
    }
    createdDocuments.step3 = createdLanguages;

    // Step 4: Occupation & Skills
    const fourthStepData = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PROFILE_FOURTH_STEP,
      ID.unique(),
      {
        profileId: parentProfileId,
        userId: decriptedSession.userId,
        occupation: allFormData.occupation,
        startDate: allFormData.startDate,
        endDate: allFormData.endDate,
        isCurrentlyWorking: allFormData.isCurrentlyWorking,
        skills: allFormData.skills,
        step: 4,
        completed: true,
      }
    );
    createdDocuments.step4 = fourthStepData;

    // Step 5: Additional Skills (create multiple documents for each skill)
    const submittedSkills = [];
    if (allFormData.additionalSkills && allFormData.additionalSkills.length > 0) {
      for (let i = 0; i < allFormData.additionalSkills.length; i++) {
        const skill = allFormData.additionalSkills[i];
        
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
    createdDocuments.step5 = submittedSkills;

    // Step 6: Education
    const sixthStepData = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PROFILE_STEP_SIX,
      ID.unique(),
      {
        profileId: parentProfileId,
        userId: decriptedSession.userId,
        profession: allFormData.education?.profession,
        country: allFormData.education?.country,
        school: allFormData.education?.school,
        educationLevel: allFormData.education?.educationLevel,
        startDate: allFormData.education?.startDate,
        endDate: allFormData.education?.endDate,
        step: 6,
        completed: true,
      }
    );
    createdDocuments.step6 = sixthStepData;

    return { 
      success: true, 
      message: "Complete profile created successfully", 
      data: {
        stepDocuments: createdDocuments,
        totalSkillsCount: submittedSkills.length,
        parentProfileId: parentProfileId
      }
    };
  } catch (error) {
    return { 
      success: false, 
      message: { error: error.message || "Failed to create complete profile" } 
    };
  }
};

export default submitCompleteProfile; 