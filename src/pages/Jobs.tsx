import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, DollarSign, Clock, Bookmark } from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $180k",
    skills: ["React", "TypeScript", "Tailwind"],
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "DataFlow Inc",
    location: "Remote",
    type: "Full-time",
    salary: "$130k - $190k",
    skills: ["Node.js", "PostgreSQL", "AWS"],
    posted: "1 week ago",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "StartupX",
    location: "New York, NY",
    type: "Full-time",
    salary: "$110k - $160k",
    skills: ["React", "Node.js", "MongoDB"],
    posted: "3 days ago",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudScale",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$140k - $200k",
    skills: ["Kubernetes", "Docker", "AWS"],
    posted: "5 days ago",
  },
];

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="gradient-hero py-16 border-b border-border/40">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in">Find Your Dream Job</h1>
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in-delay">
              Discover opportunities matched to your skills and preferences
            </p>

            <div className="flex flex-col md:flex-row gap-4 max-w-3xl animate-fade-in-delay">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, skills, or companies..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="gradient-primary text-white hover:opacity-90 transition-smooth">
                Search Jobs
              </Button>
            </div>
          </div>
        </div>

        <div className="container py-12">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {jobs.length} jobs
            </p>
          </div>

          <div className="grid gap-6">
            {jobs.map((job, index) => (
              <Card
                key={job.id}
                className="glass-card shadow-card hover:shadow-glow transition-smooth cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="text-base">{job.company}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4" />
                        {job.salary}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                      <span className="text-sm text-muted-foreground">{job.posted}</span>
                      <Button className="gradient-primary text-white hover:opacity-90 transition-smooth">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;
