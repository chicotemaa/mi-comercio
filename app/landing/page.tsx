"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Calendar,
  Users,
  CreditCard,
  BarChart3,
  MessageCircle,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Smartphone,
  Shield,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const features = [
    {
      icon: Calendar,
      title: "Gestión de Citas",
      description: "Sistema completo de reservas online con calendario inteligente y recordatorios automáticos.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Users,
      title: "Base de Clientes",
      description: "Administra tu cartera de clientes con historial completo, preferencias y comunicación directa.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: CreditCard,
      title: "Pagos Integrados",
      description: "Acepta pagos con Mercado Pago, tarjetas y efectivo. Facturación automática incluida.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: BarChart3,
      title: "Reportes Avanzados",
      description: "Analiza el rendimiento de tu negocio con reportes detallados y métricas en tiempo real.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: MessageCircle,
      title: "Marketing Automático",
      description: "Campañas por WhatsApp y email para fidelizar clientes y aumentar las ventas.",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Building2,
      title: "Multi-empleados",
      description: "Gestiona tu equipo con horarios personalizados, permisos y seguimiento de rendimiento.",
      color: "bg-indigo-100 text-indigo-600",
    },
  ]

  const benefits = [
    {
      icon: Zap,
      title: "Aumenta tus ventas hasta 40%",
      description: "Optimiza tu agenda y reduce los tiempos muertos con nuestro sistema inteligente.",
    },
    {
      icon: Clock,
      title: "Ahorra 10 horas semanales",
      description: "Automatiza tareas repetitivas y enfócate en lo que realmente importa: tus clientes.",
    },
    {
      icon: Smartphone,
      title: "Acceso desde cualquier lugar",
      description: "Gestiona tu negocio desde tu celular, tablet o computadora, 24/7.",
    },
    {
      icon: Shield,
      title: "Datos seguros y respaldados",
      description: "Tu información está protegida con encriptación de nivel bancario.",
    },
  ]

  const testimonials = [
    {
      name: "María González",
      business: "Salón de Belleza Elegance",
      rating: 5,
      comment:
        "Desde que uso ComercioFlow, mis ventas aumentaron 35%. La gestión de citas es súper fácil y mis clientes aman los recordatorios automáticos.",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Carlos Rodríguez",
      business: "Barbería Moderna",
      rating: 5,
      comment:
        "Increíble plataforma. Ahora puedo enfocarme en cortar cabello mientras el sistema maneja todo lo demás. Los reportes me ayudan a tomar mejores decisiones.",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Ana Martín",
      business: "Spa Relax",
      rating: 5,
      comment:
        "La integración con WhatsApp es genial. Mis clientes pueden reservar fácilmente y yo tengo todo organizado. ¡Recomendado al 100%!",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const plans = [
    {
      name: "Básico",
      price: "Gratis",
      period: "por siempre",
      description: "Perfecto para empezar",
      features: [
        "Hasta 50 citas por mes",
        "1 empleado",
        "Gestión básica de clientes",
        "Recordatorios por email",
        "Soporte por email",
      ],
      popular: false,
      cta: "Comenzar gratis",
    },
    {
      name: "Profesional",
      price: "$30.000",
      period: "por mes",
      description: "Para negocios en crecimiento",
      features: [
        "Citas ilimitadas",
        "Hasta 5 empleados",
        "Pagos integrados",
        "WhatsApp y email marketing",
        "Reportes avanzados",
        "Soporte prioritario",
      ],
      popular: true,
      cta: "Prueba 30 días gratis",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-slate-900 rounded-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ComercioFlow</h1>
              <p className="text-xs text-gray-600">comercioflow.com.ar</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/auth">
              <Button>Comenzar Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            🚀 Más de 10,000 negocios argentinos confían en nosotros
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transforma tu negocio de
            <span className="text-blue-600"> servicios</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            La plataforma todo-en-uno que necesitas para gestionar citas, clientes, pagos y hacer crecer tu salón de
            belleza, barbería, spa o centro estético en Argentina.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8 py-4">
                Comenzar gratis por 30 días
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
              Ver demo en vivo
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Sin tarjeta de crédito
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Configuración en 5 minutos
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Soporte en español
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Todo lo que necesitas en una sola plataforma</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Desde la reserva hasta el pago, gestiona cada aspecto de tu negocio con herramientas profesionales.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir ComercioFlow?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Resultados comprobados que transforman negocios como el tuyo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Miles de negocios argentinos ya transformaron su gestión con ComercioFlow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.comment}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.business}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Planes que se adaptan a tu negocio</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comienza gratis y escala según crezcas. Sin compromisos, sin sorpresas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-0 shadow-lg ${plan.popular ? "ring-2 ring-blue-500 scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">Más popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth">
                    <Button
                      className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para transformar tu negocio?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a miles de negocios argentinos que ya aumentaron sus ventas y mejoraron su gestión con ComercioFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                Comenzar gratis ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-gray-600 text-white hover:bg-gray-800 bg-transparent"
            >
              Hablar con un experto
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-6">30 días gratis • Sin tarjeta de crédito • Soporte incluido</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">ComercioFlow</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                La plataforma líder para la gestión de negocios de servicios en Argentina.
              </p>
              <p className="text-gray-400 text-xs">comercioflow.com.ar</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/ayuda" className="hover:text-white">
                    Centro de ayuda
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="hover:text-white">
                    Contacto
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Capacitación
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Estado del servicio
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/nosotros" className="hover:text-white">
                    Sobre nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/carreras" className="hover:text-white">
                    Carreras
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:text-white">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terminos" className="hover:text-white">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 ComercioFlow. Todos los derechos reservados. Argentina.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
