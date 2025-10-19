import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import api from "@/axios";

// ✅ Schema with preprocess for experience
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  location: z.string().min(2, "Location is required"),
  experience: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().optional()
  ),
  resumeUrl: z.string().optional(),
});

const EditProfile = () => {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const originalProfile = useRef<any>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      skills: [],
      location: "",
      experience: null,
      resumeUrl: "",
    },
  });

  // ✅ Fetch profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/api/users/me/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        console.log("Profile fetched:", data);
        const fetchedSkills = data.skills || [];

        const mappedData = {
          name: data.userName || "",
          email: data.email || "",
          phone: data.phone || "",
          skills: fetchedSkills,
          location: data.location || "",
          experience: data.experince ?? null,
          resumeUrl: data.resumeUrl || "",
        };

        form.reset(mappedData);
        setSkills(fetchedSkills);
        originalProfile.current = mappedData;
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Could not load profile.", variant: "destructive" });
      }
    };

    fetchUserProfile();
  }, []);

  // ✅ Skill handlers
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      form.setValue("skills", updatedSkills);
      setNewSkill("");
      setShowSkillInput(false);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = skills.filter((s) => s !== skill);
    setSkills(updatedSkills);
    form.setValue("skills", updatedSkills);
  };

  // ✅ File handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  // ✅ Compare changed fields
  const getChangedFields = (currentData: any, originalData: any) => {
    const changed: Record<string, any> = {};
    for (const key in currentData) {
      const currVal = currentData[key];
      const origVal = originalData[key];

      if (Array.isArray(currVal) && Array.isArray(origVal)) {
        if (JSON.stringify(currVal) !== JSON.stringify(origVal)) changed[key] = currVal;
      } else if (currVal !== origVal) {
        changed[key] = currVal;
      }
    }
    return changed;
  };

  // ✅ Submit handler
  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    const currentData = { ...data, skills };
    const changedPayload = getChangedFields(currentData, originalProfile.current);

    if (!resumeFile && Object.keys(changedPayload).length === 0) {
      toast({ title: "No Changes", description: "No updates detected in your profile." });
      return;
    }

    try {
      
      
      console.log("Changed Payload:", changedPayload);
      const token = localStorage.getItem("token");
      const update = await api.patch("/api/users/me/profile/update", changedPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(update.data);

      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
      localStorage.setItem("profileUpdate","1");
      console.log(localStorage.getItem("profileUpdate"));

      originalProfile.current = { ...originalProfile.current, ...changedPayload };
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information and resume</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Skills */}
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map((skill, i) => (
                      <div key={i} className="flex items-center bg-muted text-sm px-3 py-1 rounded-full shadow-sm">
                        {skill}
                        <X className="ml-2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-red-500" onClick={() => handleRemoveSkill(skill)} />
                      </div>
                    ))}

                    <Button type="button" size="icon" variant="outline" onClick={() => setShowSkillInput(!showSkillInput)} className="rounded-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {showSkillInput && (
                    <div className="flex gap-2">
                      <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Enter new skill" />
                      <Button type="button" onClick={handleAddSkill}>
                        Add
                      </Button>
                    </div>
                  )}
                </FormItem>

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Experience (Number input) */}
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Resume */}
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume Upload</Label>
                  <div className="flex items-center gap-4">
                    <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="flex-1" />
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {resumeFile && <p className="text-sm text-muted-foreground">Selected: {resumeFile.name}</p>}
                </div>

                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;














