# HANDOFF — Sistema de Pedidos Fosfo
> Última atualização: 26/03/2026 — Sessão 5

## Como usar este arquivo
Cole este documento no início de um novo chat (Claude ou Windsurf) para retomar o desenvolvimento.
Envie junto o `PROJECT_CONTEXT.md` e cole apenas os arquivos relevantes à tarefa (não o zip inteiro).

---

## Status do Projeto

### ✅ Fase 1 — Base (COMPLETA)
- [x] Autenticação com Supabase (email/password)
- [x] Sistema multi-tenant (profiles, stores, store_users)
- [x] Design system completo (Button, Input, Card, Badge, Modal, Toast, Skeleton)
- [x] Hooks customizados (useAuth, useCart)
- [x] Utilitários (formatCurrency, formatPhone, formatDate, getTrialDaysLeft)
- [x] Estrutura de rotas Next.js App Router
- [x] TypeScript strict em todo o projeto

### ✅ Fase 2 — Admin da Loja (COMPLETA)
- [x] Dashboard com métricas (vendas, pedidos, produtos)
- [x] CRUD completo de produtos com variações
- [x] CRUD de categorias
- [x] Gestão de pedidos (status, impressão)
- [x] Personalização da loja (logo, cor primária, banner)
- [x] Upload de imagens (Supabase Storage)
- [x] Drag & drop para ordenar produtos e categorias
- [x] Sistema de banners promocionais

### ✅ Fase 3 — Storefront (COMPLETA)
- [x] Página pública da loja (`/[slug]`)
- [x] Catálogo de produtos com filtros por categoria
- [x] Carrinho de compras (localStorage)
- [x] Checkout via WhatsApp
- [x] Página de loja inativa (design premium)
- [x] Responsivo mobile
- [x] Suporte a variações de produto
- [x] Banners promocionais na vitrine

### ✅ Fase 4 — Master Admin (COMPLETA)
- [x] Painel master (`/master`)
- [x] Gestão de lojas (listar, ativar/desativar, trial, free)
- [x] Gestão de usuários (listar, excluir)
- [x] Busca em tempo real (lojas e usuários)
- [x] Exclusão de lojas com modal de confirmação
- [x] Exclusão de usuários com modal de confirmação
- [x] Badges visuais de trial (Free, Expirado, Expirando, Ativo)
- [x] Ícones ghost para ações (Gift, Clock, Trash2)
- [x] Links clicáveis (email, WhatsApp)
- [x] Configurações da plataforma (trial padrão)
- [x] Funções RPC no Supabase
- [x] Banners de trial no dashboard admin

### ⏳ Fase 5 — Demo + LP (PRÓXIMA)
- [ ] Loja Demo funcional com produtos realistas
- [ ] Admin Demo com acesso aberto (sem senha)
- [ ] Refinar Landing Page

### ⬜ Fase 6 — Polish
- [ ] Responsividade mobile (admin + loja + LP)
- [ ] Refinamento UI loja pública
- [ ] Refinamento UI admin
- [ ] Deploy Vercel

---

## Histórico de Desenvolvimento

### Sessão 5 (26/03/2026) — Preparação para Demo
**Funcionalidades implementadas:**
- [x] `types/index.ts` — campo `is_demo: boolean` adicionado ao tipo `Store`
- [x] API Route `/api/platform-settings` — endpoint para buscar configurações da plataforma
- [x] Correção de estrutura de arquivos (nomes e locais corretos conforme Next.js App Router)
- [x] Reorganização de arquivos duplicados (slug-page, landing-page, master-stores-page)
- [x] Documentação expandida no HANDOFF.md (histórico completo, funcionalidades por módulo)

**Commits:**
- `fix: corrigir nomes e locais dos arquivos`
- `fix: api route platform-settings`
- `docs: expandir HANDOFF.md com histórico completo, funcionalidades por módulo e problemas resolvidos`

**Decisões técnicas:**
- Campo `is_demo` permitirá identificar e tratar a loja demo de forma especial
- API route de platform-settings facilita acesso às configurações sem duplicar lógica
- Estrutura de arquivos agora segue convenções do Next.js (route.ts, page.tsx)

### Sessão 4 (26/03/2026) — Master Admin: Busca e Exclusão
**Funcionalidades implementadas:**
- [x] `/master/stores` — funcionalidade de exclusão de lojas com modal de confirmação
- [x] `/master/users` — funcionalidade de exclusão de usuários com modal de confirmação
- [x] `/master/stores` — botões Free/Trial substituídos por ícones ghost (Gift, Clock, Trash2)
- [x] `/master/stores` — campo de busca em tempo real (nome, slug, dono)
- [x] `/master/users` — campo de busca em tempo real (nome, email, loja)
- [x] `/master/stores` — email e telefone do dono clicáveis (mailto: e WhatsApp)
- [x] `masterService.ts` — funções `deleteStore()` e `deleteUser()` com cascade
- [x] `masterService.ts` — `getMasterUsers()` refatorado para usar `owner_id` ao invés de `store_users`
- [x] `types/index.ts` — campo `email` adicionado ao tipo `Profile`
- [x] Logs de debug adicionados para troubleshooting
- [x] Documentação atualizada (HANDOFF.md, README.md)

**Commits:**
- `feat: adicionar busca em tempo real e exclusão de lojas/usuários no painel master`
- `docs: atualizar HANDOFF.md e README.md com funcionalidades da sessão 4`

### Sessão 3 (26/03/2026) — Master Admin: Trial e Badges
**Funcionalidades implementadas:**
- [x] Campo `is_free` na tabela `stores` (Supabase + tipos)
- [x] Funções RPC `master_toggle_store` e `master_set_store_free` no Supabase
- [x] `/master/stores` — badges visuais de trial (Free / Expirado / Expirando / Ativo)
- [x] `/master/stores` — botão Free/Remover Free funcionando
- [x] `/master/stores` — modal de confirmação para ativar/desativar (sem confirm())
- [x] `/master/stores` — toggle atualiza state local sem reload do banco
- [x] `/master/settings` — salvando com toast de feedback
- [x] `/admin` (dashboard) — banner amarelo quando trial expira em ≤10 dias
- [x] `/admin` (dashboard) — banner laranja quando trial já expirado
- [x] `/[slug]` — página de loja inativa com design premium (não mostra vitrine)

**Commits:**
- `feat: master admin — badges trial, banners admin, loja inativa`

### Sessões anteriores (Fases 1-3)
- Implementação completa da base do sistema
- Painel admin da loja com todas as funcionalidades
- Storefront público com carrinho e checkout
- Sistema de autenticação e multi-tenancy
- Design system completo

---

## Stack

| Tecnologia | Versão |
|-----------|--------|
| Next.js | 16.1.7 |
| React | 19.2.x |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Supabase | JS 2.99.x |
| Lucide React | 0.577.x |
| Radix UI | Dialog, Dropdown, Toast, Select, Switch |

---

## Supabase

- **Projeto:** Sistema de pedidos - Fosfo
- **URL:** https://lfeoismqsjvgvpjceger.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZW9pc21xc2p2Z3ZwamNlZ2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MDA1NTksImV4cCI6MjA4OTI3NjU1OX0.75L5If1zn7Kvq8LUovFBS3BojCxZ2y3Iy01PwEpb8yk
- **Region:** East US
- **Storage Buckets:** store-assets (public), product-images (public)
- **Confirm email:** DESATIVADO
- **Auth trigger:** handle_new_user() cria profile automaticamente

### Tabelas
profiles, stores, store_users, categories, products, product_images, product_variants, variant_options, banners, orders, order_items, platform_settings

### Campos relevantes em `stores`
- `is_active` — liga/desliga a loja (master controla)
- `is_free` — isenta a loja de trial
- `is_demo` — identifica loja demo (acesso público ao admin)
- `trial_ends_at` — data de expiração do trial
- `primary_color`, `logo_url`, `slug` — personalização

### Funções RPC no Supabase
- `master_toggle_store(store_id, is_active)` — ativa/desativa loja
- `master_set_store_free(store_id, is_free)` — marca/desmarca como free

### Funções de exclusão (masterService.ts)
- `deleteStore(storeId)` — exclui loja permanentemente (cascade: produtos, pedidos, etc)
- `deleteUser(userId)` — exclui usuário permanentemente (cascade: loja vinculada)

---

## Credenciais de Teste

| Conta | Email | Role |
|-------|-------|------|
| Master | diego@fosfo.com.br | master |
| Admin teste | diegoscotton@hotmail.com | admin |

### Lojas para testar
| Nome | is_active | is_free | Situação |
|------|-----------|---------|----------|
| teste diego | true | false | Loja do master |
| DIEGO ANTONIO SCOTTON | false | true | Free |
| Açai Centra Bento | true | false | Ativa |
| Loja do Kiss | false | false | Inativa |
| Doce Sabor Confeitaria | true | false | Ativa |

---

## Arquivos-chave

- `PROJECT_CONTEXT.md` — Especificação completa do produto
- `HANDOFF.md` — Este arquivo
- `src/types/index.ts` — Todos os tipos TypeScript (inclui `is_free`, `is_demo` no Store e `email` no Profile)
- `src/hooks/useAuth.ts` — Hook de autenticação
- `src/hooks/useCart.ts` — Hook do carrinho
- `src/lib/utils.ts` — Utilitários (formatCurrency, getTrialDaysLeft, etc)
- `src/components/ui/index.ts` — Barrel export do design system
- `src/services/masterService.ts` — toggleStoreActive, setStoreFree, extendStoreTrial, getMasterStores, getMasterUsers, deleteStore, deleteUser
- `src/services/dashboardService.ts` — getDashboardMetrics
- `src/app/api/platform-settings/route.ts` — API route para buscar configurações da plataforma
- `src/app/master/stores/page.tsx` — Gestão de lojas com badges, modais, busca em tempo real e exclusão
- `src/app/master/users/page.tsx` — Gestão de usuários com busca em tempo real e exclusão
- `src/app/master/settings/page.tsx` — Configurações da plataforma
- `src/app/admin/page.tsx` — Dashboard admin com banners de trial
- `src/app/[slug]/page.tsx` — Loja pública + página de loja inativa
- `src/app/page.tsx` — Landing Page

---

## Decisões de Design

1. **Variações de produto:** Um card = um produto. Variações são seletores (pills/dropdown). Cada opção pode ter preço diferente.
2. **Imagens:** Principal obrigatória (placeholder padrão se não enviar), adicionais opcionais.
3. **WhatsApp:** Via wa.me. Número do suporte: `5551981219406`.
4. **Trial:** 14 dias padrão. Loja inativa → página de bloqueio no storefront. Admin continua funcionando.
5. **Loja inativa:** Página premium com design escuro, mensagem amigável e CTA para o Fosfo.
6. **Banners de trial no admin:** Amarelo (≤10 dias), Laranja (expirado). Não bloqueia o painel.
7. **Personalização da loja:** Apenas logo + cor primária + banner.
8. **Demo:** Loja demo genérica + admin demo sem senha. Campo `is_demo` identifica a loja.
9. **Impressão de pedidos:** Folha A4 com múltiplos pedidos.
10. **URL das lojas:** seusite.com/slug-da-loja
11. **Estrutura de arquivos:** Seguir convenções Next.js App Router (route.ts para API, page.tsx para páginas)

---

## Problemas já resolvidos

### Supabase & Database
- **Trigger handle_new_user():** Adicionado `SET search_path = public` e `SECURITY DEFINER` para criar profile automaticamente
- **Policies com recursão infinita:** fix-nuclear.sql aplicado para corrigir RLS
- **Cache de queries:** Adicionado timestamp e filtros para forçar refresh de dados
- **Cascade deletes:** Implementado exclusão em cascata para lojas e usuários

### React & State Management
- **confirm() nativo:** Substituído por componentes Modal com confirmação
- **setState com função:** Resolvido usando objeto wrapper `{ fn: ... }` para evitar stale closures
- **Toggle de loja:** Atualiza state local diretamente (sem reload do banco)
- **Filtros de busca:** Implementado busca em tempo real sem debounce

### TypeScript
- **Tipos do Supabase:** Sincronizados com schema do banco (is_free, email, etc)
- **Type safety:** Strict mode habilitado em todo o projeto
- **Type casting:** Uso de `(user as any).email` onde necessário para campos dinâmicos

### Performance
- **Queries otimizadas:** Select apenas campos necessários ao invés de `*`
- **owner_id vs store_users:** Refatorado para usar relação direta via owner_id
- **State updates:** Atualizações locais antes de recarregar do servidor

---

## Funcionalidades Completas por Módulo

### 🔐 Autenticação
- ✅ Login com email/password
- ✅ Registro de usuário + criação automática de loja
- ✅ Proteção de rotas por role (admin, master)
- ✅ Logout
- ✅ Confirm email DESATIVADO (acesso imediato)

### 👨‍💼 Painel Admin (`/admin`)
- ✅ Dashboard com métricas (vendas, pedidos, produtos)
- ✅ Gráfico de vendas dos últimos 7 dias
- ✅ Produtos mais vendidos
- ✅ Pedidos recentes
- ✅ Banners de aviso de trial (amarelo ≤10 dias, laranja expirado)
- ✅ CRUD completo de produtos (nome, preço, descrição, imagens, variações)
- ✅ Upload de imagens para produtos (Supabase Storage)
- ✅ Drag & drop para ordenar produtos
- ✅ CRUD de categorias
- ✅ Drag & drop para ordenar categorias
- ✅ Gestão de pedidos (listar, filtrar, atualizar status)
- ✅ Impressão de pedidos (múltiplos em A4)
- ✅ Personalização da loja (logo, cor primária, banner)
- ✅ Sistema de banners promocionais

### 🏪 Loja Pública (`/[slug]`)
- ✅ Catálogo de produtos com imagens
- ✅ Filtros por categoria
- ✅ Suporte a variações de produto (tamanho, sabor, etc)
- ✅ Carrinho de compras (localStorage)
- ✅ Checkout via WhatsApp
- ✅ Banners promocionais
- ✅ Página de loja inativa (design premium)
- ✅ Responsivo mobile

### 👑 Painel Master (`/master`)
- ✅ Gestão de lojas (listar, ativar/desativar, trial, free, excluir)
- ✅ Gestão de usuários (listar, excluir)
- ✅ Busca em tempo real (lojas: nome, slug, dono | usuários: nome, email, loja)
- ✅ Badges visuais de trial (Free, Expirado, Expirando em X dias, Ativo)
- ✅ Modal de confirmação para exclusão (digitar nome para confirmar)
- ✅ Links clicáveis (email → mailto:, telefone → WhatsApp)
- ✅ Ícones ghost para ações (Gift, Clock, Trash2)
- ✅ Configurações da plataforma (trial padrão)
- ✅ Modal de detalhes da loja
- ✅ Estender trial de lojas específicas

### 🛠️ Infraestrutura
- ✅ Multi-tenancy completo (isolamento por store_id)
- ✅ Row Level Security (RLS) no Supabase
- ✅ Storage público para assets
- ✅ Funções RPC para operações master
- ✅ Cascade deletes (loja → produtos, pedidos | usuário → loja)
- ✅ Design system completo e consistente
- ✅ TypeScript strict em todo o projeto
- ✅ Error handling com toast feedback

---

## Como rodar localmente

**Terminal nativo do Mac** (não o Windsurf):
```bash
cd ~/store-orders-system && npm run dev
```

Se der erro de porta em uso:
```bash
lsof -ti:3000,3001,3002,3003 | xargs kill -9 ; npm run dev
```

---

## Próxima sessão — Fase 5

### Prioridade 1: Loja Demo
- Criar loja com slug `demo` no Supabase
- Popular com categorias e produtos realistas (ex: açaí, confeitaria)
- Garantir que todas as features da vitrine funcionem (variações, carrinho, checkout)

### Prioridade 2: Admin Demo
- Rota `/demo/admin` com acesso aberto (sem autenticação)
- Mostrar o painel admin com dados da loja demo
- Visitante pode navegar mas não salvar (ou salva em modo demo)

### Prioridade 3: Landing Page
- Revisar seções existentes
- Adicionar link para loja demo e admin demo
