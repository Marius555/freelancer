"use server";
import { createSessionClient } from "../../appwriteServer";
import { ID } from "node-appwrite";
import decript from "../../components/middleware/decript";
import { cookies } from "next/headers";

const submitFifthStep = async (data, parentProfileId) => {
  try {
    const { databases } = await createSessionClient();
    const cookieStore = await cookies();
    const session = await cookieStore.get("localSession");
    const decriptedSession = await decript(session?.value);

    // Update parent profile with current step
    await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PARENT_PROFILE,
      parentProfileId,
      {
        currentStep: 5,
        completedSteps: [1, 2, 3, 4, 5],
      }
    );

    // Submit each skill individually
    const submittedSkills = [];
    
    
    if (data.additionalSkills && data.additionalSkills.length > 0) {
      for (let i = 0; i < data.additionalSkills.length; i++) {
        const skill = data.additionalSkills[i];
        
        const skillData = await databases.createDocument(
          process.env.DATABASE_ID,
          process.env.CREATE_PROFILE_STEP_FIVE,
          ID.unique(),
          {
            profileId: [parentProfileId], // Reference to parent profile
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
    

    return { 
      success: true, 
      message: `${submittedSkills.length} additional skills saved successfully`, 
      data: submittedSkills,
      totalSkillsCount: submittedSkills.length
    };
  } catch (error) {
    return { success: false, message: { error: error.message || "Failed to save additional skills" } };
  }
};

export default submitFifthStep; 