'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, Card, Badge, useToast, CurrencyInput } from '@/components/ui'
import {
  createProduct, updateProduct, uploadProductImage, deleteProductImage,
  addVariant, updateVariant, deleteVariant,
  addVariantOption, updateVariantOption, deleteVariantOption,
} from '@/services/productService'
import { formatCurrency } from '@/lib/utils'
import { Upload, X, Plus, Trash2, GripVertical, Image as ImageIcon, Package } from 'lucide-react'
import type { Product, Category, ProductVariant, VariantOption } from '@/types'

type Props = {
  storeId: string
  categories: Category[]
  product?: Product | null
}

export default function ProductForm({ storeId, categories, product }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Basic fields
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price || 0)
  const [categoryId, setCategoryId] = useState(product?.category_id || '')
  const [isActive, setIsActive] = useState(product?.is_active ?? true)

  // Images
  const [images, setImages] = useState(product?.images || [])
  const [uploading, setUploading] = useState(false)

  // Variants
  const [variants, setVariants] = useState<(ProductVariant & { options?: VariantOption[] })[]>(
    product?.variants || []
  )

  // New variant form
  const [newVariantName, setNewVariantName] = useState('')

  const [saving, setSaving] = useState(false)
  const isEditing = !!product

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    try {
      if (isEditing) {
        await updateProduct(product!.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          price: price,
          category_id: categoryId || null,
          is_active: isActive,
        })
        toast({ type: 'success', title: 'Produto atualizado' })
      } else {
        const newProduct = await createProduct({
          name: name.trim(),
          description: description.trim() || undefined,
          price: price,
          category_id: categoryId || null,
          store_id: storeId,
          is_active: isActive,
        })
        toast({ type: 'success', title: 'Produto criado' })
        router.push(`/admin/products/${newProduct.id}/edit`)
        return
      }
      router.push('/admin/products')
    } catch (err: any) {
      toast({ type: 'error', title: 'Erro ao salvar', description: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!product || !e.target.files?.length) return
    setUploading(true)
    try {
      for (const file of Array.from(e.target.files)) {
        const url = await uploadProductImage(file, product.id)
        setImages((prev) => [...prev, { id: Date.now().toString(), product_id: product.id, url, position: prev.length, created_at: '' }])
      }
      toast({ type: 'success', title: 'Imagem enviada' })
    } catch {
      toast({ type: 'error', title: 'Erro ao enviar imagem' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleDeleteImage(imageId: string) {
    try {
      await deleteProductImage(imageId)
      setImages((prev) => prev.filter((img) => img.id !== imageId))
      toast({ type: 'success', title: 'Imagem removida' })
    } catch {
      toast({ type: 'error', title: 'Erro ao remover imagem' })
    }
  }

  // --- Variants ---

  async function handleAddVariant() {
    if (!product || !newVariantName.trim()) return
    try {
      const v = await addVariant(product.id, newVariantName.trim())
      setVariants((prev) => [...prev, { ...v, options: [] }])
      setNewVariantName('')
      toast({ type: 'success', title: `Variação "${newVariantName}" criada` })
    } catch (err: any) {
      console.error('Erro ao adicionar variação:', err)
      toast({ type: 'error', title: 'Erro ao criar variação', description: err.message })
    }
  }

  async function handleDeleteVariant(variantId: string) {
    if (!confirm('Excluir esta variação e todas as suas opções?')) return
    try {
      await deleteVariant(variantId)
      setVariants((prev) => prev.filter((v) => v.id !== variantId))
      toast({ type: 'success', title: 'Variação excluída' })
    } catch {
      toast({ type: 'error', title: 'Erro ao excluir variação' })
    }
  }

  async function handleAddOption(variantId: string, optName: string, optPrice: number) {
    try {
      const opt = await addVariantOption(variantId, optName, optPrice)
      setVariants((prev) =>
        prev.map((v) =>
          v.id === variantId
            ? { ...v, options: [...(v.options || []), opt] }
            : v
        )
      )
    } catch {
      toast({ type: 'error', title: 'Erro ao adicionar opção' })
    }
  }

  async function handleDeleteOption(variantId: string, optionId: string) {
    try {
      await deleteVariantOption(optionId)
      setVariants((prev) =>
        prev.map((v) =>
          v.id === variantId
            ? { ...v, options: v.options?.filter((o) => o.id !== optionId) || [] }
            : v
        )
      )
    } catch {
      toast({ type: 'error', title: 'Erro ao remover opção' })
    }
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar produto' : 'Novo produto'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEditing ? 'Altere as informações do produto' : 'Preencha os dados do produto'}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left - Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações básicas</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Nome do produto"
                placeholder="Ex: Pizza Calabresa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Textarea
                label="Descrição"
                placeholder="Descreva o produto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
              <CurrencyInput
                label="Preço base"
                value={price}
                onChange={setPrice}
                required
              />
            </form>
          </Card>

          {/* Images - only for editing */}
          {isEditing && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagens</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {images.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-1.5 right-1.5 h-7 w-7 bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
                >
                  {uploading ? (
                    <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span className="text-xs">Upload</span>
                    </>
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-xs text-gray-400">A primeira imagem será a foto principal</p>
            </Card>
          )}

          {/* Variants - only for editing */}
          {isEditing && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Variações</h2>
              <p className="text-sm text-gray-600 mb-4">
                Adicione variações como Tamanho, Sabor, Cor. Cada opção pode ter um preço diferente.
              </p>

              {/* Instructions */}
              {variants.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Como funciona?</h3>
                  <ol className="text-sm text-blue-800 space-y-1.5 list-decimal list-inside">
                    <li>Digite o nome da variação (ex: "Tamanho", "Sabor")</li>
                    <li>Clique em "Adicionar variação"</li>
                    <li>Dentro da variação, adicione as opções (ex: "Pequeno", "Médio", "Grande")</li>
                    <li>Defina o preço de cada opção</li>
                  </ol>
                  <p className="text-xs text-blue-700 mt-3">
                    💡 Dica: Você pode ter múltiplas variações no mesmo produto (ex: Tamanho + Sabor)
                  </p>
                </div>
              )}

              {/* Existing variants */}
              <div className="space-y-4 mb-4">
                {variants.map((variant) => (
                  <VariantBlock
                    key={variant.id}
                    variant={variant}
                    onDelete={() => handleDeleteVariant(variant.id)}
                    onAddOption={(name, price) => handleAddOption(variant.id, name, price)}
                    onDeleteOption={(optId) => handleDeleteOption(variant.id, optId)}
                  />
                ))}
              </div>

              {/* Add new variant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {variants.length === 0 ? '1️⃣ Criar primeira variação' : 'Adicionar nova variação'}
                </label>
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Nome da variação (ex: Tamanho)"
                    value={newVariantName}
                    onChange={(e) => setNewVariantName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddVariant()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleAddVariant} 
                    disabled={!newVariantName.trim()}
                    className="whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {!isEditing && (
            <Card className="bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-800">
                Salve o produto primeiro para adicionar imagens e variações.
              </p>
            </Card>
          )}
        </div>

        {/* Right - Sidebar */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organização</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Sem categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${isActive ? 'bg-gray-900' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-5 w-5 rounded-full bg-white transition-transform shadow-sm ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                  <span className="text-sm text-gray-700">{isActive ? 'Ativo (visível na loja)' : 'Inativo (oculto)'}</span>
                </div>
              </div>
            </div>
          </Card>

          {isEditing && images.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Preview</h2>
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img src={images[0].url} alt="" className="w-full h-full object-cover" />
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Fixed Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => router.push('/admin/products')}>
            Cancelar
          </Button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base rounded-xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            {saving && <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            {isEditing ? 'Salvar alterações' : 'Criar produto'}
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Variant Block Component ---

function VariantBlock({
  variant,
  onDelete,
  onAddOption,
  onDeleteOption,
}: {
  variant: ProductVariant & { options?: VariantOption[] }
  onDelete: () => void
  onAddOption: (name: string, price: number) => void
  onDeleteOption: (optionId: string) => void
}) {
  const [optName, setOptName] = useState('')
  const [optPrice, setOptPrice] = useState(0)

  function handleAdd() {
    if (!optName.trim()) return
    onAddOption(optName.trim(), optPrice)
    setOptName('')
    setOptPrice(0)
  }

  const hasOptions = variant.options && variant.options.length > 0

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{variant.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {hasOptions ? `${variant.options!.length} opção(ões) cadastrada(s)` : 'Nenhuma opção cadastrada'}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete} title="Excluir variação">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      {/* Instructions when no options */}
      {!hasOptions && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 mb-3">
          <p className="text-sm font-semibold text-red-800 mb-1">
            ⚠️ Atenção: Esta variação não tem opções!
          </p>
          <p className="text-xs text-red-700">
            Adicione pelo menos uma opção abaixo (ex: Pequeno, Médio, Grande) ou delete esta variação.
          </p>
        </div>
      )}

      {/* Options list */}
      {hasOptions && (
        <div className="space-y-2 mb-3">
          {variant.options!.map((opt) => (
            <div key={opt.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5 border border-gray-200">
              <span className="text-sm font-medium text-gray-700">{opt.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(opt.price)}</span>
                <button
                  onClick={() => onDeleteOption(opt.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remover opção"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add option */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">
          Adicionar opção
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Nome (ex: Grande)"
            value={optName}
            onChange={(e) => setOptName(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAdd()
              }
            }}
          />
          <div className="w-32">
            <CurrencyInput
              value={optPrice}
              onChange={setOptPrice}
              placeholder="Preço"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleAdd} disabled={!optName.trim()} title="Adicionar opção">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
