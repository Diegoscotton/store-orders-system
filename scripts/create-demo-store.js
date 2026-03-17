const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Tentar usar service role key primeiro (contorna RLS), senão usar anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas')
  console.error('💡 Adicione SUPABASE_SERVICE_ROLE_KEY no .env.local para contornar RLS')
  process.exit(1)
}

const useServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function createDemoStore() {
  console.log('🚀 Criando loja demo...')
  
  let masterUserId

  try {
    if (useServiceRole) {
      console.log('� Usando Service Role Key (contorna RLS)\n')
      
      // Buscar master user diretamente do banco
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'master')
        .limit(1)
      
      if (profileError) throw profileError
      if (!profiles || profiles.length === 0) {
        throw new Error('Usuário master não encontrado no banco')
      }
      
      masterUserId = profiles[0].id
      console.log('✅ Master user ID encontrado:', masterUserId)
    } else {
      console.log('�📧 Para criar a loja demo, você precisa fazer login como master\n')
      
      const email = await question('Email do master: ')
      const password = await question('Senha: ')

      // Fazer login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      })

      if (authError) throw new Error(`Erro no login: ${authError.message}`)
      
      console.log('✅ Login realizado com sucesso')
      
      masterUserId = authData.user.id
      console.log('✅ Master user ID:', masterUserId)
    }

    // Deletar loja demo se já existir
    await supabase.from('stores').delete().eq('slug', 'demo')
    console.log('🗑️  Loja demo anterior removida (se existia)')

    // Criar loja demo
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({
        name: 'Doce Sabor Confeitaria',
        slug: 'demo',
        description: 'Bolos, doces e salgados artesanais feitos com muito carinho',
        owner_id: masterUserId,
        primary_color: '#ec4899',
        whatsapp_number: '54999887766',
        whatsapp_enabled: true,
        delivery_enabled: true,
        is_active: true,
        trial_ends_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single()

    if (storeError) throw storeError
    console.log('✅ Loja demo criada:', store.id)

    const storeId = store.id

    // Criar categorias
    const categories = [
      { name: 'Bolos', slug: 'bolos', description: 'Bolos artesanais para todas as ocasiões', position: 1 },
      { name: 'Doces', slug: 'doces', description: 'Docinhos e sobremesas deliciosas', position: 2 },
      { name: 'Salgados', slug: 'salgados', description: 'Salgados fresquinhos e crocantes', position: 3 },
      { name: 'Bebidas', slug: 'bebidas', description: 'Bebidas geladas para acompanhar', position: 4 }
    ]

    const createdCategories = {}
    for (const cat of categories) {
      const { data, error } = await supabase
        .from('categories')
        .insert({ ...cat, store_id: storeId, is_active: true })
        .select()
        .single()
      
      if (error) throw error
      createdCategories[cat.slug] = data.id
      console.log(`✅ Categoria criada: ${cat.name}`)
    }

    // Criar produtos com variações e imagens
    const products = [
      // BOLOS
      {
        name: 'Bolo de Chocolate',
        description: 'Delicioso bolo de chocolate com cobertura cremosa. Massa fofinha e sabor irresistível.',
        price: 45.00,
        category: 'bolos',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
        variants: [
          {
            name: 'Tamanho',
            options: [
              { name: 'Pequeno (500g)', price: 45.00 },
              { name: 'Médio (1kg)', price: 75.00 },
              { name: 'Grande (2kg)', price: 130.00 }
            ]
          }
        ]
      },
      {
        name: 'Bolo de Morango',
        description: 'Bolo recheado com creme e morangos frescos. Perfeito para festas e celebrações.',
        price: 55.00,
        category: 'bolos',
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800',
        variants: [
          {
            name: 'Tamanho',
            options: [
              { name: 'Pequeno (500g)', price: 55.00 },
              { name: 'Médio (1kg)', price: 90.00 },
              { name: 'Grande (2kg)', price: 160.00 }
            ]
          }
        ]
      },
      {
        name: 'Bolo de Cenoura',
        description: 'Tradicional bolo de cenoura com cobertura de chocolate. Um clássico que todos amam!',
        price: 40.00,
        category: 'bolos',
        image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800'
      },
      // DOCES
      {
        name: 'Brigadeiro Gourmet',
        description: 'Brigadeiros artesanais feitos com chocolate belga. Diversos sabores disponíveis.',
        price: 3.50,
        category: 'doces',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800',
        variants: [
          {
            name: 'Sabor',
            options: [
              { name: 'Tradicional', price: 3.50 },
              { name: 'Morango', price: 4.00 },
              { name: 'Pistache', price: 5.00 },
              { name: 'Maracujá', price: 4.50 }
            ]
          }
        ]
      },
      {
        name: 'Beijinho',
        description: 'Beijinho tradicional com coco ralado. Doce e delicado.',
        price: 3.00,
        category: 'doces',
        image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800'
      },
      {
        name: 'Brownie',
        description: 'Brownie de chocolate com pedaços de nozes. Crocante por fora, macio por dentro.',
        price: 8.00,
        category: 'doces',
        image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800'
      },
      // SALGADOS
      {
        name: 'Coxinha de Frango',
        description: 'Coxinha tradicional com recheio generoso de frango desfiado. Crocante e saborosa.',
        price: 6.00,
        category: 'salgados',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800'
      },
      {
        name: 'Pastel Assado',
        description: 'Pastel assado recheado. Opção mais leve e saudável.',
        price: 7.50,
        category: 'salgados',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800'
      },
      {
        name: 'Empada de Palmito',
        description: 'Empada artesanal com recheio cremoso de palmito.',
        price: 8.50,
        category: 'salgados',
        image: 'https://images.unsplash.com/photo-1619740455993-9e0c797bfb0e?w=800'
      },
      // BEBIDAS
      {
        name: 'Refrigerante',
        description: 'Refrigerante gelado para acompanhar seu pedido.',
        price: 5.00,
        category: 'bebidas',
        image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800',
        variants: [
          {
            name: 'Tamanho',
            options: [
              { name: 'Lata 350ml', price: 5.00 },
              { name: 'Garrafa 600ml', price: 7.00 },
              { name: 'Garrafa 2L', price: 12.00 }
            ]
          }
        ]
      },
      {
        name: 'Suco Natural',
        description: 'Suco natural de frutas frescas. Sem conservantes.',
        price: 8.00,
        category: 'bebidas',
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800'
      }
    ]

    let position = 1
    for (const prod of products) {
      const { data: product, error: prodError } = await supabase
        .from('products')
        .insert({
          name: prod.name,
          description: prod.description,
          price: prod.price,
          category_id: createdCategories[prod.category],
          store_id: storeId,
          is_active: true,
          position: position++
        })
        .select()
        .single()

      if (prodError) throw prodError
      console.log(`✅ Produto criado: ${prod.name}`)

      // Adicionar imagem
      if (prod.image) {
        await supabase.from('product_images').insert({
          product_id: product.id,
          url: prod.image,
          position: 1
        })
      }

      // Adicionar variações
      if (prod.variants) {
        for (const variant of prod.variants) {
          const { data: variantData, error: varError } = await supabase
            .from('product_variants')
            .insert({
              product_id: product.id,
              name: variant.name,
              position: 1
            })
            .select()
            .single()

          if (varError) throw varError

          // Adicionar opções
          let optPos = 1
          for (const option of variant.options) {
            await supabase.from('variant_options').insert({
              variant_id: variantData.id,
              name: option.name,
              price: option.price,
              position: optPos++
            })
          }
        }
      }
    }

    // Criar banners
    const banners = [
      { image_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200', title: 'Bolos Artesanais', position: 1 },
      { image_url: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=1200', title: 'Doces Gourmet', position: 2 },
      { image_url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=1200', title: 'Salgados Fresquinhos', position: 3 }
    ]

    for (const banner of banners) {
      await supabase.from('banners').insert({
        store_id: storeId,
        ...banner,
        is_active: true
      })
    }
    console.log('✅ Banners criados')

    console.log('\n🎉 Loja demo criada com sucesso!')
    console.log(`📍 Acesse: http://localhost:3000/demo`)
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
    rl.close()
    process.exit(1)
  }
  
  rl.close()
  process.exit(0)
}

createDemoStore()
