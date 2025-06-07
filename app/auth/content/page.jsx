"use client"

import { useState } from "react";
import Sidebar from "../../../components/sideBar";
import { Card, CardBody, CardFooter, Image, Button, Avatar, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Tooltip } from "@heroui/react";
import { Heart, MessageCircle, Eye, Share2, Trophy, ChevronDown } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Premium Watch",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa",
    views: 1234,
    likes: 89,
    shares: 45,
    topSharers: [
      { id: 1, name: "John Doe", shares: 15, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
      { id: 2, name: "Jane Smith", shares: 12, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024e" },
      { id: 3, name: "Mike Johnson", shares: 8, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024f" },
    ],
    comments: [
      { id: 1, user: "John Doe", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d", text: "Amazing product!", time: "2h ago" },
      { id: 2, user: "Jane Smith", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024e", text: "Would love to have this!", time: "1h ago" },
    ]
  },
  {
    id: 2,
    name: "Wireless Headphones",
    image: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc",
    views: 2345,
    likes: 156,
    shares: 78,
    topSharers: [
      { id: 1, name: "Sarah Wilson", shares: 20, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024g" },
      { id: 2, name: "Tom Brown", shares: 15, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024h" },
      { id: 3, name: "Emma Davis", shares: 10, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024i" },
    ],
    comments: [
      { id: 1, user: "Sarah Wilson", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024g", text: "Best headphones ever!", time: "3h ago" },
      { id: 2, user: "Tom Brown", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024h", text: "Great sound quality!", time: "2h ago" },
    ]
  },
  {
    id: 3,
    name: "Smart Camera",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    views: 3456,
    likes: 234,
    shares: 92,
    topSharers: [
      { id: 1, name: "Alex Turner", shares: 25, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024j" },
      { id: 2, name: "Lisa Chen", shares: 18, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024k" },
      { id: 3, name: "David Park", shares: 12, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024l" },
    ],
    comments: [
      { id: 1, user: "Alex Turner", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024j", text: "Perfect for photography!", time: "4h ago" },
      { id: 2, user: "Lisa Chen", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024k", text: "Amazing features!", time: "3h ago" },
    ]
  },
  {
    id: 4,
    name: "Gaming Console",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3",
    views: 4567,
    likes: 345,
    shares: 120,
    topSharers: [
      { id: 1, name: "Chris Lee", shares: 30, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024m" },
      { id: 2, name: "Maria Garcia", shares: 22, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024n" },
      { id: 3, name: "James Wilson", shares: 15, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024o" },
    ],
    comments: [
      { id: 1, user: "Chris Lee", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024m", text: "Best gaming experience!", time: "5h ago" },
      { id: 2, user: "Maria Garcia", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024n", text: "Love the graphics!", time: "4h ago" },
    ]
  }
];

export default function Content() {
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [showComments, setShowComments] = useState(null);
  const [showRankings, setShowRankings] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  const handleLike = (productId) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleShare = (productId) => {
    const url = `${window.location.origin}/product/${productId}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
  };

  const handleComment = (productId) => {
    if (newComment.trim()) {
      // Here you would typically make an API call to save the comment
      console.log(`Adding comment to product ${productId}: ${newComment}`);
      setNewComment("");
    }
  };

  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      <main className="flex-1 p-8 flex flex-col h-screen">
        {/* Hero Image Section */}
        <div className="relative w-full h-[30vh] mb-6 rounded-2xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661"
            alt="Hero Product"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">Featured Product</h1>
              <p className="text-lg opacity-90">Discover our latest innovation in technology</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-[calc(70vh-8rem)]">
            {products.map((product) => (
              <Card key={product.id} className="hover:scale-105 transition-transform duration-200">
                <CardBody className="p-0">
                  <div className="w-full h-[180px] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CardBody>
                <CardFooter className="flex flex-col gap-2 p-3">
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-base font-semibold">{product.name}</h3>
                    <Button 
                      isIconOnly 
                      variant="light" 
                      size="sm"
                      color={likedProducts.has(product.id) ? "danger" : "default"}
                      onClick={() => handleLike(product.id)}
                    >
                      <Heart className={`w-4 h-4 ${likedProducts.has(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center w-full text-xs text-default-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{product.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{product.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{product.comments.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      <span>{product.shares}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full pt-2 border-t">
                    <Avatar
                      src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                      size="sm"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium">John Doe</p>
                      <p className="text-[10px] text-default-500">2 hours ago</p>
                    </div>
                    <div className="flex gap-1">
                      <Tooltip content="View Rankings">
                        <Button 
                          isIconOnly 
                          variant="light" 
                          size="sm"
                          onClick={() => setShowRankings(product.id)}
                        >
                          <Trophy className="w-3 h-3" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Share">
                        <Button 
                          isIconOnly 
                          variant="light" 
                          size="sm"
                          onClick={() => handleShare(product.id)}
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Comments">
                        <Button 
                          isIconOnly 
                          variant="light" 
                          size="sm"
                          onClick={() => setShowComments(product.id)}
                        >
                          <MessageCircle className="w-3 h-3" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Comments Modal */}
        <Modal 
          isOpen={showComments !== null} 
          onClose={() => setShowComments(null)}
          size="lg"
        >
          <ModalContent>
            <ModalHeader>Comments</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {products.find(p => p.id === showComments)?.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar src={comment.avatar} size="sm" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{comment.user}</p>
                        <p className="text-sm text-default-500">{comment.time}</p>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button 
                  color="primary"
                  onClick={() => handleComment(showComments)}
                >
                  Post
                </Button>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Rankings Modal */}
        <Modal 
          isOpen={showRankings !== null} 
          onClose={() => setShowRankings(null)}
        >
          <ModalContent>
            <ModalHeader>Top Sharers</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {products.find(p => p.id === showRankings)?.topSharers.map((sharer, index) => (
                  <div key={sharer.id} className="flex items-center gap-3">
                    <div className="w-6 text-center font-bold">{index + 1}</div>
                    <Avatar src={sharer.avatar} size="sm" />
                    <div className="flex-1">
                      <p className="font-medium">{sharer.name}</p>
                      <p className="text-sm text-default-500">{sharer.shares} shares</p>
                    </div>
                    {index === 0 && (
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </main>
    </div>
  );
}
