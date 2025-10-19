import { useEffect, useState } from "react";
import ApplicationCard from "./ApplicationCard";
import api from "@/axios";

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  status: "Applied" | "Shortlisted" | "Rejected";
  appliedDate: string;
  location: string;
}

const ApplicationsSection = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const response = await api.get<Application[]>("/application/candidate/view", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("aplication",response.data)

        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          setApplications(response.data);
        } else {
          console.error("Unexpected API response:", response.data);
          setApplications([]);
        }
      } catch (err: any) {
        console.error("Error fetching applications:", err);
        setError(err.response?.data?.message || "Failed to fetch applications");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading applications...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">My Applications ({applications.length})</h2>
      <div className="space-y-4">
        {applications.length === 0 ? (
          <p className="text-sm text-muted-foreground">You have no applications yet.</p>
        ) : (
          applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationsSection;












