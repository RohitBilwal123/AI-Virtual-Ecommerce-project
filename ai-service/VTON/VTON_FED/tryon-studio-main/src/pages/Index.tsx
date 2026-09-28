import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Camera, Shirt, Zap, Star, ShoppingBag, Users, Award } from 'lucide-react';

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
            <Zap className="h-3.5 w-3.5" /> AI-Powered Virtual Try-On
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
            See How Clothes Look{' '}
            <span className="text-blue-600">Before You Buy</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
            multi-model AI technology — powered by AuraFit engines running in parallel.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-base px-8" asChild>
              <Link to="/tryon">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8" asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How AuraFit Works</h2>
            <p className="text-gray-500 mt-2">Three simple steps to your perfect virtual try-on</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Camera, step: '01', title: 'Upload Your Photo', desc: 'Take or upload a clear, front-facing full-body photo. Our AI works best with good lighting.' },
              { icon: Shirt, step: '02', title: 'Choose Your Style', desc: 'Pick gender and garment category. Our AI auto-detects your body type for the best fit.' },
              { icon: Zap, step: '03', title: 'See the Magic', desc: 'AuraFit engines run in parallel to generate 10 photorealistic try-on results in seconds.' },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="relative bg-gray-50 rounded-2xl border border-gray-100 p-7 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="absolute right-5 top-5 text-5xl font-black text-gray-200 select-none">{step}</div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Zap, value: 'AI', label: 'Models' },
              { icon: ShoppingBag, value: '500+', label: 'Garments' },
              { icon: Users, value: '10K+', label: 'Happy Users' },
              { icon: Star, value: '4.9', label: 'Rating' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <Icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-extrabold text-gray-900">{value}</div>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="mx-auto max-w-2xl text-center">
          <Award className="h-12 w-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Transform Your Shopping?</h2>
          <p className="text-blue-100 mb-8">
            Join thousands of users experiencing the future of online fashion with AuraFit.
          </p>
          <Button size="lg" variant="secondary" className="text-blue-700 font-semibold px-8" asChild>
            <Link to="/auth?mode=signup">Create Free Account <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
