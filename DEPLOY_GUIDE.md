# 🚀 Deploy na Vercel - Guia Passo a Passo

## 📋 Pré-requisitos

1. **Conta na Vercel** (vercel.com)
2. **Repositório GitHub** com o código
3. **Variáveis de Ambiente** do Supabase

---

## 🔧 Configurações

### 1. Variáveis de Ambiente na Vercel

No dashboard da Vercel, adicione estas Environment Variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=seu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=seu_service_role_key

# URL da Aplicação
NEXT_PUBLIC_APP_URL=https://seu-projeto.vercel.app
```

### 2. Conectar com GitHub

1. Faça push do código para o GitHub
2. No dashboard Vercel: "Add New" → "Project"
3. Importe o repositório GitHub
4. Configure as variáveis de ambiente

---

## ⚙️ Build Settings

O projeto já está configurado com:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Framework**: Next.js 16

---

## 🌐 Deploy Automático

Após configurar:

1. **Trigger automático** em cada push para main
2. **Preview URLs** para cada PR
3. **Custom domains** (se necessário)

---

## ✅ Verificação Pós-Deploy

Teste estas URLs:

- **Landing Page**: `https://seu-projeto.vercel.app`
- **Loja Demo**: `https://seu-projeto.vercel.app/demo`
- **Admin Demo**: `https://seu-projeto.vercel.app/demo-admin`

---

## 🔧 Troubleshooting

### Build Errors Comuns:

1. **Missing Environment Variables**
   - Verifique se todas as variáveis estão configuradas na Vercel

2. **Image Optimization Issues**
   - As configurações de imagens já estão no `next.config.ts`

3. **Database Connection**
   - Verifique as URLs do Supabase estão corretas

### Performance Issues:

1. **Imagens não carregando**
   - Verifique se o hostname do Supabase está no `next.config.ts`

2. **API Routes lentas**
   - Configure regions mais próximas no `vercel.json`

---

## 📊 Monitoramento

A Vercel oferece:

- **Analytics**: Tráfego e performance
- **Logs**: Erros e debugging
- **Speed Insights**: Core Web Vitals
- **Build Logs**: Status dos deploys

---

## 🎯 Próximo Passos

Após deploy bem-sucedido:

1. **Configure custom domain** (se necessário)
2. **Monitore performance** nos primeiros dias
3. **Configure analytics** da Vercel
4. **Teste todas as funcionalidades** em produção

---

## 📞 Suporte

Se tiver problemas:

1. **Vercel Docs**: vercel.com/docs
2. **Next.js Deploy**: nextjs.org/docs/deployment
3. **Supabase + Vercel**: supabase.com/docs/guides/deployment/vercel
