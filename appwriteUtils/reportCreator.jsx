"use server";
import { createSessionClient } from "../appwriteServer";
import { ID } from "node-appwrite";
import decript from "../components/middleware/decript";
import { cookies } from "next/headers";

const reportCreator = async (data) => {
  try {
    const { databases } = await createSessionClient();
    const cookieStore = await cookies();
    const session = await cookieStore.get("localSession");
    const decriptedSession = await decript(session?.value);

    // Create first step document with reference to parent
    await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.REPORT_CREATOR,
      ID.unique(),
      {
        creatorId: data.creatorId, // Reference to parent profile
        userId: decriptedSession.userId,
        details: data.details,
        reason: data.reason,
        description: data.description,
        reportedAt: data.reportedAt,
      }
    );

    return { 
      success: true, 
      message: "Report Submited Successfully", 
    };
  } catch (error) {
    return { success: false, message: { error: error.message || "Failed to submit report" } };
  }
};

export default reportCreator; 