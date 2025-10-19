import { useState } from "react";
import JobCard from "./JobCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import api from "@/axios";  
import {useEffect} from "react";





const JobsListSection = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");
  const [mockJobs,setMockJobs] = useState([]); 

  useEffect(() => {
   const fetchJobs = async () => {
     try {
       const token = localStorage.getItem("token");
       const response = await api.get("/job/serchjob",{
         headers: {
           Authorization: `Bearer ${token}`,
         },
         
       });

       console.log("Jobs fetched:", response.data);
       
       setMockJobs(response.data);
     } catch (error: any) {
       console.error("Error fetching jobs:", error.response?.data || error.message);
     }
    }
    fetchJobs();
  }, []);

  const filteredJobs = mockJobs.filter((job) => {
    if (categoryFilter !== "all" && job.category !== categoryFilter) return false;
    if (locationFilter !== "all" && job.location !== locationFilter) return false;
    if (experienceFilter !== "all" && job.experience !== experienceFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Management">Management</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label htmlFor="location">Location</Label>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger id="location">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="San Francisco">San Francisco</SelectItem>
              <SelectItem value="New York">New York</SelectItem>
              <SelectItem value="Los Angeles">Los Angeles</SelectItem>
              <SelectItem value="Seattle">Seattle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label htmlFor="experience">Experience Level</Label>
          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger id="experience">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Junior">Junior</SelectItem>
              <SelectItem value="Mid-level">Mid-level</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">All Available Jobs ({filteredJobs.length})</h2>
        {filteredJobs.map((job) => (
          <JobCard key={job.jobId} job={job} showApplyButton={true} showBookmark={true} />
        ))}
      </div>
    </div>
  );
};

export default JobsListSection;
