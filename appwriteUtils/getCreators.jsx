"use server"
import { createAdminClient } from "../appwriteServer"

const getCreators = async() => {
  const { databases } = await createAdminClient()
  const creators = await databases.listDocuments(
    process.env.DATABASE_ID,
    process.env.ONBOARDING_ID
  )
  return creators
}

export default getCreators
