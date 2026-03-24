# <p align="center">LUME</p>

<p align="center">
  <strong>O Construtor de Currículos de Próxima Geração: Performance, ATS e Design Premium.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.1-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk" alt="Clerk" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Vitest-4.x-yellow?style=flat-square&logo=vitest" alt="Vitest" />
</p>

---

## 📖 Panorama Geral

O **Lume** é uma plataforma de engenharia de carreira projetada para profissionais que buscam excelência visual e técnica. Mais do que um simples editor, o Lume resolve a fricção na criação de currículos otimizados para algoritmos (ATS) em uma experiência fluida, integrada e de alta performance.

### 🎯 Diferenciais Estratégicos

- **Foco em Conversão (ATS):** Validadores integrados que garantem que seu currículo seja lido corretamente por sistemas de recrutamento.
- **Preview em Tempo Real:** Edição instantânea com renderização fiel de PDF via motor dedicado.
- **Experiência Premium:** Interface baseada em micro-interações, View Transitions para troca de temas e tipografia otimizada.

---

## ✨ Ecossistema de Funcionalidades

### 🖋️ Editor Inteligente & Real-time

Interface de alta performance focada em UX:

- **Live PDF Rendering:** Visualização instantânea do documento final enquanto você digita.
- **Drag & Drop Reordering:** Reorganize experiências, formações e projetos com `dnd-kit`.
- **Smart Spellchecker:** Detector de "verbos fracos" que sugere alternativas de alto impacto.
- **Perfil Completo:** Suporte a LinkedIn, GitHub e Portfólio pessoal integrados.

### 🤖 Validação & Performance

- **ATS Health Check:** Pontuação baseada em melhores práticas de legibilidade para robôs.
- **Keyword Matcher:** Analise a compatibilidade do currículo com descrições de vagas.
- **LinkedIn Parser:** Importação inteligente de dados via PDF do LinkedIn.

### 🌐 Compartilhamento & Link Público

- **Slug Customizado:** Links profissionais e curtos (ex: `lume.dev/seu-nome`).
- **Analytics:** Acompanhamento de visualizações e downloads em tempo real.
- **Internacionalização:** Crie versões do seu currículo em Português ou Inglês com um clique.

---

## 🛠️ Deep Dive Tecnológico

### Arquitetura de Frontend

- **Next.js 16 (App Router):** Server Actions para mutações e gerenciamento de estado eficiente.
- **React 19:** Utilização de hooks modernos e concorrência para uma UI responsiva.
- **Framer Motion:** Animações fluidas, transições de passos e troca de temas via View Transitions API.

### Dados & Segurança

- **Prisma ORM:** Modelagem de dados type-safe e interações robustas com PostgreSQL.
- **Clerk Auth:** Autenticação de nível empresarial com fluxos de onboarding customizados.
- **Zod:** Validação rigorosa de dados em tempo real no formulário.

---

## 🏗️ Estrutura Arquitetural

```text
├── src/
│   ├── app/              # Rotas, Layouts e Server Actions
│   ├── components/       # Componentes (Editor, PDF, UI, Preview)
│   ├── hooks/            # Custom Hooks (Debounce, Theme)
│   ├── i18n/             # Configuração de Internacionalização
│   ├── lib/              # Core Logic (ATS, Spellcheck, Matcher)
│   └── types/            # Definições TypeScript
├── prisma/               # Schema e Migrações (Database)
├── messages/             # Dicionários de Tradução (JSON)
├── vitest.config.ts      # Configurações de Teste
└── vitest-setup.ts       # Setup do Testing Library
```

---

## 🧪 Engenharia de Qualidade

A estabilidade é garantida por testes automatizados integrados ao fluxo de desenvolvimento:

- **Logic Tests:** Validação dos motores de cálculo e parsing.
- **Component Tests:** Testes de integração de UI com React Testing Library.
- **Pre-commit Automation:** Husky executando `vitest` antes de cada commit.

Para rodar os testes:

```bash
pnpm test
```
