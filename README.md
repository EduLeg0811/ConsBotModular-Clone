# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/58fcff98-10c2-4576-9ea3-da6e70bfd865

## How can I edit this code?

## Configuração da API Key OpenAI

Para usar os módulos de IA, você precisa configurar sua chave da OpenAI:

1. **Crie um arquivo `.env` na raiz do projeto**
2. **Adicione sua chave da OpenAI:**
   ```
   VITE_OPENAI_API_KEY=sua_chave_aqui
   ```
3. **Reinicie o servidor de desenvolvimento**

**Importante:** 
- O arquivo `.env` já está no `.gitignore` para proteger sua chave
- Use o arquivo `.env.example` como modelo
- Nunca compartilhe sua chave da OpenAI publicamente

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/58fcff98-10c2-4576-9ea3-da6e70bfd865) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/58fcff98-10c2-4576-9ea3-da6e70bfd865) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)




New Folder Structure:

src/modules/
├── shared/
│   ├── types.ts                    # Common types and interfaces
│   ├── hooks/
│   │   └── useModuleSettings.ts    # Shared settings management hook
│   └── components/
│       └── SettingsDialog.tsx      # Reusable settings dialog
├── chatbot/
│   ├── index.ts                    # Module exports
│   ├── config.ts                   # Module configuration
│   └── ChatbotModule.tsx          # Main component
├── bibliomancia/
│   ├── index.ts                    # Module exports
│   ├── config.ts                   # Module configuration
│   └── BibliomanciaModule.tsx     # Main component
└── index.ts                       # Central module registry
Key Improvements:
1. Modular Architecture
Each module is now self-contained in its own folder
Clear separation of concerns with dedicated config files
Consistent structure across all modules
2. Shared Components & Logic
SettingsDialog component is now reusable across modules
useModuleSettings hook handles settings persistence for any module
Common types defined in shared/types.ts
3. Central Module Registry
src/modules/index.ts acts as a central registry
Easy to add new modules by just adding them to the registry
Helper functions for module management
4. Better Type Safety
ModuleConfig interface ensures consistent module structure
ModuleProps interface standardizes component props
OpenAISettings interface for consistent settings management
5. Improved Settings Management
Settings are now persisted per module in localStorage
Temperature and token limits are configurable
Consistent settings UI across all modules
Benefits:
Easier to Understand: Each module is clearly separated and self-contained
Easier to Maintain: Changes to one module don't affect others
Easier to Extend: Adding new modules follows a clear pattern
Better Code Reuse: Shared components and hooks reduce duplication
Type Safety: Strong typing ensures consistency across modules
Adding New Modules:
To add a new module, simply:

Create a new folder in src/modules/
Add the module component, config, and index files
Register it in src/modules/index.ts
The modular structure makes your codebase much more maintainable and easier to understand!