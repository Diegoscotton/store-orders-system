# Sistema de Pedidos Fosfo

Sistema SaaS multi-tenant para gerenciamento de lojas online com catálogo de produtos, carrinho de compras e gestão de pedidos via WhatsApp.

## 📚 Documentação

- **[HANDOFF.md](./HANDOFF.md)** — Status do projeto, credenciais, decisões técnicas (LEIA PRIMEIRO)
- **[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)** — Especificação completa do produto
- **[PLANO_TAREFAS.md](./PLANO_TAREFAS.md)** — Roadmap e tarefas pendentes
- **[SETUP_DEMO.md](./SETUP_DEMO.md)** — Como configurar a loja demo
- **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** — Guia de deploy no Vercel

## 🚀 Como rodar localmente

**Terminal nativo do Mac** (não o Windsurf):
```bash
cd ~/store-orders-system && npm run dev
```

Se der erro de porta em uso:
```bash
lsof -ti:3000,3001,3002,3003 | xargs kill -9 ; npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🛠️ Stack Tecnológica

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Supabase** (Auth + Database + Storage)
- **Radix UI** (Componentes acessíveis)
- **Lucide React** (Ícones)

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Rotas Next.js
│   ├── (auth)/            # Login, Register
│   ├── admin/             # Painel do dono da loja
│   ├── master/            # Painel master (Diego)
│   ├── [slug]/            # Loja pública dinâmica
│   └── demo/              # Loja e admin demo
├── components/
│   └── ui/                # Design system
├── hooks/                 # React hooks customizados
├── lib/                   # Utilitários
├── services/              # Lógica de negócio
└── types/                 # TypeScript types
```

## 🔑 Credenciais de Teste

| Conta | Email | Senha | Role |
|-------|-------|-------|------|
| Master | diego@fosfo.com.br | (sua senha) | master |
| Admin teste | diegoscotton@hotmail.com | (sua senha) | admin |

## 🌐 Supabase

- **URL:** https://lfeoismqsjvgvpjceger.supabase.co
- **Region:** East US
- **Storage:** store-assets, product-images

## 📦 Funcionalidades Principais

### Painel Master (`/master`)
- ✅ Gestão de lojas (ativar/desativar, trial, free)
- ✅ Gestão de usuários
- ✅ Busca em tempo real
- ✅ Exclusão de lojas e usuários
- ✅ Configurações da plataforma

### Painel Admin (`/admin`)
- ✅ Dashboard com métricas
- ✅ Gestão de produtos e categorias
- ✅ Gestão de pedidos
- ✅ Personalização da loja
- ✅ Banners de trial

### Loja Pública (`/[slug]`)
- ✅ Catálogo de produtos
- ✅ Carrinho de compras
- ✅ Checkout via WhatsApp
- ✅ Página de loja inativa

## 🚢 Deploy

Ver [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) para instruções completas.

## 📝 Licença

Propriedade de Fosfo - Todos os direitos reservados.
