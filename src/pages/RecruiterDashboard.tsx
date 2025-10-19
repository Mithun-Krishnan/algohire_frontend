import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import RecruiterQuickStats from "@/components/recruiter/RecruiterQuickStats";
import AddJobForm from "@/components/recruiter/AddJobForm";
import RecruiterJobsList from "@/components/recruiter/RecruiterJobsList";
import RecruiterApplicationsList from "@/components/recruiter/RecruiterApplicationsList";

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          {/* <Button onClick={() => navigate("/edit-profile")} variant="outline">
            <User className="mr-2 h-4 w-4" />
            Edit Profile
          </Button> */}
        </div>

        <RecruiterQuickStats />

        <Tabs defaultValue="jobs" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="add-job">Add Job</TabsTrigger>
            {/* <TabsTrigger value="applications">Applications</TabsTrigger> */}
          </TabsList>

          <TabsContent value="jobs" className="mt-6">
            <RecruiterJobsList />
          </TabsContent>

          <TabsContent value="add-job" className="mt-6">
            <AddJobForm />
          </TabsContent>

          {/* <TabsContent value="applications" className="mt-6">
            <RecruiterApplicationsList />
          </TabsContent> */}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default RecruiterDashboard;
