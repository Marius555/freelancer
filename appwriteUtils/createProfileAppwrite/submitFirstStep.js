"use server";
import { createSessionClient } from "../../appwriteServer";
import { ID } from "node-appwrite";
import decript from "../../components/middleware/decript";
import { cookies } from "next/headers";

const submitFirstStep = async (data) => {
  try {
    const { databases } = await createSessionClient();
    const cookieStore = await cookies();
    const session = await cookieStore.get("localSession");
    const decriptedSession = await decript(session?.value);

    // Create parent profile document
    const parentProfile = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PARENT_PROFILE,
      ID.unique(),
      {
        userId: decriptedSession.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        description: data.description,
        profileStatus: "in_progress",
        currentStep: 1,
        totalSteps: 6,
        completedSteps: [1],

      }
    );
    console.log(parentProfile.$id);

    // Create first step document with reference to parent
    const firstStepData = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PROFILE_FIRST_STEP,
      ID.unique(),
      {
        profileId: parentProfile.$id, // Reference to parent profile
        userId: decriptedSession.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        description: data.description,
        step: 1,
        completed: true,
      }
    );

    return { 
      success: true, 
      message: "First step data saved successfully", 
      data: firstStepData,
      parentProfileId: parentProfile.$id
    };
  } catch (error) {
    return { success: false, message: { error: error.message || "Failed to save first step data" } };
  }
};

export default submitFirstStep; 