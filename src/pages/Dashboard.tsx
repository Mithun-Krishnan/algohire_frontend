import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchSection from "@/components/dashboard/SearchSection";
import ApplicationsSection from "@/components/dashboard/ApplicationsSection";
import JobsListSection from "@/components/dashboard/JobsListSection";
import QuickStats from "@/components/dashboard/QuickStats";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {/* <Button onClick={() => navigate("/edit-profile")} variant="outline">
            <User className="mr-2 h-4 w-4" />
            Edit Profile
          </Button> */}
        </div>

        <QuickStats />

        <Tabs defaultValue="search" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            {/* <TabsTrigger value="jobs">All Jobs</TabsTrigger> */}
            <TabsTrigger value="search">Jobs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>

          {/* <TabsContent value="jobs" className="mt-6">
            <JobsListSection />
          </TabsContent> */}

          <TabsContent value="search" className="mt-6">
            <SearchSection />
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <ApplicationsSection />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
