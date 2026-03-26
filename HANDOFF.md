# HANDOFF — Sistema de Pedidos Fosfo
> Última atualização: 26/03/2026 — Sessão 3

## Como usar este arquivo
Cole este documento no início de um novo chat (Claude ou Windsurf) para retomar o desenvolvimento.
Envie junto o `PROJECT_CONTEXT.md` e cole apenas os arquivos relevantes à tarefa (não o zip inteiro).

---

## Status do Projeto

### ✅ Fase 1 — Base
### ✅ Fase 2 — Admin da Loja
### ✅ Fase 3 — Storefront
### ✅ Fase 4 — Master Admin (incluindo sessão de hoje)

**Itens concluídos nesta sessão (26/03):**
- [x] Campo `is_free` na tabela `stores` (Supabase + tipos)
- [x] Funções RPC `master_toggle_store` e `master_set_store_free` no Supabase
- [x] `/master/stores` — badges visuais de trial (Free / Expirado / Expirando / Ativo)
- [x] `/master/stores` — botão Free/Remover Free funcionando
- [x] `/master/stores` — modal de confirmação para ativar/desativar (sem confirm())
- [x] `/master/stores` — toggle atualiza state local sem reload do banco
- [x] `/master/settings` — salvando com toast de feedback
- [x] `/admin` (dashboard) — banner amarelo quando trial expira em ≤10 dias
- [x] `/admin` (dashboard) — banner laranja quando trial já expirou
- [x] `/[slug]` — página de loja inativa com design premium (não mostra vitrine)
- [x] Git commit: `feat: master admin — badges trial, banners admin, loja inativa`

### ⏳ Fase 5 — Demo + LP
- [ ] Loja Demo funcional com produtos realistas
- [ ] Admin Demo com acesso aberto (sem senha)
- [ ] Refinar Landing Page

### ⬜ Fase 6 — Polish
- [ ] Responsividade mobile (admin + loja + LP)
- [ ] Refinamento UI loja pública
- [ ] Refinamento UI admin
- [ ] Deploy Vercel

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
- `trial_ends_at` — data de expiração do trial
- `primary_color`, `logo_url`, `slug` — personalização

### Funções RPC no Supabase
- `master_toggle_store(store_id, is_active)` — ativa/desativa loja
- `master_set_store_free(store_id, is_free)` — marca/desmarca como free

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
- `src/types/index.ts` — Todos os tipos TypeScript (inclui `is_free`)
- `src/hooks/useAuth.ts` — Hook de autenticação
- `src/hooks/useCart.ts` — Hook do carrinho
- `src/lib/utils.ts` — Utilitários (formatCurrency, getTrialDaysLeft, etc)
- `src/components/ui/index.ts` — Barrel export do design system
- `src/services/masterService.ts` — toggleStoreActive, setStoreFree, extendStoreTrial, getMasterStores
- `src/services/dashboardService.ts` — getDashboardMetrics
- `src/app/master/stores/page.tsx` — Gestão de lojas com badges e modais
- `src/app/master/settings/page.tsx` — Configurações da plataforma
- `src/app/admin/page.tsx` — Dashboard admin com banners de trial
- `src/app/[slug]/page.tsx` — Loja pública + página de loja inativa

---

## Decisões de Design

1. **Variações de produto:** Um card = um produto. Variações são seletores (pills/dropdown). Cada opção pode ter preço diferente.
2. **Imagens:** Principal obrigatória (placeholder padrão se não enviar), adicionais opcionais.
3. **WhatsApp:** Via wa.me. Número do suporte: `5551981219406`.
4. **Trial:** 14 dias padrão. Loja inativa → página de bloqueio no storefront. Admin continua funcionando.
5. **Loja inativa:** Página premium com design escuro, mensagem amigável e CTA para o Fosfo.
6. **Banners de trial no admin:** Amarelo (≤10 dias), Laranja (expirado). Não bloqueia o painel.
7. **Personalização da loja:** Apenas logo + cor primária + banner.
8. **Demo:** Loja demo genérica + admin demo sem senha.
9. **Impressão de pedidos:** Folha A4 com múltiplos pedidos.
10. **URL das lojas:** seusite.com/slug-da-loja

---

## Problemas já resolvidos
- Trigger handle_new_user() com `SET search_path = public` e `SECURITY DEFINER`
- Policies com recursão infinita: fix-nuclear.sql aplicado
- confirm() substituído por Modal de confirmação
- setState com função: resolvido usando objeto wrapper `{ fn: ... }`
- Toggle de loja atualiza state local diretamente (sem reload do banco)

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
