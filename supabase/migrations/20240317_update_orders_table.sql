-- Atualizar tabela orders para suportar novos campos

-- Adicionar novos campos (se não existirem)
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS delivery_address TEXT,
  ADD COLUMN IF NOT EXISTS delivery_complement TEXT,
  ADD COLUMN IF NOT EXISTS observations TEXT,
  ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS items JSONB;

-- Comentários
COMMENT ON COLUMN orders.delivery_address IS 'Endereço de entrega (opcional)';
COMMENT ON COLUMN orders.delivery_complement IS 'Complemento do endereço (opcional)';
COMMENT ON COLUMN orders.observations IS 'Observações do cliente sobre o pedido';
COMMENT ON COLUMN orders.total_amount IS 'Valor total do pedido';
COMMENT ON COLUMN orders.items IS 'Array JSON com os itens do pedido';

-- Adicionar campo delivery_enabled na tabela stores
ALTER TABLE stores 
  ADD COLUMN IF NOT EXISTS delivery_enabled BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN stores.delivery_enabled IS 'Habilita opção de entrega no checkout';
