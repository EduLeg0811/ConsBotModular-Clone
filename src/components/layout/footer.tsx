import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, ExternalLink, BookOpen, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">AI Assistant Hub</h3>
            <p className="text-sm text-muted-foreground">
              A unified platform for AI-powered tools and modules, designed for modern workflows.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-medium">Quick Links</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="h-auto p-0 justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Documentation
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-0 justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                API Reference
              </Button>
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-3">
            <h4 className="font-medium">Modules</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="h-auto p-0 justify-start text-muted-foreground">
                AI Chatbot
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-0 justify-start text-muted-foreground">
                Bibliomancia
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-0 justify-start text-muted-foreground">
                Coming Soon...
              </Button>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-medium">Connect</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="h-auto p-0 justify-start">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-0 justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 AI Assistant Hub. Built with modern web technologies.
          </p>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Powered by</span>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-primary font-medium">
              OpenAI
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}