"use server";
import { createSessionClient } from "../../appwriteServer";
import { ID } from "node-appwrite";
import decript from "../../components/middleware/decript";
import { cookies } from "next/headers";

const submitFirstStep = async (data, parentProfileId) => {
  try {
    const { databases } = await createSessionClient();
    const cookieStore = await cookies();
    const session = await cookieStore.get("localSession");
    const decriptedSession = await decript(session?.value);

  

    // Create first step document with reference to parent
    const firstStepData = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PROFILE_FIRST_STEP,
      ID.unique(),
      {
        profileId: parentProfileId, // Reference to parent profile
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
      parentProfileId: parentProfileId
    };
  } catch (error) {
    return { success: false, message: { error: error.message || "Failed to save first step data" } };
  }
};

export default submitFirstStep; 