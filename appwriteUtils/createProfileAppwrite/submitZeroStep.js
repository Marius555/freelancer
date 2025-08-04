"use server";
import { createSessionClient } from "../../appwriteServer";
import { ID } from "node-appwrite";
import decript from "../../components/middleware/decript";
import { cookies } from "next/headers";

const submitZeroStep = async (data, parentProfileId = null) => {
  try {
    const { databases } = await createSessionClient();
    const cookieStore = await cookies();
    const session = await cookieStore.get("localSession");
    const decriptedSession = await decript(session?.value);

    // Create parent profile first if it doesn't exist (for step 0)
    if (!parentProfileId) {
      const parentProfile = await databases.createDocument(
        process.env.DATABASE_ID,
        process.env.CREATE_PARENT_PROFILE,
        ID.unique(),
        {
          userId: decriptedSession.userId,
          firstName: "",
          lastName: "",
          description: "",
          profileStatus: "in_progress",
          currentStep: 0,
          totalSteps: 7,
          completedSteps: [0],
        }
      );
      parentProfileId = parentProfile.$id;
    } else {
      // Update parent profile with current step
      await databases.updateDocument(
        process.env.DATABASE_ID,
        process.env.CREATE_PARENT_PROFILE,
        parentProfileId,
        {
          currentStep: 0,
          completedSteps: [0],
        }
      );
    }

    // Create zero step document with platform and content type data
    const zeroStepData = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PROFILE_ZERO_STEP,
      ID.unique(),
      {
        profileId: parentProfileId,
        userId: decriptedSession.userId,
        platforms: data.platforms || [],
        customPlatform: data.customPlatform || "",
        contentTypes: data.contentTypes || [],
        step: 0,
        completed: true,
      }
    );

    return { 
      success: true, 
      message: "Platform and content type preferences saved successfully", 
      data: zeroStepData,
      parentProfileId: parentProfileId
    };
  } catch (error) {
    return { 
      success: false, 
      message: { error: error.message || "Failed to save platform and content type data" } 
    };
  }
};

export default submitZeroStep; 