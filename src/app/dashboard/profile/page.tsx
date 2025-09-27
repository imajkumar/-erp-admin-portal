"use client";

import AdminLayout from "@/components/Layout";
import MainContent from "@/components/MainContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Phone, 
  Globe, 
  Edit, 
  MoreHorizontal,
  CheckCircle,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  Briefcase,
  Award,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Bookmark
} from "lucide-react";

export default function ProfilePage() {
  const handleItemClick = (item: string) => {
    // Handle navigation if needed
    console.log('Item clicked:', item);
  };

  return (
    <AdminLayout activeItem="profile" onItemClick={handleItemClick}>
      <MainContent>
          {/* Main Profile Content */}
          <div className="space-y-6">
          {/* User Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="Max Smith" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl font-bold text-gray-900">Max Smith</h1>
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-gray-600">Developer</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>SF, Bay Area</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>max@kt.com</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    Follow
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Hire Me
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <Card className="border-0 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">↑ $4,500</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Earnings</p>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-600">↓ 80</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Projects</p>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">↑ 60%</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Success Rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Completion */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                  <span className="text-sm text-gray-500">50%</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="followers">Followers</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Social Feed Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Social Feed</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Post Input */}
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" alt="Grace Green" />
                  <AvatarFallback>GG</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="font-medium text-gray-900">Grace Green</span>
                    <span className="text-sm text-gray-500 ml-2">PHP, SQLite, Artisan CLI</span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <input 
                      type="text" 
                      placeholder="What is on your mind?" 
                      className="w-full border-none outline-none text-sm"
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <span className="text-xs font-bold">B</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <span className="text-xs italic">I</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <span className="text-xs underline">U</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <span className="text-xs line-through">S</span>
                      </Button>
                      <Separator orientation="vertical" className="h-4" />
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <span className="text-xs">📷</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <span className="text-xs">🔗</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <span className="text-xs">&lt;/&gt;</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <span className="text-xs">📎</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <span className="text-xs">📍</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feed Posts */}
              <div className="space-y-4">
                {/* Post 1 */}
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="Nick Logan" />
                    <AvatarFallback>NL</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">Nick Logan</span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      Outlines keep you honest. And keep structure
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>120 comments</span>
                      <span>15 likes</span>
                    </div>
                  </div>
                </div>

                {/* Post 2 */}
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" alt="Carles Nilson" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">Carles Nilson</span>
                      <span className="text-xs text-gray-500">3 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      AEOL meeting
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>45 comments</span>
                      <span>8 likes</span>
                    </div>
                  </div>
                </div>

                {/* Post 3 */}
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" alt="Alice Danchik" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">Alice Danchik</span>
                      <span className="text-xs text-gray-500">5 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      Make deposit USD 700. to ESL
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>23 comments</span>
                      <span>12 likes</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                More Feeds
              </Button>
            </CardContent>
          </Card>

          {/* Recent Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Statistics</CardTitle>
              <CardDescription>More than 400 new members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Chart visualization for Recent Statistics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities */}
          <Card data-section="activities">
            <CardHeader>
              <CardTitle>Activities</CardTitle>
              <CardDescription>890,344 Sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">08:42 Outlines keep you honest. And keep structure</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">10:00 AEOL meeting</p>
                    <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">14:37 Make deposit USD 700. to ESL</p>
                    <p className="text-xs text-gray-500 mt-1">6 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">16:50 Indulging in poorly driving and keep structure keep great</p>
                    <p className="text-xs text-gray-500 mt-1">8 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">21:03 New order placed #XF-2356.</p>
                    <p className="text-xs text-gray-500 mt-1">12 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">10:30 Finance KPI Mobile app launch preparation meeting</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainContent>
    </AdminLayout>
  );
}
