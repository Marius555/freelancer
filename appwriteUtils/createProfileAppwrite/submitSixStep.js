"use server";
import { createSessionClient } from "../../appwriteServer";
import { ID } from "node-appwrite";
import decript from "../../components/middleware/decript";
import { cookies } from "next/headers";

// Helper function to convert date string to ISO string for Appwrite DateTime
const convertDateStringToISO = (dateString) => {
  if (!dateString) return null;
  
  const jsDate = new Date(dateString);
  return jsDate.toISOString();
};

const submitSixStep = async (data, parentProfileId) => {
  try {
    const { databases } = await createSessionClient();
    const cookieStore = await cookies();
    const session = await cookieStore.get("localSession");
    const decriptedSession = await decript(session?.value);

    // Update parent profile as completed
    await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PARENT_PROFILE,
      parentProfileId,
      {
        currentStep: 6,
        completedSteps: [1, 2, 3, 4, 5, 6],
        profileStatus: "completed",
      }
    );

    const sixStepData = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PROFILE_SIX_STEP,
      ID.unique(),
      {
        profileId: parentProfileId, // Reference to parent profile
        userId: decriptedSession.userId,
        profession: data.education.profession,
        country: data.education.country,
        school: data.education.school,
        educationLevel: data.education.educationLevel,
        startDate: convertDateStringToISO(data.education.startDate),
        endDate: convertDateStringToISO(data.education.endDate),
        step: 6,
        completed: true,
      }
    );
    return { success: true, message: "Education information saved successfully", data: sixStepData };
  } catch (error) {
    return { success: false, message: { error: error.message || "Failed to save education information" } };
  }
};

export default submitSixStep; 