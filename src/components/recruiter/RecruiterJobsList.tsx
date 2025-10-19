import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useEffect } from "react";
import api from "@/axios";
import { Navigate } from "react-router-dom";   
import { useNavigate } from "react-router-dom";   




const RecruiterJobsList = () => {

const [mockJobs,setMockJobs] =useState([]);
const navigate = useNavigate();
const handleCLik = (jobId: string) => {
  navigate(`/recruiter-application/${jobId}`);
}

useEffect(() => {
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/job/recruter/jobs",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        
      });

      console.log("Jobs fetched:", response.data);
      
      setMockJobs(response.data);
    } catch (error: any) {
      console.error("Error fetching jobs:", error.response?.data || error.message);
    }

    
  };

  fetchJobs();
},[]);


  function handleEdit(jobId: any): void {
    navigate(`/recruiter-application/${jobId}`);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Jobs You Posted</h2>
      <div className="grid gap-4">
        {mockJobs.map((job) => (
          <Card key={job.jobId}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {job.company} • {job.location}
                  </p>
                </div>
                <Badge variant={job.status === "Active" ? "default" : "secondary"}>
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Posted: {new Date(job.dateTime).toLocaleDateString("en-GB")}
                  </p>
                  <p className="text-sm font-medium">
                     Discription : {job.description.substring(0, 50)} ...
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleCLik(job.jobId)} >
                  
                    <Eye className="mr-2 h-4 w-4" />
                    Applications
                 
                  </Button>
                  {/* <Button variant="outline" size="sm" onClick={()=>handleEdit(job.jobId)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecruiterJobsList;
