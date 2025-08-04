"use server";
import { createSessionClient } from "../appwriteServer";
import { ID } from "node-appwrite";
import decript from "../components/middleware/decript";
import { cookies } from "next/headers";

const createOnboarding = async (data) => {
  try {
    const { databases } = await createSessionClient();
    const cookieStore = await cookies();
    const session = await cookieStore.get("localSession");
    const decriptedSession = await decript(session?.value);

    const onboarding = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.ONBOARDING_ID,
      ID.unique(),
      {
        userId: decriptedSession.userId,
        role: data.role,
        employmentType: data.employmentType,
        freelanceType: data.freelanceType,
        companySize: data.companySize,
        purpose: data.purpose,
      }
    );
    return { 
      success: true, 
      message: "Onboarding created successfully",
      data: onboarding,
      onboardingId: onboarding.$id
    };
  } catch (error) {
    return { success: false, message: { error: error.message || "Failed to create onboarding" } };
  }
};

export default createOnboarding;
