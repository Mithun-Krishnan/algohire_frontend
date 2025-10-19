import { useState, KeyboardEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/axios";

const AddJobForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    city: "",
    skills: [] as string[], // now an array
    experience: "",
    salary: "",
  });

  const [skillInput, setSkillInput] = useState(""); // temporary input for typing skills

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillInput("");
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      experience: formData.experience ? Number(formData.experience) : 0,
      skills: formData.skills, // array of skills
    };

    console.log({payload});

    if (!formData.title || !formData.description || !formData.company || !formData.city) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await api.post("/job/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Success!",
        description: "Job posting created successfully.",
      });

      console.log(response.data);

      // Reset form
      setFormData({
        title: "",
        description: "",
        company: "",
        city: "",
        skills: [],
        experience: "",
        salary: "",
      });
      setSkillInput("");
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Job Posting</CardTitle>
        <CardDescription>Fill in the details to post a new job</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Senior Frontend Developer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="e.g. Tech Corp"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g. San Francisco, CA"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
              <Input
                id="experience"
                placeholder="Experience in Years"
                type="number"
                min={0}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                placeholder="e.g. $80k - $120k"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>

           <div className="space-y-2">
  <Label htmlFor="skills">Skills Required</Label>
  <div className="border p-2 rounded-md flex flex-col gap-2">
    {/* Tags displayed above */}
    <div className="flex flex-wrap gap-2">
      {formData.skills.map((skill) => (
        <span
          key={skill}
          className="bg-primary text-primary-foreground px-2 py-1 rounded-full flex items-center gap-1"
        >
          {skill}
          <button
            type="button"
            className="ml-1 font-bold hover:text-red-500"
            onClick={() => handleRemoveSkill(skill)}
          >
            ×
          </button>
        </span>
      ))}
    </div>
    {/* Input stays full width */}
    <Input
      id="skills"
      placeholder="Type skill and press Enter"
      value={skillInput}
      onChange={(e) => setSkillInput(e.target.value)}
      onKeyDown={handleSkillKeyDown}
      className="w-full border-none shadow-none focus:ring-0"
    />
  </div>
</div>


          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              required
            />
          </div>

          <Button type="submit" className="w-full md:w-auto">
            Post Job
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddJobForm;














