import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-background to-primary/5">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Modern HR Solutions</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
            Transform Your HR with{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              KurtHR
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Streamline hiring, empower your team, and build a workplace culture that drives success.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" variant="hero" className="group">
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 hover:border-primary">
              Learn More
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="pt-12 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Trusted by forward-thinking companies</p>
            <div className="flex gap-8 items-center opacity-60">
              <div className="text-xl font-semibold text-foreground">500+</div>
              <div className="h-8 w-px bg-border" />
              <div className="text-xl font-semibold text-foreground">50k+</div>
              <div className="h-8 w-px bg-border" />
              <div className="text-xl font-semibold text-foreground">98%</div>
            </div>
            <div className="flex gap-8 items-center text-xs text-muted-foreground">
              <span>Companies</span>
              <span>Employees</span>
              <span>Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
