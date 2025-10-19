import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Bookmark, Eye } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import api from "@/axios";

interface Job {
  jobId: number;
  title: string;
  company: string;
  location: string;
  dateTime: string;
  description: string;
  category?: string;
  experience?: string;
}

interface JobCardProps {
  job: Job;
  showApplyButton?: boolean;
  showBookmark?: boolean;
}

const JobCard = ({
  job,
  showApplyButton = false,
  showBookmark = false,
}: JobCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // ✅ Apply Handler with API Integration
  const handleApply = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for this job.",
        variant: "destructive",
      });
      return;
    }
    if(localStorage.getItem("profileUpdate")==="0"){
      toast({
        title: "Profile Update Required",
        description: "Please update your profile to apply for this job.",
        variant: "destructive",
      });
      return;
    }

    const payLoad = {
      jobId: job.jobId,
      coverLetter: "",
    };

    try {
      setIsApplying(true);

      const response = await api.post(`/application/create`, payLoad, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Application Response:", response.data);

      toast({
        title: "Application Submitted ✅",
        description: `You have successfully applied for ${job.title} at ${job.company}`,
      });
    } catch (error: any) {
      const err=console.error("Application Error:", error.response?.data || error.message);
      toast({
        title: "Application Failed ❌",
        description:
          error.response?.data?.message ||
          err,
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  // ✅ Bookmark Handler
  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: `${job.title} at ${job.company}`,
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold">{job.title}</CardTitle>
            <CardDescription className="text-base mt-1">
              {job.company}
            </CardDescription>
          </div>

          {showBookmark && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className={isBookmarked ? "text-primary" : ""}
            >
              <Bookmark
                className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
              />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Description */}
          <p className="text-sm text-muted-foreground">{job.company}</p>

          {/* Job Info */}
          <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Posted {new Date(job.dateTime).toLocaleDateString("en-GB")}</span>
            </div>
          </div>

          {/* Tags */}
          {(job.category || job.experience) && (
            <div className="flex gap-2">
              {job.category && <Badge variant="secondary">{job.category}</Badge>}
              {job.experience && (
                <Badge variant="outline">{job.experience}</Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link to={`/job/${job.jobId}/${job.company}`}>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </Link>

            {showApplyButton && (
              <Button onClick={handleApply} disabled={isApplying}>
                {isApplying ? "Applying..." : "Apply Now"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;


