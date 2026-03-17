# 🔑 Como Adicionar Service Role Key

O script precisa da **Service Role Key** do Supabase para contornar as políticas de RLS (Row Level Security) e criar a loja demo.

## Passo a Passo:

### 1. Obter a Service Role Key

1. Acesse: https://supabase.com/dashboard/project/lfeoismqsjvgvpjceger/settings/api
2. Na seção **Project API keys**, copie a **service_role** key (não a anon key)
3. ⚠️ **IMPORTANTE:** Esta chave tem acesso total ao banco. Nunca exponha no frontend!

### 2. Adicionar no .env.local

Abra o arquivo `.env.local` e adicione:

```env
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

O arquivo deve ficar assim:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lfeoismqsjvgvpjceger.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

### 3. Executar o Script

Agora execute novamente:

```bash
node scripts/create-demo-store.js
```

O script vai:
- ✅ Detectar automaticamente a Service Role Key
- ✅ Contornar o RLS
- ✅ Criar toda a estrutura da loja demo sem pedir login

---

## Alternativa: Popular Manualmente

Se não quiser adicionar a Service Role Key, você pode popular a loja demo manualmente via interface admin seguindo as instruções em `SETUP_DEMO.md`.
