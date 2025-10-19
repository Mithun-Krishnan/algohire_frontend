import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import api from "@/axios";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Email validation
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Password validation: at least 1 uppercase, 1 lowercase, 1 number, 1 special character, min 8 chars
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData({ ...formData, [id]: value });

    if (id === "email") {
      if (!validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    if (id === "password") {
      if (!validatePassword(value)) {
        setErrors((prev) => ({
          ...prev,
          password:
            "Password must be at least 8 characters, include uppercase, lowercase, number & special character",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if errors exist
    if (errors.email || errors.password || !formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await api.post("/auth/v1/login", formData);
      const userType = response.data.role;
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("name", response.data.name);

      if (userType === "ROLE_CANDIDATE") navigate("/dashboard");
      else if (userType === "ROLE_RECRUITER") navigate("/recruiter-dashboard");
      else navigate("/login");
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      console.error("Login error:", error.response?.data || error.message);
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
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
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
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-white hover:opacity-90 transition-smooth"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;









// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft } from "lucide-react";
// import api from "@/axios";
// import { toast } from "@/hooks/use-toast";
// import { Eye, EyeOff } from "lucide-react";


// const Login = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
  
  

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const response = await api.post("/auth/v1/login", formData);
//      const userType = response.data.role;
//       console.log("Login successful:", response.data);
//       localStorage.setItem("token", response.data.accessToken);
//       localStorage.setItem("name", response.data.name);

//         if (userType === "ROLE_CANDIDATE") {
//       navigate("/dashboard");
//     } else if (userType === "ROLE_RECRUITER") {
//       navigate("/recruiter-dashboard");
//     } else {
//       navigate("/login");
//     }

//     }
//     catch (error: any) {
//       toast({
//         title: "Login Error",
//         description: "Please check your credentials and try again.",
        
//         variant: "destructive",
//       });
//       console.error("Login error:", error.response?.data || error.message);
      
//     }
//     // TODO: Implement authentication
//     console.log("Login:", formData);
    
//   };

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
//             <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
//             <CardDescription>
//               Sign in to your account to continue
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="name@example.com"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="password">Password</Label>
//                   <Link to="/forgot-password" className="text-sm text-primary hover:underline">
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     value={formData.password}
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     required
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>
//               <Button type="submit" className="w-full gradient-primary text-white hover:opacity-90 transition-smooth">
//                 Sign In
//               </Button>
//             </form>

//             <div className="mt-6 text-center text-sm">
//               <span className="text-muted-foreground">Don't have an account? </span>
//               <Link to="/signup" className="text-primary hover:underline font-medium">
//                 Sign up
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Login;
