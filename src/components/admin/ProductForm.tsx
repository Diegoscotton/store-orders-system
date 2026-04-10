'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, Card, Badge, useToast, CurrencyInput } from '@/components/ui'
import {
  createProduct, updateProduct, uploadProductImage, deleteProductImage,
  addVariant, updateVariant, deleteVariant,
  addVariantOption, updateVariantOption, deleteVariantOption, toggleVariantOptionActive,
} from '@/services/productService'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import { Upload, X, Plus, Trash2, GripVertical, Image as ImageIcon, Package, Star, Eye, EyeOff } from 'lucide-react'
import type { Product, Category, ProductVariant, VariantOption } from '@/types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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

  // Track changes
  useEffect(() => {
    const hasFieldChanges = 
      name !== (product?.name || '') ||
      description !== (product?.description || '') ||
      price !== (product?.price || 0) ||
      categoryId !== (product?.category_id || '') ||
      isActive !== (product?.is_active ?? true)
    
    // Check if image order changed
    const originalPositions = (product?.images || []).map(img => img.id).join(',')
    const currentPositions = images.map(img => img.id).join(',')
    const hasImageChanges = originalPositions !== currentPositions
    
    setHasChanges(hasFieldChanges || hasImageChanges)
  }, [name, description, price, categoryId, isActive, product, images])

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
  const [showVariantAlert, setShowVariantAlert] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [hasImageChanges, setHasImageChanges] = useState(false)
  const isEditing = !!product

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Limpar alerta quando variantes mudarem
  useEffect(() => {
    const hasAllVariantsWithOptions = variants.every(v => v.options && v.options.length > 0)
    if (hasAllVariantsWithOptions) {
      setShowVariantAlert(false)
    }
  }, [variants])

  // Handle drag end for images
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id)
      const newIndex = images.findIndex((img) => img.id === over?.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newImages = arrayMove(images, oldIndex, newIndex)
        setImages(newImages)
        setHasImageChanges(true)
        toast({ type: 'success', title: 'Ordem atualizada visualmente' })
      }
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    // Verificar se há variantes sem opções
    const variantsWithoutOptions = variants.filter(v => !v.options || v.options.length === 0)
    if (variantsWithoutOptions.length > 0) {
      setShowVariantAlert(true)
      // Scroll para a primeira variação sem opções
      setTimeout(() => {
        const firstVariantElement = document.getElementById(`variant-${variantsWithoutOptions[0].id}`)
        if (firstVariantElement) {
          firstVariantElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      return
    }

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

        // Save image positions - simplified approach
        try {
          console.log('=== SALVANDO POSIÇÕES DAS IMAGENS ===')
          
          // Update all images in batch using Supabase directly
          const supabase = createClient()
          const updates = images.map((img, index) => ({
            id: img.id,
            position: index
          }))
          
          console.log('Updates to perform:', updates)
          
          // Update each image individually
          for (const update of updates) {
            const { error } = await supabase
              .from('product_images')
              .update({ position: update.position })
              .eq('id', update.id)
              
            if (error) {
              console.error(`Error updating image ${update.id}:`, error)
              throw error
            }
          }
          
          console.log('=== POSIÇÕES SALVAS COM SUCESSO ===')
          setHasImageChanges(false)
          toast({ type: 'success', title: 'Ordem das imagens salva' })
        } catch (posError) {
          console.error('Error saving image positions:', posError)
          toast({ type: 'error', title: 'Erro ao salvar ordem das imagens' })
        }

        toast({ type: 'success', title: 'Produto atualizado' })
        
        // Força reload da página de produtos para garantir dados atualizados
        setTimeout(() => {
          router.push('/admin/products')
        }, 100)
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

  async function handleToggleOption(optionId: string, currentActive: boolean) {
    try {
      const newState = !currentActive
      await toggleVariantOptionActive(optionId, newState)
      setVariants((prev) =>
        prev.map((v) => ({
          ...v,
          options: v.options?.map((o) =>
            o.id === optionId ? { ...o, is_active: newState } : o
          ),
        }))
      )
      toast({
        type: newState ? 'success' : 'info',
        title: newState ? 'Opção ativada' : 'Opção desativada',
        description: newState ? 'A opção está disponível novamente' : 'A opção não aparecerá na loja',
      })
    } catch {
      toast({ type: 'error', title: 'Erro ao alterar status da opção' })
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Imagens</h2>
                <p className="text-xs text-gray-400">
                  <GripVertical className="h-3 w-3 inline mr-1" />
                  Arraste para reorganizar
                </p>
              </div>
              
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={images.map(img => img.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                    {images.map((img, index) => (
                      <SortableImageItem
                        key={img.id}
                        image={img}
                        isFirst={index === 0}
                        onDelete={() => handleDeleteImage(img.id)}
                      />
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
                </SortableContext>
              </DndContext>
              
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
                    onToggleOption={handleToggleOption}
                    showAlert={showVariantAlert && (!variant.options || variant.options.length === 0)}
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

      {/* Fixed Footer Actions - Show only when there are changes or creating new product */}
      {(hasChanges || hasImageChanges || !isEditing) && (
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
          <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => router.push('/admin/products')}
              className="w-full md:w-auto"
            >
              Cancelar
            </Button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-base rounded-xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              {saving && <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
              {isEditing ? 'Salvar alterações' : 'Criar produto'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Sortable Image Component ---

function SortableImageItem({ 
  image, 
  isFirst, 
  onDelete 
}: { 
  image: any
  isFirst: boolean
  onDelete: () => void 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 group ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 z-10 h-8 w-8 bg-black/50 text-white rounded-lg flex items-center justify-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Principal badge */}
      {isFirst && (
        <div className="absolute top-1 right-1 z-10 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="h-3 w-3 fill-current" />
          Principal
        </div>
      )}

      {/* Image */}
      <img src={image.url} alt="" className="w-full h-full object-cover" />

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute bottom-1 right-1 z-10 h-7 w-7 bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// --- Variant Block Component ---

function VariantBlock({
  variant,
  onDelete,
  onAddOption,
  onDeleteOption,
  onToggleOption,
  showAlert,
}: {
  variant: ProductVariant & { options?: VariantOption[] }
  onDelete: () => void
  onAddOption: (name: string, price: number) => void
  onDeleteOption: (optionId: string) => void
  onToggleOption: (optionId: string, currentState: boolean) => void
  showAlert: boolean
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
    <div id={`variant-${variant.id}`} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
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

      {/* Instructions when no options - aparece apenas com alerta */}
      {!hasOptions && showAlert && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 animate-in fade-in duration-300 slide-in-from-top-2">
          <p className="text-sm font-semibold text-amber-800 mb-1">
            ⚠️ Atenção: Esta variação não tem opções!
          </p>
          <p className="text-xs text-amber-700">
            Adicione pelo menos uma opção abaixo (ex: Pequeno, Médio, Grande) ou delete esta variação.
          </p>
        </div>
      )}

      {/* Options list */}
      {hasOptions && (
        <div className="space-y-2 mb-3">
          {variant.options!.map((opt) => (
            <div 
              key={opt.id} 
              className={`flex items-center justify-between bg-white rounded-lg px-3 py-2.5 border border-gray-200 transition-opacity ${
                opt.is_active === false ? 'opacity-50' : ''
              }`}
            >
              <span className={`text-sm font-medium text-gray-700 ${opt.is_active === false ? 'line-through' : ''}`}>
                {opt.name}
                {opt.is_active === false && (
                  <Badge variant="secondary" className="ml-2 text-xs">Indisponível</Badge>
                )}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(opt.price)}</span>
                <button
                  onClick={() => onToggleOption(opt.id, opt.is_active !== false)}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                  title={opt.is_active === false ? 'Opção oculta na loja — clique para ativar' : 'Opção visível na loja — clique para ocultar'}
                >
                  {opt.is_active === false ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
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
          <Button variant="outline" onClick={handleAdd} disabled={!optName.trim()} title="Adicionar opção">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  )
}
