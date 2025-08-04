"use client";
import React, { useRef, useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Link, Chip } from "@heroui/react";
import { Star, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

// TODO: Remove these hardcoded arrays in the future - they're kept as fallback for backward compatibility
const userPhotos = [
  "fake1.jpeg",
  "fake2.jpeg",
  "fake3.jpeg",
  "fake4.jpeg",
  "fake5.jpeg",
  "fake6.jpeg",
  "fake7.jpeg",
];

const youtubeCreators = [
  {
    name: "Alex Gaming",
    username: "alexgaming_yt",
    tagline: "Gaming content & reviews",
    category: "Gaming",
    rating: 4.9,
    reviews: 320,
    verified: true,
    isNew: true
  },
  {
    name: "Sarah Tech",
    username: "sarahtech_official",
    tagline: "Tech tutorials & unboxings",
    category: "Technology",
    rating: 4.8,
    reviews: 285,
    verified: false,
    isNew: false
  },
  {
    name: "Mike Vlogs",
    username: "mikevlogs_daily",
    tagline: "Daily lifestyle vlogs",
    category: "Lifestyle",
    rating: 5.0,
    reviews: 450,
    verified: true,
    isNew: true
  },
  {
    name: "Emma Cooking",
    username: "emmacooks_youtube",
    tagline: "Easy cooking tutorials",
    category: "Food & Cooking",
    rating: 4.7,
    reviews: 198,
    verified: false,
    isNew: false
  },
  {
    name: "David Fitness",
    username: "davidfitness_yt",
    tagline: "Workout & nutrition tips",
    category: "Fitness",
    rating: 4.9,
    reviews: 267,
    verified: true,
    isNew: false
  },
  {
    name: "Luna Music",
    username: "lunamusic_covers",
    tagline: "Music covers & originals",
    category: "Music",
    rating: 4.8,
    reviews: 189,
    verified: false,
    isNew: true
  },
  {
    name: "Ryan Comedy",
    username: "ryancomedy_shorts",
    tagline: "Comedy skits & shorts",
    category: "Comedy",
    rating: 5.0,
    reviews: 356,
    verified: true,
    isNew: false
  },
];

const Scroll = ({ 
  title = "YouTube", 
  subtitle = "Discover top creators and their latest content",
  data = null 
}) => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Use passed data or fall back to hardcoded data (TODO: Remove fallback in the future)
  const displayData = data || youtubeCreators;
  const cardCount = displayData.length;

  // Wheel scroll functionality disabled to prevent interference with page scrolling

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = x - startX;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
  };

  const scrollToLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    container.scrollTo({
      left: container.scrollLeft - 300,
      behavior: 'smooth'
    });
  };

  const scrollToRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    container.scrollTo({
      left: container.scrollLeft + 300,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollButtons();
    
    const handleScroll = () => {
      checkScrollButtons();
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="w-full py-12 sm:py-20 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-8">
        {/* Dynamic Title */}
        <div className="mb-6 sm:mb-8 text-left">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
              <span className="text-default-500 text-xs sm:text-sm">{subtitle}</span>
            </div>
            <Button
              variant="flat"
              size="sm"
              className="bg-default-100 text-default-700 hover:bg-default-200 border border-default-200 transition-colors text-xs sm:text-sm px-3 sm:px-4"
              endContent={<ChevronRight size={14} className="sm:w-4 sm:h-4" />}
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
            </Button>
          </div>
        </div>
        
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <Button
              onClick={scrollToLeft}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm border border-default-200 shadow-lg hover:bg-background/90 transition-all duration-200 w-8 h-8 sm:w-10 sm:h-10"
              variant="flat"
              size="sm"
              isIconOnly
            >
              <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
            </Button>
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <Button
              onClick={scrollToRight}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm border border-default-200 shadow-lg hover:bg-background/90 transition-all duration-200 w-8 h-8 sm:w-10 sm:h-10"
              variant="flat"
              size="sm"
              isIconOnly
            >
              <ChevronRight size={16} className="sm:w-5 sm:h-5" />
            </Button>
          )}

          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-visible cursor-grab select-none [&::-webkit-scrollbar]:hidden" 
            style={{ 
              height: 'auto',
              minHeight: '320px',
              scrollBehavior: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
          <div className="flex gap-3 sm:gap-6 min-w-fit py-4 sm:py-8">
            {displayData.map((creator, idx) => {
              // For backward compatibility with hardcoded data, use userPhotos array as fallback
              const photo = creator.photo || userPhotos[idx] || userPhotos[0];
              
              // Helper function to format content types
              const formatContentTypes = (contentTypes) => {
                if (!contentTypes || contentTypes.length === 0) return "Content Creator";
                
                const typeMap = {
                  "short_form": "Short Form",
                  "long_form": "Long Form"
                };
                
                const formattedTypes = contentTypes.map(type => typeMap[type] || type);
                
                if (formattedTypes.length === 2) {
                  return "Short & Long Form";
                } else {
                  return formattedTypes.join(", ");
                }
              };
              
              return (
                 <Card
                   key={`${creator.name}-${idx}`}
                   className="bg-background border border-default-200 shadow-md rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-lg flex-shrink-0 relative"
                   style={{ width: 'clamp(240px, 22vw, 280px)' }}
                 >
                   {/* New tag on left side */}
                   {creator.isNew && (
                     <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                       <Chip
                         variant="flat"
                         className="bg-foreground text-background font-medium shadow text-xs px-2 py-1"
                         size="sm"
                       >
                         New
                       </Chip>
                     </div>
                   )}
                   
                   {/* Report button on right side */}
                   <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                     <Button
                       isIconOnly
                       variant="flat"
                       size="sm"
                       className="bg-default-100 text-default-700"
                     >
                       <MoreVertical size={12} className="sm:w-4 sm:h-4" />
                     </Button>
                   </div>
                   
                   <CardHeader className="flex flex-col items-center pb-3 sm:pb-4 pt-4 sm:pt-6">
                     <Avatar
                       src={creator.avatar || `/fake_test_profiles/${photo}`}
                       alt={creator.name}
                       className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-default-200 shadow"
                       size="lg"
                     />
                     {/* Content type chip instead of category */}
                     <Chip
                       variant="flat"
                       className="mt-2 sm:mt-3 bg-default-100 text-default-700 border border-default-200 text-xs"
                       size="sm"
                     >
                       {formatContentTypes(creator.contentTypes)}
                     </Chip>
                   </CardHeader>

                  <CardBody className="flex flex-col items-center text-center px-4 sm:px-6 py-0">
                    <h3 className="text-foreground text-base sm:text-lg font-bold mb-1">
                      {creator.name}
                    </h3>
                    {creator.username && (
                      <Link 
                        href="#" 
                        className="text-default-500 text-xs sm:text-sm mb-2 hover:text-default-700"
                        underline="hover"
                      >
                        @{creator.username}
                      </Link>
                    )}
                    {creator.tagline && (
                      <div className="relative mb-3 w-full">
                        <p 
                          className="text-default-600 text-xs sm:text-sm leading-relaxed overflow-hidden"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: '1.4',
                            maxHeight: '2.8em'
                          }}
                          title={creator.tagline}
                        >
                          {creator.tagline}
                        </p>
                      </div>
                    )}
                    
                    {creator.rating && (
                      <div className="flex items-center justify-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={`sm:w-4 sm:h-4 ${i < Math.round(creator.rating) ? "text-foreground fill-current" : "text-default-300"}`} 
                          />
                        ))}
                        <span className="ml-1 sm:ml-2 text-foreground text-xs sm:text-sm font-medium">
                          {creator.rating.toFixed(1)}
                        </span>
                        {creator.reviews && (
                          <span className="text-default-500 text-xs ml-1">
                            ({creator.reviews})
                          </span>
                        )}
                      </div>
                    )}
                  </CardBody>

                  <CardFooter className="flex flex-col px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
                    <Button
                      className="w-full rounded-full font-medium shadow text-xs sm:text-sm py-2 sm:py-2.5 bg-foreground text-background hover:bg-default-800 transition-colors h-8 sm:h-10"
                      variant="solid"
                    >
                      {creator.buttonText || "View Channel"}
                    </Button>
                  </CardFooter>
                </Card>
              );
                         })}
           </div>
         </div>
               </div>
      </div>
    </section>
  );
};

export default Scroll;
