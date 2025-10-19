import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";
import { useRef } from "react";
import { useMagneticHover } from "@/hooks/use-magnetic-hover";

const Hero = () => {
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useMagneticHover(card1Ref, 0.15);
  useMagneticHover(card2Ref, 0.15);
  useMagneticHover(card3Ref, 0.15);

  return (
    <section className="relative overflow-hidden gradient-hero py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm animate-fade-in">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span className="text-foreground">Smart Job Matching Platform</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-fade-in-delay">
            Hire Smarter,{" "}
            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              Not Harder
            </span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl animate-fade-in-delay">
            Connect top talent with dream opportunities using algorithmic intelligence. 
            Reduce hiring time by 70% with our smart matching system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-delay">
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-white hover:opacity-90 transition-smooth shadow-glow group">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {/* <Link to="/jobs">
              <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5">
                Browse Jobs
              </Button>
            </Link> */}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in-delay">
            <div ref={card1Ref} className="glass-card p-6 rounded-2xl shadow-card hover:shadow-glow transition-smooth magnetic-hover">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>

            <div ref={card2Ref} className="glass-card p-6 rounded-2xl shadow-card hover:shadow-glow transition-smooth magnetic-hover">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">70%</div>
              <div className="text-sm text-muted-foreground">Faster Hiring</div>
            </div>

            <div ref={card3Ref} className="glass-card p-6 rounded-2xl shadow-card hover:shadow-glow transition-smooth magnetic-hover">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Match Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
    </section>
  );
};

export default Hero;
