import { useState } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { ModuleCard } from "@/components/ui/module-card";
import { Footer } from "@/components/layout/footer";
import { allModules, getModuleById, isModuleAvailable } from "@/modules";
import { Brain, Palette, Code, Zap } from "lucide-react";

type ActiveModule = 'home' | 'chatbot' | 'bibliomancia' | 'consgpt';

const Index = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');

  const handleModuleClick = (moduleId: string) => {
    if (isModuleAvailable(moduleId)) {
      setActiveModule(moduleId);
    }
  };

  const handleGetStarted = () => {
    // Scroll to modules section
    const modulesSection = document.getElementById('modules');
    if (modulesSection) {
      modulesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render active module if it's not home
  if (activeModule !== 'home') {
    const moduleConfig = getModuleById(activeModule);
    if (moduleConfig) {
      const ModuleComponent = moduleConfig.component;
      return <ModuleComponent onBack={() => setActiveModule('home')} />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <HeroSection onGetStarted={handleGetStarted} />

      {/* Modules Section */}
      <section id="modules" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold">
              Toolbox de IA da Conscienciologia
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Olá conscienciólogo! Escolha o módulo para iniciarmos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up">
            {allModules.map((module) => (
              <ModuleCard
                key={module.id}
                title={module.title}
                description={module.description}
                icon={module.icon}
                badge={module.badge}
                onClick={() => handleModuleClick(module.id)}
                disabled={module.disabled}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-subtle">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-medium">
              Why Choose Our Platform?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-medium">Unified Intelligence</h3>
              <p className="text-muted-foreground">
                All modules share the same powerful AI core, ensuring consistent quality and performance across every tool.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-medium">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Optimized architecture delivers rapid responses and seamless interactions for the best user experience.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-medium">Extensible Design</h3>
              <p className="text-muted-foreground">
                Modular architecture makes it easy to add new capabilities and customize existing tools for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
