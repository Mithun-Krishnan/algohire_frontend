import { Brain, Zap, Shield, BarChart3, Users, Rocket } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Advanced algorithms match candidates with jobs based on skills, experience, and preferences."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Reduce hiring time by 70% with automated screening and instant candidate recommendations."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade security with JWT authentication and encrypted data storage."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track hiring metrics, candidate pipelines, and recruitment performance in real-time."
  },
  {
    icon: Users,
    title: "Smart Profiles",
    description: "Rich candidate profiles with skill tagging, resume parsing, and experience validation."
  },
  {
    icon: Rocket,
    title: "Scalable Platform",
    description: "Built to handle millions of users with microservice architecture and cloud infrastructure."
  }
];

const Features = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Hire Better
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to streamline your hiring process and connect the right people with the right opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-2xl shadow-card hover:shadow-glow transition-smooth group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary mb-4 group-hover:scale-110 transition-smooth">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
