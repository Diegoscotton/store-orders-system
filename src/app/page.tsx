import Link from 'next/link'
import {
  Store, ShoppingCart, Package, Settings,
  MessageCircle, BarChart3, ArrowRight, Zap, Shield, Smartphone,
  CheckCircle, Clock, TrendingUp, Users, ChevronDown
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Fosfo Pedidos</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
            >
              Ver demo
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Começar agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 -z-10">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-purple-50/30 to-blue-50" />
          
          {/* Blobs animados maiores e mais coloridos */}
          <div className="absolute top-10 left-0 w-96 h-96 bg-gradient-to-br from-emerald-300 to-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
          
          {/* Cards flutuantes decorativos */}
          <div className="absolute top-32 right-[10%] w-48 h-32 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 rotate-6 opacity-80">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 bg-emerald-500 rounded-lg" />
              <div className="flex-1">
                <div className="h-2 w-20 bg-gray-200 rounded mb-1" />
                <div className="h-1.5 w-16 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded mb-1" />
            <div className="h-1.5 w-3/4 bg-gray-100 rounded" />
          </div>
          
          <div className="absolute bottom-32 left-[8%] w-40 h-40 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 -rotate-6 opacity-80">
            <div className="grid grid-cols-2 gap-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
          
          {/* Ícones decorativos maiores */}
          <div className="absolute top-24 right-[18%] opacity-[0.12] rotate-12">
            <ShoppingCart className="h-24 w-24 text-gray-900" />
          </div>
          <div className="absolute top-44 left-[10%] opacity-[0.12] -rotate-12">
            <Package className="h-28 w-28 text-gray-900" />
          </div>
          <div className="absolute bottom-24 right-[22%] opacity-[0.12] rotate-6">
            <Store className="h-32 w-32 text-gray-900" />
          </div>
          <div className="absolute top-60 right-[38%] opacity-[0.10] -rotate-6">
            <BarChart3 className="h-20 w-20 text-gray-900" />
          </div>
          <div className="absolute bottom-36 left-[18%] opacity-[0.10] rotate-12">
            <MessageCircle className="h-22 w-22 text-gray-900" />
          </div>
          <div className="absolute top-36 left-[35%] opacity-[0.08] -rotate-12">
            <TrendingUp className="h-18 w-18 text-gray-900" />
          </div>
          
          {/* Círculos decorativos maiores */}
          <div className="absolute top-28 left-[6%] w-4 h-4 bg-emerald-500 rounded-full opacity-50" />
          <div className="absolute top-56 right-[8%] w-3 h-3 bg-pink-500 rounded-full opacity-50" />
          <div className="absolute bottom-44 left-[28%] w-5 h-5 bg-blue-500 rounded-full opacity-50" />
          <div className="absolute top-40 right-[45%] w-3 h-3 bg-purple-500 rounded-full opacity-50" />
          <div className="absolute bottom-52 right-[15%] w-4 h-4 bg-cyan-500 rounded-full opacity-50" />
          
          {/* Linhas decorativas */}
          <div className="absolute top-36 left-[15%] w-24 h-0.5 bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-30 rotate-45" />
          <div className="absolute bottom-40 right-[20%] w-32 h-0.5 bg-gradient-to-r from-transparent via-pink-300 to-transparent opacity-30 -rotate-45" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full mb-4 sm:mb-6 border border-emerald-200">
            <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden xs:inline">Pronto em poucos minutos •</span>
            <span>Acesso liberado</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-4 sm:mb-6">
            Seu sistema de pedidos,
            <br />
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">com cara de loja</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
            Sistema completo para receber e organizar pedidos: catálogo de produtos com preço e variações, carrinho e gestão em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-medium px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-gray-800 transition-all text-sm sm:text-base shadow-lg shadow-gray-900/20 w-full sm:w-auto"
            >
              Começar agora
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-medium px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-gray-50 transition-all text-sm sm:text-base w-full sm:w-auto"
            >
              Ver demonstração
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
              <span>Sem burocracia</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
              <span>Configuração rápida</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
              <span>Suporte incluído</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Users, label: 'Lojas Ativas', value: '500+' },
              { icon: ShoppingCart, label: 'Pedidos/mês', value: '50K+' },
              { icon: Package, label: 'Produtos', value: '10K+' },
              { icon: TrendingUp, label: 'Crescimento', value: '300%' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Como funciona</h2>
            <p className="text-gray-500 text-lg">Três passos para começar a receber pedidos</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Configure seu sistema de pedidos',
                desc: 'Cadastre-se, escolha o nome da loja e personalize com sua marca.',
                icon: Store,
              },
              {
                step: '02',
                title: 'Cadastre produtos',
                desc: 'Adicione fotos, preços, variações e organize por categorias.',
                icon: Package,
              },
              {
                step: '03',
                title: 'Receba pedidos',
                desc: 'Seus clientes fazem pedidos e você gerencia tudo pelo painel.',
                icon: ShoppingCart,
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <span className="text-6xl font-bold text-gray-100 absolute -top-4 -left-2">{item.step}</span>
                <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="h-12 w-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot/Preview */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Veja o sistema em ação</h2>
            <p className="text-gray-500 text-lg">Interface moderna e intuitiva para você e seus clientes</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Loja Pública */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 flex flex-col">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 bg-pink-500 rounded-lg" />
                  <div>
                    <div className="h-2 w-24 bg-gray-200 rounded" />
                    <div className="h-1.5 w-32 bg-gray-100 rounded mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
                      <div className="h-2 w-full bg-gray-200 rounded mb-1" />
                      <div className="h-2 w-2/3 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-1">Página de pedidos</h3>
                <p className="text-sm text-gray-600 mb-3">Seus clientes escolhem e enviam pedidos</p>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:gap-2 transition-all"
                >
                  Ver demo ao vivo <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Painel Admin */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 flex flex-col">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-2 w-20 bg-gray-200 rounded" />
                  <div className="h-2 w-16 bg-emerald-200 rounded" />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                      <div className="h-2 w-8 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-12 bg-gray-300 rounded" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded p-2">
                      <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                      <div className="h-2 flex-1 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-1">Painel Admin</h3>
                <p className="text-sm text-gray-600 mb-3">Gerencie tudo em um só lugar</p>
                <Link
                  href="/demo-admin"
                  className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:gap-2 transition-all"
                >
                  Ver admin demo <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof com imagens reais */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Feito para pequenos produtores</h2>
            <p className="text-gray-500 text-lg">Confeitarias, docerias, artesãos e empreendedores locais</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=400&h=400&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop&auto=format',
            ].map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Centenas de pequenos negócios já estão vendendo online com o Fosfo Pedidos
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-medium px-6 py-3 rounded-xl hover:bg-gray-800 transition-all"
            >
              Começar agora <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Tudo que você precisa</h2>
            <p className="text-gray-500 text-lg">Funcionalidades pensadas para facilitar sua vida</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Store, title: 'Loja personalizada', desc: 'Logo, cores e banner com a identidade da sua marca' },
              { icon: Package, title: 'Produtos com variações', desc: 'Tamanhos, sabores, cores — cada um com seu preço' },
              { icon: ShoppingCart, title: 'Carrinho inteligente', desc: 'Seus clientes montam o pedido com facilidade' },
              { icon: MessageCircle, title: 'Pedido por WhatsApp', desc: 'Receba os pedidos direto no seu WhatsApp' },
              { icon: BarChart3, title: 'Painel completo', desc: 'Gerencie produtos, pedidos e métricas em um só lugar' },
              { icon: Smartphone, title: '100% responsivo', desc: 'Funciona perfeitamente no celular e computador' },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
                <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-gray-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Perguntas frequentes</h2>
            <p className="text-gray-500 text-lg">Tudo que você precisa saber</p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'Preciso pagar para começar?',
                a: 'Não! Você pode começar sem custo e testar o sistema na prática. Durante esse período, é possível criar sua página, adicionar produtos e receber pedidos normalmente.'
              },
              {
                q: 'Quanto tempo leva para criar minha loja?',
                a: 'Menos de 2 minutos! Basta fazer o cadastro, escolher o nome da sua loja e você já pode começar a adicionar produtos. É rápido e simples.'
              },
              {
                q: 'Como meus clientes fazem pedidos?',
                a: 'Seus clientes acessam sua loja pelo link único, navegam pelos produtos, adicionam ao carrinho e finalizam o pedido. Você recebe a notificação no painel e pode enviar para o WhatsApp automaticamente.'
              },
              {
                q: 'Posso personalizar a aparência da loja?',
                a: 'Sim! Você pode adicionar seu logo, escolher as cores da marca, criar banners personalizados e organizar produtos por categorias. Tudo para deixar a loja com a cara do seu negócio.'
              },
              {
                q: 'Funciona no celular?',
                a: 'Perfeitamente! Tanto a loja pública quanto o painel administrativo são 100% responsivos e funcionam muito bem em smartphones e tablets.'
              },
              {
                q: 'Posso ter produtos com variações?',
                a: 'Sim! Você pode criar variações como tamanhos, sabores, cores, etc. Cada variação pode ter seu próprio preço. Perfeito para lojas de alimentos, roupas e muito mais.'
              },
              {
                q: 'Tem limite de produtos ou pedidos?',
                a: 'Não! Você pode adicionar quantos produtos quiser e receber quantos pedidos seus clientes fizerem. Sem limites artificiais.'
              },
              {
                q: 'Como funciona a integração com WhatsApp?',
                a: 'Quando um cliente faz um pedido, você pode enviar os detalhes direto para o seu WhatsApp com um clique. A mensagem já vem formatada com todos os dados do pedido.'
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-semibold text-gray-900 pr-4">{faq.q}</h3>
                  <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 sm:p-16 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Comece a organizar seus pedidos hoje
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Junte-se a centenas de empreendedores que já estão usando o Fosfo Pedidos para crescer seus negócios.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-medium px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-all text-base shadow-lg"
            >
              Começar agora
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all text-base"
            >
              Ver demonstração
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            Sem burocracia • Configuração em minutos • Suporte incluído
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-gray-900 rounded flex items-center justify-center">
              <Store className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm text-gray-500">
              © 2026 Fosfo Pedidos. Todos os direitos reservados.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Demo
            </Link>
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <a
              href="https://fosfo.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Powered by Fosfo
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
