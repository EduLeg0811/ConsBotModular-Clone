import { BookOpen } from "lucide-react";
import { ModuleConfig } from "../shared/types";
import { BibliomanciaModule } from "./BibliomanciaModule";

export const bibliomanciaConfig: ModuleConfig = {
  id: 'bibliomancia',
  title: 'Bibliomancia',
  description: 'Sorteio e análise de pensatas do Léxico de Ortopensatas.',
  icon: BookOpen,
  badge: 'Available',
  component: BibliomanciaModule
};