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

O **Lume** é uma plataforma de engenharia de carreira projetada para profissionais que buscam excelência visual e técnica. Mais do que um simples editor, o Lume resolve a fricção na criação de currículos otimizados para algoritmos (ATS) em uma experiência fluida e integrada.

### 🎯 Diferenciais Estratégicos

- **Foco em Conversão (ATS):** Validadores integrados que garantem que seu currículo seja lido corretamente por sistemas de recrutamento.
- **Preview em Tempo Real:** Edição instantânea com renderização fiel de PDF.
- **Experiência Premium:** Interface baseada em micro-interações, View Transitions e tipografia de alta legibilidade.

---

## ✨ Ecossistema de Funcionalidades

### 🖋️ Editor Inteligente & Real-time

Interface de alta performance que elimina a necessidade de recarregamentos:

- **Live PDF Rendering:** Visualização instantânea do documento final via `@react-pdf/renderer`.
- **Drag & Drop Reordering:** Reorganize experiências, formações e projetos com gestos intuitivos.
- **Smart Spellchecker:** Detector de "verbos fracos" que sugere alternativas de alto impacto para destacar suas conquistas.

### 🤖 Validação & Performance

- **ATS Health Check:** Pontuação em tempo real baseada em melhores práticas de legibilidade para robôs de recrutamento.
- **Keyword Matcher:** Analise seu currículo contra descrições de vagas específicas para identificar lacunas de habilidades.
- **LinkedIn Parser:** Importe seus dados diretamente do PDF do LinkedIn para acelerar o preenchimento.

### 🌐 Compartilhamento & Link Público

- **Slug Customizado:** Gere links públicos profissionais (ex: `lume.dev/seu-nome`) para compartilhar com recrutadores.
- **Analytics Integrado:** Acompanhe visualizações e downloads do seu perfil profissional.

---

## 🛠️ Deep Dive Tecnológico

### Arquitetura de Frontend

O projeto utiliza o estado da arte do ecossistema React:

- **Next.js 16 (App Router):** Utilização intensiva de Server Actions para mutações de dados e cache otimizado.
- **React 19:** Aproveitamento das novas APIs de gerenciamento de estado e hooks modernos.
- **Framer Motion:** Orquestração de animações de interface, incluindo View Transitions para trocas de tema.

### Dados & Infraestrutura

- **Prisma ORM:** Camada de dados robusta sobre PostgreSQL, garantindo integridade e performance em consultas complexas.
- **Clerk Auth:** Autenticação segura e simplificada com suporte a múltiplos provedores sociais.
- **next-intl:** Suporte nativo a internacionalização (PT/EN), permitindo currículos globais.

### Design System

- **Tailwind CSS v4:** Utilização da nova engine baseada em propriedades nativas do CSS para performance máxima.
- **OKLCH Color Space:** Paleta de cores vibrante e acessível, otimizada para temas Light e Dark com contrastes perfeitos.

---

## 🏗️ Estrutura Arquitetural

```text
├── src/
│   ├── app/              # Next.js App Router (Páginas, Actions, Layouts)
│   ├── components/       # Componentes React (Editor, PDF, UI, Preview)
│   ├── hooks/            # Hooks customizados (Debounce, UI State)
│   ├── i18n/             # Configurações de Internacionalização
│   ├── lib/              # Lógica de Negócio e Validadores (ATS, Matcher)
│   ├── prisma/           # Schema e Migrations do Banco de Dados
│   └── types/            # Definições TypeScript Globais
├── messages/             # Dicionários de Tradução (JSON)
├── tests/                # Suíte de Testes (Vitest + RTL)
└── vitest.config.ts      # Configurações de Teste e JSDOM
```

---

## 🧪 Engenharia de Qualidade

A estabilidade do Lume é garantida por uma pipeline de testes rigorosa:

- **Logic Validation:** Testes unitários para os algoritmos de score ATS e keyword matching.
- **UI Testing:** Validação de componentes críticos como o seletor de idiomas e formulários.
- **Pre-commit Hooks:** Integração com Husky que impede commits caso a suíte de testes falhe.

Para rodar o ambiente de testes:

```bash
pnpm test
```
