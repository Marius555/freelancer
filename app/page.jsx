"use server"
import HeroSection from "../components/heroSection";
import Scroll from "../components/homepage_horizontal_scroll/scroll";
import getCreators from "../appwriteUtils/getCreators";

// Helper function to map profession values to readable categories
const mapProfessionToCategory = (profession) => {
  const professionMap = {
    "web_developer": "Web Development",
    "frontend_developer": "Frontend Development", 
    "backend_developer": "Backend Development",
    "fullstack_developer": "Full Stack Development",
    "mobile_developer": "Mobile Development",
    "ui_ux_designer": "UI/UX Design",
    "graphic_designer": "Graphic Design",
    "digital_artist": "Digital Art",
    "content_writer": "Content Writing",
    "copywriter": "Copywriting",
    "blog_writer": "Blog Writing",
    "technical_writer": "Technical Writing",
    "video_editor": "Video Editing",
    "video_producer": "Video Production",
    "motion_graphics": "Motion Graphics",
    "voice_over": "Voice Over",
    "podcast_editor": "Podcast Editing",
    "audio_engineer": "Audio Engineering",
    "music_producer": "Music Production",
    "social_media_manager": "Social Media",
    "digital_marketer": "Digital Marketing",
    "seo_specialist": "SEO",
    "ppc_specialist": "PPC Marketing",
    "email_marketer": "Email Marketing",
    "data_analyst": "Data Analysis",
    "data_scientist": "Data Science",
    "business_analyst": "Business Analysis",
    "project_manager": "Project Management",
    "virtual_assistant": "Virtual Assistant",
    "customer_service": "Customer Service",
    "translation": "Translation",
    "interpreter": "Interpretation",
    "proofreader": "Proofreading",
    "editor": "Editing",
    "researcher": "Research",
    "consultant": "Consulting",
    "coach": "Coaching",
    "trainer": "Training",
    "instructor": "Instruction",
    "tutor": "Tutoring",
    "accountant": "Accounting",
    "bookkeeper": "Bookkeeping",
    "legal_assistant": "Legal",
    "paralegal": "Legal",
    "architect": "Architecture",
    "interior_designer": "Interior Design",
    "photographer": "Photography",
    "illustrator": "Illustration",
    "animator": "Animation",
    "3d_artist": "3D Art",
    "game_developer": "Game Development",
    "cybersecurity": "Cybersecurity",
    "network_administrator": "Network Administration",
    "system_administrator": "System Administration",
    "devops_engineer": "DevOps",
    "qa_tester": "QA Testing",
    "ai-ml": "AI/ML"
  };
  return professionMap[profession] || "Other";
};

// Helper function to check if user is new (created within 7 days)
const isUserNew = (createdAt) => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const daysDifference = (now - createdDate) / (1000 * 60 * 60 * 24);
  return daysDifference <= 7;
};

// Helper function to transform creator data for scroll component
const transformCreatorData = (creator) => {
  const firstName = creator.step_two?.firstName || "";
  const lastName = creator.step_two?.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || "Anonymous Creator";
  
  // Get the profile picture URL and log it for debugging
  const profilePictureUrl = creator.step_three?.profilePictureUrl;
  console.log(`Creator ${name} avatar URL:`, profilePictureUrl);
  
  return {
    name,
    username: "", // Will be populated later when username field is available
    tagline: creator.step_two?.description || "Content creator",
    category: mapProfessionToCategory(creator.step_seven?.profession),
    contentTypes: creator.step_zero?.contentTypes || [],
    rating: 4.5, // Placeholder - will be replaced with actual ratings later
    reviews: 0, // Placeholder - will be replaced with actual review counts later
    verified: false, // Placeholder - will be replaced with verification logic later
    isNew: isUserNew(creator.$createdAt),
    avatar: profilePictureUrl,
    buttonText: "View Profile"
  };
};

export default async function Home() {
  const creatorsResponse = await getCreators();
  console.log("Raw creators data:", creatorsResponse);
  
  // Filter creators who have "youtube" in their platforms
  const youtubeCreators = creatorsResponse?.documents?.filter(creator => 
    creator.step_zero?.platforms?.includes("youtube")
  ) || [];
  
  // Transform the filtered data to match Scroll component format
  const transformedYoutubeCreators = youtubeCreators.map(transformCreatorData);
  
  console.log("Transformed YouTube creators:", transformedYoutubeCreators);
  
  return (
    <div>
      <HeroSection />
      <Scroll 
        title="YouTube Creators"
        subtitle="Discover talented YouTube content creators"
        data={transformedYoutubeCreators}
      />
    </div>
  );
}
