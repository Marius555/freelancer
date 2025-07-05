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

    // Update parent profile with complete data
    const updatedParentProfile = await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PARENT_PROFILE,
      parentProfileId,
      {
        // Step 1: Basic Info
        firstName: allFormData.firstName,
        lastName: allFormData.lastName,
        description: allFormData.description,
        
        // Step 2: Profile Picture
        profilePictureUrl: profilePictureUrl,
        profilePictureFileId: allFormData.profilePicture ? allFormData.profilePicture.name : null,
        
        // Step 3: Languages
        languages: allFormData.languages,
        
        // Step 4: Occupation & Skills
        occupation: allFormData.occupation,
        workStartDate: allFormData.startDate,
        workEndDate: allFormData.endDate,
        isCurrentlyWorking: allFormData.isCurrentlyWorking,
        occupationSkills: allFormData.skills,
        yearsOfExperience: allFormData.yearsOfExperience || 0,
        
        // Step 5: Additional Skills
        additionalSkills: allFormData.skills,
        totalSkillsCount: allFormData.skills ? allFormData.skills.length : 0,
        
        // Step 6: Education
        profession: allFormData.education?.profession,
        country: allFormData.education?.country,
        school: allFormData.education?.school,
        educationLevel: allFormData.education?.educationLevel,
        educationStartDate: allFormData.education?.startDate,
        educationEndDate: allFormData.education?.endDate,
        
        // Profile metadata
        profileStatus: "completed",
        currentStep: 6,
        totalSteps: 6,
        completedSteps: [1, 2, 3, 4, 5, 6],
      }
    );

    return { 
      success: true, 
      message: "Complete profile updated successfully", 
      data: updatedParentProfile 
    };
  } catch (error) {
    return { 
      success: false, 
      message: { error: error.message || "Failed to update complete profile" } 
    };
  }
};

export default submitCompleteProfile; 