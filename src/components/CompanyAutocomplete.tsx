import { useState, useEffect, useRef } from "react";
import api from "@/axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CompanyAutocompleteProps {
  onSelect: (company: any) => void;
}

function CompanyAutocomplete({ onSelect }: CompanyAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    companyEmail: "",
    about: "",
    website: "",
  });

  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if ((query ?? "").trim().length > 0) {
        try {
          const response = await api.get(`/api/company/search/${query}`);
          setCompanies(response.data || []);
        } catch (error: any) {
          console.error("Error fetching companies:", error.message);
        }
      } else {
        setCompanies([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (company: any) => {
    setQuery(company.name ?? "");
    setCompanies([]);
    setShowCreateForm(false);
    onSelect(company);
  };

  const handleCompanyFormChange = (field: string, value: string) => {
    setCompanyForm({ ...companyForm, [field]: value });
  };

  const handleCreateCompany = async () => {
    const payload = {
      name: companyForm.companyName,
      email: companyForm.companyEmail,
      about: companyForm.about,
      website: companyForm.website,
      address: "N/A",
      phone: "N/A",
      logoUrl: "",
      companySize: "",
    };

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/users/addCompany", payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      onSelect(response.data);
      setShowCreateForm(false);
      setQuery(response.data.companyName ?? "");
      setCompanies([]);
    } catch (error: any) {
      console.error("Error creating company:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create company");
    }
  };

  return (
    <div className="relative w-full space-y-2">
      <Input
        value={query ?? ""}
        onChange={(e) => {
          setQuery(e.target.value ?? "");
          setShowCreateForm(false);
        }}
        placeholder="Search company"
      />

      {companies.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute top-full left-0 w-full max-h-40 overflow-auto rounded-lg shadow-glow bg-secondary border border-secondary z-20 mt-1 box-border"
        >
          {companies.map((c) => (
            <li
              key={c.id}
              onClick={() => handleSelect(c)}
              className="p-2 cursor-pointer text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {c.name}
            </li>
          ))}
        </ul>
      )}

      {!showCreateForm && (
        <motion.p
          onClick={() => setShowCreateForm(true)}
          className="mt-2 text-sm text-primary cursor-pointer hover:underline text-right"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          Create a company?
        </motion.p>
      )}

      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            className="space-y-3 mt-2 p-4 rounded-lg shadow-glow bg-secondary border border-secondary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
          >
            <Input
              placeholder="Company Name"
              value={companyForm.companyName}
              onChange={(e) => handleCompanyFormChange("companyName", e.target.value)}
              required
            />
            <Input
              placeholder="Company Email"
              type="email"
              value={companyForm.companyEmail}
              onChange={(e) => handleCompanyFormChange("companyEmail", e.target.value)}
              required
            />
            <Input
              placeholder="About"
              value={companyForm.about}
              onChange={(e) => handleCompanyFormChange("about", e.target.value)}
            />
            <Input
              placeholder="Website"
              value={companyForm.website}
              onChange={(e) => handleCompanyFormChange("website", e.target.value)}
            />
            <Button
              type="button"
              onClick={handleCreateCompany}
              className="w-full gradient-primary text-white hover:opacity-90 transition-smooth"
            >
              Create Company
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CompanyAutocomplete;














// import { useState, useEffect, useRef } from "react";
// import api from "@/axios";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { motion, AnimatePresence } from "framer-motion";

// interface CompanyAutocompleteProps {
//   onSelect: (company: any) => void;
// }

// function CompanyAutocomplete({ onSelect }: CompanyAutocompleteProps) {
//   const [query, setQuery] = useState("");
//   const [companies, setCompanies] = useState<any[]>([]);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [companyForm, setCompanyForm] = useState({
//     companyName: "",
//     companyEmail: "",
//     about: "",
//     website: "",
//   });

//   const dropdownRef = useRef<HTMLUListElement>(null);

//   // Fetch companies based on query
//   useEffect(() => {
//     const timer = setTimeout(async () => {
//       if (query.trim().length > 0) {
//         try {
//           const response = await api.get(`/api/company/search/${query}`);
//           setCompanies(response.data || []);
//         } catch (error: any) {
//           console.error("Error fetching companies:", error.message);
//         }
//       } else {
//         setCompanies([]);
//       }
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [query]);

//   // Select existing company
//   const handleSelect = (company: any) => {
//     setQuery(company.name);
//     setCompanies([]);
//     setShowCreateForm(false);
//     onSelect(company);
//   };

//   // Handle input changes for new company form
//   const handleCompanyFormChange = (field: string, value: string) => {
//     setCompanyForm({ ...companyForm, [field]: value });
//   };

//   // Submit new company to API
//   const handleCreateCompany = async () => {
//     const payload = {
//       name: companyForm.companyName,
//       email: companyForm.companyEmail,
//       about: companyForm.about,
//       website: companyForm.website,
//       address: "N/A",
//       phone: "N/A",
//       logoUrl: "",
//       companySize: "",
//     };

//     try {
//       const token = localStorage.getItem("token");
//       console.log("token:", token);
//       console.log(payload);

//       const response = await api.post("/api/users/addCompany", payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("Company created:", response.data);
//       onSelect(response.data);
//       setShowCreateForm(false);
//       setQuery(response.data.companyName);
//       setCompanies([]);
//     } catch (error: any) {
//       console.error("Error creating company:", error.response?.data || error.message);
//       alert(error.response?.data?.message || "Failed to create company");
//     }
//   };

//   return (
//     <div className="relative w-full space-y-2">
//       <Input
//         value={query}
//         onChange={(e) => {
//           setQuery(e.target.value);
//           setShowCreateForm(false);
//         }}
//         placeholder="Search company"
//       />

//       {/* Dropdown of existing companies */}
//       {companies.length > 0 && (
//         <ul
//           ref={dropdownRef}
//           className="absolute top-full left-0 w-full max-h-40 overflow-auto rounded-lg shadow-glow bg-secondary border border-secondary z-20 mt-1 box-border"
//         >
//           {companies.map((c) => (
//             <li
//               key={c.id}
//               onClick={() => handleSelect(c)}
//               className="p-2 cursor-pointer text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
//             >
//               {c.name}
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Text link to create a new company */}
//       {!showCreateForm && (
//         <framerMotion.motion.p
//           onClick={() => setShowCreateForm(true)}
//           className="mt-2 text-sm text-primary cursor-pointer hover:underline text-right"
//           initial={{ opacity: 0, y: 5 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.25 }}
//         >
//           Create a company?
//         </framerMotion.motion.p>
//       )}

//       {/* Create Company form */}
//       <farmerMotion.AnimatePresence>
//         {showCreateForm && (
//           <framerMotion.motion.div
//             className="space-y-3 mt-2 p-4 rounded-lg shadow-glow bg-secondary border border-secondary"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 10 }}
//             transition={{ duration: 0.25 }}
//           >
//             <Input
//               placeholder="Company Name"
//               value={companyForm.companyName}
//               onChange={(e) => handleCompanyFormChange("companyName", e.target.value)}
//               required
//             />
//             <Input
//               placeholder="Company Email"
//               type="email"
//               value={companyForm.companyEmail}
//               onChange={(e) => handleCompanyFormChange("companyEmail", e.target.value)}
//               required
//             />
//             <Input
//               placeholder="About"
//               value={companyForm.about}
//               onChange={(e) => handleCompanyFormChange("about", e.target.value)}
//             />
//             <Input
//               placeholder="Website"
//               value={companyForm.website}
//               onChange={(e) => handleCompanyFormChange("website", e.target.value)}
//             />

//             <Button
//               type="button"
//               onClick={handleCreateCompany}
//               className="w-full gradient-primary text-white hover:opacity-90 transition-smooth"
//             >
//               Create Company
//             </Button>
//           </framerMotion.motion.div>
//         )}
//       </framerMotion.AnimatePresence>
//     </div>
//   );
// }

// export default CompanyAutocomplete;














// import { useState, useEffect, useRef } from "react";
// import api from "@/axios";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";

// interface CompanyAutocompleteProps {
//   onSelect: (company: any) => void; // propagate selected or newly created company to parent
// }

// function CompanyAutocomplete({ onSelect }: CompanyAutocompleteProps) {
//   const [query, setQuery] = useState("");
//   const [companies, setCompanies] = useState<any[]>([]);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [companyForm, setCompanyForm] = useState({
//     companyName: "",
//     companyEmail: "",
//     about: "",
//     website: "",
//   });

//   const dropdownRef = useRef<HTMLUListElement>(null);

//   // Fetch companies based on query
//   useEffect(() => {
//     const timer = setTimeout(async () => {
//       if (query.trim().length > 0) {
//         try {
//           const response = await api.get(`/api/company/search/${query}`);
//           setCompanies(response.data || []);
//         } catch (error: any) {
//           console.error("Error fetching companies:", error.message);
//         }
//       } else {
//         setCompanies([]);
//       }
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [query]);

//   // Select existing company
//   const handleSelect = (company: any) => {
//     setQuery(company.name);
//     setCompanies([]);
//     setShowCreateForm(false);
//     onSelect(company);
//   };

//   // Handle input changes for new company form
//   const handleCompanyFormChange = (field: string, value: string) => {
//     setCompanyForm({ ...companyForm, [field]: value });
//   };

//   // Submit new company to API



//   const handleCreateCompany = async () => {


//       const payload = {
//   name: companyForm.companyName,
//   email: companyForm.companyEmail,
//   about: companyForm.about,
//   website: companyForm.website,
//   address:"N/A",
//   phone: "N/A",
//   logoUrl:  "",
//   companySize: "",
// };
//     try {
//       const token = localStorage.getItem("token");
//       console.log("token:", token);

//       console.log(payload);
//       const response = await api.post("/api/users/addCompany", payload,{
//         headers: {
//           Authorization: `Bearer ${token}`,
//            "Content-Type": "application/json"
//         },
//       });
//       console.log("Company created:", response.data);
//       onSelect(response.data); // propagate newly created company
//       setShowCreateForm(false);
//       setQuery(response.data.companyName);
//       setCompanies([]);
//     } catch (error: any) {
//       console.error("Error creating company:", error.response?.data || error.message);
//       alert(error.response?.data?.message || "Failed to create company");
//     }
//   };

//   return (
//     <div className="relative w-full space-y-2">
//       <Input
//         value={query}
//         onChange={(e) => {
//           setQuery(e.target.value);
//           setShowCreateForm(false);
//         }}
//         placeholder="Search company"
//       />

//       {/* Dropdown of existing companies */}
//       {companies.length > 0 && (
//         <ul className="absolute top-full left-0 w-full max-h-40 overflow-auto rounded-lg shadow-glow bg-secondary border border-secondary z-20 mt-1 box-border">
//           {companies.map((c) => (
//             <li
//               key={c.id}
//               onClick={() => handleSelect(c)}
//               className="p-2 cursor-pointer text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
//             >
//               {c.name}
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Show Create Company button if no results */}
//       {companies.length === 0 && (query || "").trim().length > 0 && !showCreateForm && (
//         <Button
//           type="button"
//           onClick={() => setShowCreateForm(true)}
//           className="mt-1 w-full gradient-primary text-white hover:opacity-90 transition-smooth"
//         >
//           Create Company
//         </Button>
//       )}

//       {/* Create Company form */}
//       {showCreateForm && (
//         <div className="space-y-3 mt-2 p-4 rounded-lg shadow-glow bg-secondary border border-secondary">
//           <Input
//             placeholder="Company Name"
//             value={companyForm.companyName}
//             onChange={(e) => handleCompanyFormChange("companyName", e.target.value)}
//             required
//           />
//           <Input
//             placeholder="Company Email"
//             type="email"
//             value={companyForm.companyEmail}
//             onChange={(e) => handleCompanyFormChange("companyEmail", e.target.value)}
//             required
//           />
//           <Input
//             placeholder="About"
//             value={companyForm.about}
//             onChange={(e) => handleCompanyFormChange("about", e.target.value)}
//           />
//           <Input
//             placeholder="Website"
//             value={companyForm.website}
//             onChange={(e) => handleCompanyFormChange("website", e.target.value)}
//           />

//           <Button
//             type="button"
//             onClick={handleCreateCompany}
//             className="w-full gradient-primary text-white hover:opacity-90 transition-smooth"
//           >
//             Create Company
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CompanyAutocomplete;










// import { useState, useEffect, useRef } from "react";
// import api from "@/axios";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";

// interface CompanyAutocompleteProps {
//   onSelect: (company: any) => void;
//   setNewCompanyData: (data: {
//     companyName: string;
//     companyEmail: string;
//     about: string;
//     website: string;
//   }) => void;
// }

// function CompanyAutocomplete({ onSelect, setNewCompanyData }: CompanyAutocompleteProps) {
//   const [query, setQuery] = useState("");
//   const [companies, setCompanies] = useState<any[]>([]);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [companyForm, setCompanyForm] = useState({
//     companyName: "",
//     companyEmail: "",
//     about: "",
//     website: "",
//   });

//   const dropdownRef = useRef<HTMLUListElement>(null);

//   useEffect(() => {
//     const timer = setTimeout(async () => {
//       if (query.trim().length > 0) {
//         try {
//           const response = await api.get(`/api/company/search/${query}`);
//           setCompanies(response.data || []);
//         } catch (error: any) {
//           console.error("Error fetching companies:", error.message);
//         }
//       } else {
//         setCompanies([]);
//       }
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [query]);

//   const handleSelect = (company: any) => {
//     setQuery(company.name);
//     setCompanies([]);
//     setShowCreateForm(false);
//     onSelect(company);
//   };

//   const handleCompanyFormChange = (field: string, value: string) => {
//     setCompanyForm({ ...companyForm, [field]: value });
//     setNewCompanyData({ ...companyForm, [field]: value }); // propagate to parent
//   };

//   return (
//     <div className="relative w-full space-y-2">
//       <Input
//         value={query}
//         onChange={(e) => {
//           setQuery(e.target.value);
//           setShowCreateForm(false);
//         }}
//         placeholder="Search company"
//       />

//       {/* Dropdown of existing companies */}
//       {companies.length > 0 && (
//         <ul className="absolute top-full left-0 w-full max-h-40 overflow-auto rounded-lg shadow-glow bg-secondary border border-secondary z-20 mt-1 box-border">
//           {companies.map((c) => (
//             <li
//               key={c.id}
//               onClick={() => handleSelect(c)}
//               className="p-2 cursor-pointer text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
//             >
//               {c.name}
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Show Create Company button if no results */}
//       {companies.length === 0 && query.trim().length > 0 && !showCreateForm && (
//         <Button
//           type="button"
//           onClick={() => setShowCreateForm(true)}
//           className="mt-1 w-full gradient-primary text-white hover:opacity-90 transition-smooth"
//         >
//           Create Company
//         </Button>
//       )}

//       {/* Create Company form */}
//       {showCreateForm && (
//         <div className="space-y-3 mt-2 p-4 rounded-lg shadow-glow bg-secondary border border-secondary">
//           <Input
//             placeholder="Company Name"
//             value={companyForm.companyName}
//             onChange={(e) => handleCompanyFormChange("companyName", e.target.value)}
//             required
//           />
//           <Input
//             placeholder="Company Email"
//             type="email"
//             value={companyForm.companyEmail}
//             onChange={(e) => handleCompanyFormChange("companyEmail", e.target.value)}
//             required
//           />
//           <Input
//             placeholder="About"
//             value={companyForm.about}
//             onChange={(e) => handleCompanyFormChange("about", e.target.value)}
//           />
//           <Input
//             placeholder="Website"
//             value={companyForm.website}
//             onChange={(e) => handleCompanyFormChange("website", e.target.value)}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default CompanyAutocomplete;















// import { useState, useEffect, useRef } from "react";
// import api from "@/axios"; // your axios instance
// import { Input } from "./ui/input";

// function CompanyAutocomplete({ onSelect }: { onSelect: (company: any) => void }) {
//   const [query, setQuery] = useState("");
//   const [companies, setCompanies] = useState<any[]>([]);
//   const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
//    const dropdownRef = useRef<HTMLUListElement>(null);

//   useEffect(() => {
//     const timer = setTimeout(async () => {
//       if (query.trim().length > 0) {
//         console.log(`Fetching companies for query: ${query}`);
//         try {
//           const response = await api.get(`/api/company/search/${query}`);
//           setCompanies(response.data || []);
//           console.log("Companies fetched:", response.data);
//         } catch (error: any) {
//           console.error("Error fetching companies:", error.message);
//         }
//       } else {
//         setCompanies([]);
//       }
//     }, 400); // debounce for 400ms

//     return () => clearTimeout(timer);
//   }, [query]);

//   const handleSelect = (company: any) => {
//     setSelectedCompany(company);
//     setQuery(company.name);
//     setCompanies([]);
//     onSelect(company); // send selected company to parent (Signup)
//   };

//   console.log("queries", query);
//   return (
//     <div className="space-y-2">

//      <div className="relative w-full">
//   <Input
//     value={query}
//     onChange={(e) => setQuery(e.target.value)}
//     placeholder="Search company"
//   />

//   {companies.length > 0 && (
//     <ul
//       ref={dropdownRef}
//       className="absolute top-full left-0 w-full max-h-40 overflow-auto rounded-lg shadow-glow bg-secondary border border-secondary z-20 mt-1 box-border"
//     >
//       {companies.map((c) => (
//         <li
//           key={c.id}
//           onClick={() => handleSelect(c)}
//           className="p-2 cursor-pointer text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
//         >
//           {c.name}
//         </li>
//       ))}
//     </ul>
//   )}
// </div>
//     </div>
//   );
// }

// export default CompanyAutocomplete;
