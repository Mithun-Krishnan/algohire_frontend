import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Briefcase, User } from "lucide-react";
import CompanyAutocomplete from "@/components/CompanyAutocomplete";
import api from "@/axios";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"jobseeker" | "recruiter">("jobseeker");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
  });

  // Validation functions
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

  const handleChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });

    // Validation
    switch (id) {
      case "email":
      case "recruiter-email":
        setErrors((prev) => ({
          ...prev,
          email: !validateEmail(value) ? "Invalid email format" : "",
        }));
        break;
      case "password":
      case "recruiter-password":
        setErrors((prev) => ({
          ...prev,
          password:
            !validatePassword(value)
              ? "Password must be 8+ chars, include uppercase, lowercase, number & special char"
              : "",
        }));
        break;
      case "phone":
        setErrors((prev) => ({
          ...prev,
          phone: !validatePhone(value) ? "Phone must be 10 digits" : "",
        }));
        break;
      case "company":
        if (userType === "recruiter") {
          setErrors((prev) => ({
            ...prev,
            company: !value ? "Please select a company" : "",
          }));
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if any validation errors exist
    const hasErrors = Object.values(errors).some((err) => err) ||
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      (userType === "recruiter" && !formData.company);

    if (hasErrors) {
      // alert("Please fix the errors before submitting");
       toast({
              title: "Login Error",
              description: "Please check your credentials and try again.",
              variant: "destructive",
            });
      return;
    }

    try {
      const endpoint =
        userType === "jobseeker"
          ? "/auth/v1/candidate/register"
          : "/auth/v1/recruiter/registerExistingcompany";

      const payload =
        userType === "jobseeker"
          ? {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
            }
          : {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              company: formData.company,
              password: formData.password,
            };

      const response = await api.post(endpoint, payload);
      console.log("Signup successful:", response.data);

      navigate("/login");
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <Card className="glass-card shadow-glow">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg gradient-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Algohire
              </span>
            </div>
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Join thousands finding their perfect match</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={userType}
              onValueChange={(v) => setUserType(v as "jobseeker" | "recruiter")}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="jobseeker" className="space-x-2">
                  <User className="h-4 w-4" />
                  <span>Job Seeker</span>
                </TabsTrigger>
                <TabsTrigger value="recruiter" className="space-x-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Recruiter</span>
                </TabsTrigger>
              </TabsList>

              {/* Job Seeker Form */}
              <TabsContent value="jobseeker" className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9967839392"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                  <Button
                    type="submit"
                    className="w-full gradient-primary text-white hover:opacity-90 transition-smooth"
                  >
                    Create Job Seeker Account
                  </Button>
                </form>
              </TabsContent>

              {/* Recruiter Form */}
              <TabsContent value="recruiter" className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recruiter-name">Full Name</Label>
                    <Input
                      id="recruiter-name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <CompanyAutocomplete
                      onSelect={(company) => handleChange("company", company.id)}
                    />
                    {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9967839392"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recruiter-email">Email</Label>
                    <Input
                      id="recruiter-email"
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="recruiter-password">Password</Label>
                    <Input
                      id="recruiter-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                  <Button
                    type="submit"
                    className="w-full gradient-primary text-white hover:opacity-90 transition-smooth"
                  >
                    Create Recruiter Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;













// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ArrowLeft, Briefcase, Phone, User } from "lucide-react";
// import CompanyAutocomplete from "@/components/CompanyAutocomplete";
// import api from "@/axios";
// import { Eye, EyeOff } from "lucide-react";


// const Signup = () => {
//   const navigate = useNavigate();
//   const [userType, setUserType] = useState<"jobseeker" | "recruiter">("jobseeker");
//   const [showPassword, setShowPassword] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     company: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try{
//       const endpoint=userType === "jobseeker" ? "/auth/v1/candidate/register" : "auth/v1/recruiter/registerExistingcompany";

//       const payload=userType==="jobseeker"?{
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//       }:
//       {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         company: formData.company,
//         password: formData.password,
//       };
//        const response = await api.post(endpoint, payload);
//        console.log("Signup successful:", response.data);

//     // redirect to login page after successful signup
//     navigate("/login");
//   } 
//   catch (error: any) {
//     console.error("Signup error:", error.response?.data || error.message);
//     alert(error.response?.data?.message || "Signup failed");
//   }
// };

// console.log("company id", formData.company);
// console.log("user type", userType);
    
//   return (
//     <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
//       <div className="w-full max-w-md animate-fade-in">
//         <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to home
//         </Link>

//         <Card className="glass-card shadow-glow">
//           <CardHeader className="space-y-1">
//             <div className="flex items-center space-x-2 mb-4">
//               <div className="h-8 w-8 rounded-lg gradient-primary" />
//               <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
//                 Algohire
//               </span>
//             </div>
//             <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
//             <CardDescription>
//               Join thousands finding their perfect match
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Tabs value={userType} onValueChange={(v) => setUserType(v as "jobseeker" | "recruiter")} className="mb-6">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="jobseeker" className="space-x-2">
//                   <User className="h-4 w-4" />
//                   <span>Job Seeker</span>
//                 </TabsTrigger>
//                 <TabsTrigger value="recruiter" className="space-x-2">
//                   <Briefcase className="h-4 w-4" />
//                   <span>Recruiter</span>
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="jobseeker" className="mt-6">
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Full Name</Label>
//                     <Input
//                       id="name"
//                       placeholder="John Doe"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="name@example.com"
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="phone">Phone</Label>
//                     <Input
//                       id="phone"
//                       type="tel"
//                       placeholder="9967839392"
//                       value={formData.phone}
//                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                       required
//                     />
//                   </div>
//                  <div className="relative">
//   <Input
//     id="password"
//     type={showPassword ? "text" : "password"}
//     value={formData.password}
//     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//     required
//   />
//   <button
//     type="button"
//     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
//     onClick={() => setShowPassword(!showPassword)}
//   >
//     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//   </button>
// </div>
//                   <Button type="submit" className="w-full gradient-primary text-white hover:opacity-90 transition-smooth">
//                     Create Job Seeker Account
//                   </Button>
//                 </form>
//               </TabsContent>

//               <TabsContent value="recruiter" className="mt-6">
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="recruiter-name">Full Name</Label>
//                     <Input
//                       id="recruiter-name"
//                       placeholder="John Doe"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="company">Company Name</Label>
//                     <CompanyAutocomplete
//                       onSelect={(company) =>
//                         setFormData({ ...formData, company: company.id })
//                       }
//                     />
//                   </div>
//                    <div className="space-y-2">
//                     <Label htmlFor="phone">Phone</Label>
//                     <Input
//                       id="phone"
//                       type="tel"
//                       placeholder="9967839392"
//                       value={formData.phone}
//                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="recruiter-email">Email</Label>
//                     <Input
//                       id="recruiter-email"
//                       type="email"
//                       placeholder="name@company.com"
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="recruiter-password">Password</Label>
//                     <Input
//                       id="recruiter-password"
//                       type="password"
//                       value={formData.password}
//                       onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                       required
//                     />
//                   </div>
//                   <Button type="submit" className="w-full gradient-primary text-white hover:opacity-90 transition-smooth">
//                     Create Recruiter Account
//                   </Button>
//                 </form>
//               </TabsContent>
//             </Tabs>

//             <div className="mt-6 text-center text-sm">
//               <span className="text-muted-foreground">Already have an account? </span>
//               <Link to="/login" className="text-primary hover:underline font-medium">
//                 Sign in
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Signup;
