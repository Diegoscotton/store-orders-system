-- ============================================
-- CRIAR LOJA DEMO
-- ============================================

-- Buscar o ID do usuário master (diego@fosfo.com.br)
DO $$
DECLARE
  master_user_id UUID;
  demo_store_id UUID;
  cat_bolos_id UUID;
  cat_doces_id UUID;
  cat_salgados_id UUID;
  cat_bebidas_id UUID;
  prod_bolo_chocolate_id UUID;
  prod_bolo_morango_id UUID;
  prod_brigadeiro_id UUID;
  prod_coxinha_id UUID;
  prod_refrigerante_id UUID;
  var_tamanho_id UUID;
  var_sabor_id UUID;
  var_tamanho_bebida_id UUID;
BEGIN
  -- Buscar master user
  SELECT id INTO master_user_id FROM auth.users WHERE email = 'diego@fosfo.com.br' LIMIT 1;
  
  IF master_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário master não encontrado. Execute o seed primeiro.';
  END IF;

  -- Criar loja demo (deletar se já existir)
  DELETE FROM stores WHERE slug = 'demo';
  
  INSERT INTO stores (
    name,
    slug,
    description,
    owner_id,
    primary_color,
    whatsapp_number,
    whatsapp_enabled,
    delivery_enabled,
    is_active,
    trial_ends_at
  ) VALUES (
    'Doce Sabor Confeitaria',
    'demo',
    'Bolos, doces e salgados artesanais feitos com muito carinho',
    master_user_id,
    '#ec4899',
    '54999887766',
    true,
    true,
    true,
    NOW() + INTERVAL '365 days'
  ) RETURNING id INTO demo_store_id;

  -- ============================================
  -- CATEGORIAS
  -- ============================================
  
  INSERT INTO categories (name, slug, description, store_id, position, is_active)
  VALUES 
    ('Bolos', 'bolos', 'Bolos artesanais para todas as ocasiões', demo_store_id, 1, true)
    RETURNING id INTO cat_bolos_id;
    
  INSERT INTO categories (name, slug, description, store_id, position, is_active)
  VALUES 
    ('Doces', 'doces', 'Docinhos e sobremesas deliciosas', demo_store_id, 2, true)
    RETURNING id INTO cat_doces_id;
    
  INSERT INTO categories (name, slug, description, store_id, position, is_active)
  VALUES 
    ('Salgados', 'salgados', 'Salgados fresquinhos e crocantes', demo_store_id, 3, true)
    RETURNING id INTO cat_salgados_id;
    
  INSERT INTO categories (name, slug, description, store_id, position, is_active)
  VALUES 
    ('Bebidas', 'bebidas', 'Bebidas geladas para acompanhar', demo_store_id, 4, true)
    RETURNING id INTO cat_bebidas_id;

  -- ============================================
  -- PRODUTOS - BOLOS
  -- ============================================
  
  -- Bolo de Chocolate
  INSERT INTO products (name, description, price, category_id, store_id, is_active, position)
  VALUES (
    'Bolo de Chocolate',
    'Delicioso bolo de chocolate com cobertura cremosa. Massa fofinha e sabor irresistível.',
    45.00,
    cat_bolos_id,
    demo_store_id,
    true,
    1
  ) RETURNING id INTO prod_bolo_chocolate_id;
  
  -- Variação: Tamanho
  INSERT INTO product_variants (product_id, name, position)
  VALUES (prod_bolo_chocolate_id, 'Tamanho', 1)
  RETURNING id INTO var_tamanho_id;
  
  INSERT INTO variant_options (variant_id, name, price, position)
  VALUES 
    (var_tamanho_id, 'Pequeno (500g)', 45.00, 1),
    (var_tamanho_id, 'Médio (1kg)', 75.00, 2),
    (var_tamanho_id, 'Grande (2kg)', 130.00, 3);
  
  -- Imagem placeholder
  INSERT INTO product_images (product_id, url, position)
  VALUES (prod_bolo_chocolate_id, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', 1);

  -- Bolo de Morango
  INSERT INTO products (name, description, price, category_id, store_id, is_active, position)
  VALUES (
    'Bolo de Morango',
    'Bolo recheado com creme e morangos frescos. Perfeito para festas e celebrações.',
    55.00,
    cat_bolos_id,
    demo_store_id,
    true,
    2
  ) RETURNING id INTO prod_bolo_morango_id;
  
  INSERT INTO product_variants (product_id, name, position)
  VALUES (prod_bolo_morango_id, 'Tamanho', 1)
  RETURNING id INTO var_tamanho_id;
  
  INSERT INTO variant_options (variant_id, name, price, position)
  VALUES 
    (var_tamanho_id, 'Pequeno (500g)', 55.00, 1),
    (var_tamanho_id, 'Médio (1kg)', 90.00, 2),
    (var_tamanho_id, 'Grande (2kg)', 160.00, 3);
  
  INSERT INTO product_images (product_id, url, position)
  VALUES (prod_bolo_morango_id, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800', 1);

  -- Bolo de Cenoura
  INSERT INTO products (name, description, price, category_id, store_id, is_active, position)
  VALUES (
    'Bolo de Cenoura',
    'Tradicional bolo de cenoura com cobertura de chocolate. Um clássico que todos amam!',
    40.00,
    cat_bolos_id,
    demo_store_id,
    true,
    3
  );
  
  INSERT INTO product_images (product_id, url, position)
  VALUES (currval('products_id_seq'), 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800', 1);

  -- ============================================
  -- PRODUTOS - DOCES
  -- ============================================
  
  -- Brigadeiro
  INSERT INTO products (name, description, price, category_id, store_id, is_active, position)
  VALUES (
    'Brigadeiro Gourmet',
    'Brigadeiros artesanais feitos com chocolate belga. Diversos sabores disponíveis.',
    3.50,
    cat_doces_id,
    demo_store_id,
    true,
    1
  ) RETURNING id INTO prod_brigadeiro_id;
  
  INSERT INTO product_variants (product_id, name, position)
  VALUES (prod_brigadeiro_id, 'Sabor', 1)
  RETURNING id INTO var_sabor_id;
  
  INSERT INTO variant_options (variant_id, name, price, position)
  VALUES 
    (var_sabor_id, 'Tradicional', 3.50, 1),
    (var_sabor_id, 'Morango', 4.00, 2),
    (var_sabor_id, 'Pistache', 5.00, 3),
    (var_sabor_id, 'Maracujá', 4.50, 4);
  
  INSERT INTO product_images (product_id, url, position)
  VALUES (prod_brigadeiro_id, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800', 1);

  -- Beijinho
  INSERT INTO products (name, description, price, category_id, store_id, is_active, position)
  VALUES (
    'Beijinho',
    'Beijinho tradicional com coco ralado. Doce e delicado.',
    3.00,
    cat_doces_id,
    demo_store_id,
    true,
    2
  );
  
  INSERT INTO product_images (product_id, url, position)
  VALUES (currval('products_id_seq'), 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800', 1);

  -- Brownie
  INSERT INTO products (name, description, price, category_id, store_id, is_active, position)
  VALUES (
    'Brownie',
    'Brownie de chocolate com pedaços de nozes. Crocante por fora, macio por dentro.',
    8.00,
    cat_doces_id,
    demo_store_id,
    true,
    3
  );
  
  INSERT INTO product_images (product_id, url, position)
  VALUES (currval('products_id_seq'), 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800', 1);

  -- ============================================
  -- PRODUTOS - SALGADOS
  -- ============================================
  
  -- Coxinha
  INSERT INTO products (name, description, price, category_id, store_id, is_active, position)
  VALUES (
    'Coxinha de Frango',
    'Coxinha tradicional com recheio generoso de frango desfiado. Crocante e saborosa.',
    6.00,
    cat_salgados_id,
    demo_store_id,
    true,
    1
  ) RETURNING id INTO prod_coxinha_id;
  
  INSERT INTO product_images (product_id, url, position)
  VALUES (prod_coxinha_id, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800', 1);

  -- Pastel
  INSERT INTO products (name, description, price, category_id, store_id, is_active, position)
  VALUES (
    'Pastel Assado',
    'Pastel assado recheado. Opção mais leve e saudável.',
    7.50,
    cat_salgados_id,
    demo_store_id,
    true,
    2
  );
  
  INSERT INTO product_images (product_id, url, position)
  VALUES (currval('products_id_seq'), 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', 1);

  -- Empada
  INSERT INTO products (name, description, price, category_id, store_id, is_active, position)
  VALUES (
    'Empada de Palmito',
    'Empada artesanal com recheio cremoso de palmito.',
    8.50,
    cat_salgados_id,
    demo_store_id,
    true,
    3
  );
  
  INSERT INTO product_images (product_id, url, position)
  VALUES (currval('products_id_seq'), 'https://images.unsplash.com/photo-1619740455993-9e0c797bfb0e?w=800', 1);

  -- ============================================
  -- PRODUTOS - BEBIDAS
  -- ============================================
  
  -- Refrigerante
  INSERT INTO products (name, description, price, category_id, store_id, is_active, position)
  VALUES (
    'Refrigerante',
    'Refrigerante gelado para acompanhar seu pedido.',
    5.00,
    cat_bebidas_id,
    demo_store_id,
    true,
    1
  ) RETURNING id INTO prod_refrigerante_id;
  
  INSERT INTO product_variants (product_id, name, position)
  VALUES (prod_refrigerante_id, 'Tamanho', 1)
  RETURNING id INTO var_tamanho_bebida_id;
  
  INSERT INTO variant_options (variant_id, name, price, position)
  VALUES 
    (var_tamanho_bebida_id, 'Lata 350ml', 5.00, 1),
    (var_tamanho_bebida_id, 'Garrafa 600ml', 7.00, 2),
    (var_tamanho_bebida_id, 'Garrafa 2L', 12.00, 3);
  
  INSERT INTO product_images (product_id, url, position)
  VALUES (prod_refrigerante_id, 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800', 1);

  -- Suco Natural
  INSERT INTO products (name, description, price, category_id, store_id, is_active, position)
  VALUES (
    'Suco Natural',
    'Suco natural de frutas frescas. Sem conservantes.',
    8.00,
    cat_bebidas_id,
    demo_store_id,
    true,
    2
  );
  
  INSERT INTO product_images (product_id, url, position)
  VALUES (currval('products_id_seq'), 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800', 1);

  -- ============================================
  -- BANNERS
  -- ============================================
  
  INSERT INTO banners (store_id, image_url, title, position, is_active)
  VALUES 
    (demo_store_id, 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200', 'Bolos Artesanais', 1, true),
    (demo_store_id, 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=1200', 'Doces Gourmet', 2, true),
    (demo_store_id, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=1200', 'Salgados Fresquinhos', 3, true);

  RAISE NOTICE 'Loja demo criada com sucesso! ID: %', demo_store_id;
END $$;
