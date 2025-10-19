import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/axios";

type ApplicationStatus = "APPLIED" | "SHORTLISTED" | "REJECTED" | "INTERVIEWING";

interface Application {
  id: number;
  userName: string;
  userId: string;
  email: string;
  score: number;
  jobName: string;
  appliedAt: string;
  applicationStatus: ApplicationStatus;
  resumeLink: string;
}

const RecruiterApplicationsList = () => {
  const { toast } = useToast();
  const { jobId } = useParams<{ jobId: string }>();
  console.log("jobId", jobId);

  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const token = localStorage.getItem("token");

  console.log("token", token);
  

  useEffect(() => {
    if (!jobId) return;

    const fetchApplications = async () => {
      console.log("Fetching applications for jobId:", jobId);
      try {
        console.log("Fetching applications for jobId:", jobId);
        const response = await api.get<Application[]>(`/application/recruiter/view/${jobId}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data);
        console.log("Applications fetched:", response.data);
      } catch (error: any) {
        console.error("Error fetching applications:", error.response?.data || error.message);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async(applicationId: number, newStatus: ApplicationStatus) => {

    try {

      const payLoad={
        applicationId:applicationId,
        applicationStatus:newStatus
      }

      console.log("payLoad",payLoad);

      const token=localStorage.getItem("token");
      const response = await api.patch(`/application/recruiter/update`,payLoad,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
       setApplications((prev) =>
  prev.map((app) =>
    app.id === applicationId ? { ...app, applicationStatus: newStatus } : app
  )
    );
    toast({
      title: "Status Updated",
      description: "Application status has been updated successfully.",
    });
    } catch (error : any) {
      console.log(error .response?.data || error.message);
    }
   
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      (app.userName??"").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.email??" ").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.applicationStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: ApplicationStatus) => {
    switch (status) {
      case "SHORTLISTED":
      case "INTERVIEWING":
        return "default";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h2 className="text-2xl font-semibold">Applications Received</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
               <SelectItem value="APPLIED">Applied</SelectItem>
                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                <SelectItem value="INTERVIEWING">Interview Scheduled</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

          
        </div>
      </div>

      <div className="grid gap-4">
        {filteredApplications.map((application) => (
          <Card key={application.id}>
         <CardHeader>
  <div className="flex justify-between items-start">
    <div className="space-y-1">
      <CardTitle className="text-lg">{application.userName}</CardTitle>
      <p className="text-sm text-muted-foreground">{application.email}</p>
    </div>
    <div className="flex flex-col items-end">
      <Badge variant={getStatusVariant(application.applicationStatus)}>
        {application.applicationStatus}
      </Badge>
      <p className="text-sm text-muted-foreground mt-1">
        Matching:{((application.score) * 100).toFixed(0)}%
      </p>
    </div>
  </div>
</CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {/* <div>
                    <p className="text-muted-foreground">Applied for:</p>
                    <p className="font-medium">{application.jobName}</p>
                  </div> */}
                  
                  <div>
                    <p className="text-muted-foreground">Applied on:</p>
                    <p className="font-medium">
                      {new Date(application.appliedAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Button variant="outline" size="sm" asChild>
                    <a href={application.resumeLink} target="_blank" rel="noopener noreferrer">
                      <FileText className="mr-2 h-4 w-4" />
                      View Resume
                    </a>
                  </Button>
                  <Select
                    value={application.applicationStatus}
                    onValueChange={(value) =>
                      handleStatusChange(application.id, value as ApplicationStatus)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="APPLIED">Applied</SelectItem>
                        <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                        <SelectItem value="INTERVIEWING">Interview Scheduled</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>



                  <div>
                    <p className="text-muted-foreground">Applied on:</p>
                    <p className="font-medium">
                      {new Date(application.appliedAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>


                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No applications found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecruiterApplicationsList;





