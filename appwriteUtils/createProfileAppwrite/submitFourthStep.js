"use server";
import { createSessionClient } from "../../appwriteServer";
import { ID } from "node-appwrite";
import decript from "../../components/middleware/decript";
import { cookies } from "next/headers";


const submitFourthStep = async (data, parentProfileId) => {
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
        currentStep: 4,
        completedSteps: [1, 2, 3, 4],
      }
    );

    const fourthStepData = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PROFILE_FOURTH_STEP,
      ID.unique(),
      {
        profileId: parentProfileId, // Reference to parent profile
        userId: decriptedSession.userId,
        occupation: data.occupation,
        startDate: data.startDate,
        endDate: data.endDate,
        isCurrentlyWorking: data.isCurrentlyWorking,
        skills: data.skills,
        step: 4,
        completed: true,
      }
    );
    return { success: true, message: "Occupation and skills saved successfully", data: fourthStepData };
  } catch (error) {
    return { success: false, message: { error: error.message || "Failed to save occupation and skills" } };
  }
};

export default submitFourthStep; 