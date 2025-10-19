import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, MapPin, Calendar, DollarSign, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/axios";

interface JobDetailsResponseDto {
  id: string;
  title: string;
  companyName: string;
  city: string;
  salary: string;
  experience: string;
  createdByName: string;
  createdAt: string;
  category: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  status: string;
}

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const {companyName} = useParams<{ companyName: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [job, setJob] = useState<JobDetailsResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Job ID:", id);

  useEffect(() => {
    const fetchJobDetails = async () => {
      console.log("Fetching job details for jobId:", id);
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          return;
        }

        const response = await api.get(`/job/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Job Details Response:", response.data);
        setJob(response.data);
      } catch (err: any) {
        console.error("Error fetching job details:", err);
        setError(err.response?.data?.message || "Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJobDetails();
  }, []);

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "Error", description: "Please log in first." });
        return;
      }

      await api.post(
        `/application/candidate/apply/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Application Submitted!",
        description: `Your application for ${job?.title} has been submitted successfully.`,
      });
    } catch (err: any) {
      toast({
        title: "Error Applying",
        description: err.response?.data?.message || "Something went wrong.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Loading job details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-red-500">{error || "Job not found"}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-3xl">{job.title}</CardTitle>
                  <div className="flex flex-wrap gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{companyName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    job.status === "Active" ? "default" : "secondary"
                  }
                >
                  {job.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{job.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium"> Experience:{job.experience} Year</span>
                </div>
                {/* <Badge variant="outline">{job.category}</Badge> */}
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Created By:{job.createdByName  }</span>
                </div>
              </div>

             <section className="space-y-2">
                <h4 className="text-xl font-semibold">Skills Required</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-primary text-primary-foreground px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
              <section className="space-y-2">
                <h3 className="text-xl font-semibold">About the Role</h3>
                <p className="text-muted-foreground">{job.description}</p>
              </section>

              {/* <section className="space-y-2">
                <h3 className="text-xl font-semibold">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {job.responsibilities?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section> */}

              {/* <section className="space-y-2">
                <h3 className="text-xl font-semibold">Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {job.requirements?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section> */}

              {/* <section className="space-y-2">
                <h3 className="text-xl font-semibold">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section> */}

              {job.status === "Active" && (
                <Button onClick={handleApply} className="w-full md:w-auto">
                  Apply Now
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetails;









