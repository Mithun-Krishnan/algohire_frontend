import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

import api from "@/axios";
import { toast } from "@/hooks/use-toast";



interface RecruiterStatsResponse {
  jobsPosted: number;
  applications: number;
  shortlisted: number;
}
const RecruiterQuickStats = () => {
   const [stats, setStats] = useState<RecruiterStatsResponse>({
    jobsPosted: 0,
    applications: 0,
    shortlisted: 0,
  });

   useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/users/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
        console.log("Stats fetched:", response.data);
      } catch (error: any) {
        console.error("Error fetching recruiter stats:", error);
        toast({
          title: "Failed to load stats",
          description: "Please try again later.",
        });
      }
    };

    fetchStats();
  }, []);


  const displayStats = [
    {
      title: "Jobs Posted",
      value: stats.jobsPosted,
      icon: Briefcase,
      description: "Total active jobs",
    },
    {
      title: "Applications",
      value: stats.applications,
      icon: Users,
      description: "Total received",
    },
    {
      title: "Shortlisted",
      value: stats.shortlisted,
      icon: CheckCircle,
      description: "Candidates",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {displayStats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecruiterQuickStats;
