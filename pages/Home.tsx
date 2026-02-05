
import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SiteSettings, Product, CaseStudy, Notice } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../constants';
import LeadForm from '../components/LeadForm';
import KakaoFloatingButton from '../components/KakaoFloatingButton';
import StickyCTA from '../components/StickyCTA';
import { ChevronDown, ChevronUp, ExternalLink, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeNotice, setActiveNotice] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Settings
      const setSnap = await getDocs(collection(db, 'siteSettings'));
      if (!setSnap.empty) setSettings(setSnap.docs[0].data() as SiteSettings);

      // Products
      const prodSnap = await getDocs(query(collection(db, 'products'), where('isActive', '==', true), orderBy('order', 'asc')));
      setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Product));

      // Cases
      const caseSnap = await getDocs(query(collection(db, 'cases'), where('isActive', '==', true), orderBy('order', 'asc')));
      setCases(caseSnap.docs.map(d => ({ id: d.id, ...d.data() }) as CaseStudy));

      // Notices
      const noticeSnap = await getDocs(query(collection(db, 'notices'), where('isActive', '==', true), orderBy('isFixed', 'desc'), orderBy('createdAt', 'desc'), limit(8)));
      setNotices(noticeSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Notice));
    };
    fetchData();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-600">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg" /> {/* Logo placeholder */}
            <span className="font-bold text-lg sm:text-xl tracking-tight">등촌샤브칼국수</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline font-semibold text-slate-500">KT 공식 파트너</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            {['partnership', 'products', 'cases', 'notices'].map(id => (
              <button key={id} onClick={() => scrollTo(id)} className="hover:text-blue-600 transition-colors uppercase">
                {id === 'partnership' ? '파트너십' : id === 'products' ? '혜택/상품' : id === 'cases' ? '설치사례' : '공지사항'}
              </button>
            ))}
            <button 
              onClick={() => scrollTo('leads-section')}
              className="bg-[#0050FF] text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              상담 신청
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-4">
            {['partnership', 'products', 'cases', 'notices'].map(id => (
              <button 
                key={id} 
                onClick={() => scrollTo(id)} 
                className="block w-full text-left font-semibold text-slate-700 py-2"
              >
                {id === 'partnership' ? '파트너십' : id === 'products' ? '혜택/상품' : id === 'cases' ? '설치사례' : '공지사항'}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-32 px-6 overflow-hidden min-h-[80vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center -z-10 brightness-[0.85]" 
          style={{ backgroundImage: `url(${settings.hero.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent -z-10" />
        
        <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-2xl text-white">
            <div className="flex flex-wrap gap-2 mb-6">
              {settings.hero.badges.map((badge, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                  {badge}
                </span>
              ))}
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-[1.15] whitespace-pre-line">
              {settings.hero.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 mb-10 leading-relaxed font-medium">
              {settings.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollTo('leads-section')}
                className="px-8 py-4 bg-[#0050FF] text-white font-bold rounded-2xl shadow-xl hover:bg-blue-600 transition-all active:scale-95"
              >
                {settings.hero.cta1}
              </button>
              <button 
                onClick={() => scrollTo('products')}
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 font-bold rounded-2xl hover:bg-white/20 transition-all active:scale-95"
              >
                {settings.hero.cta2}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership */}
      <section id="partnership" className="py-20 sm:py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 whitespace-pre-line leading-tight">
            {settings.partnership.title}
          </h2>
          <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
            {settings.partnership.description}
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {settings.partnership.cards.map((card, idx) => (
            <div key={idx} className="p-8 sm:p-10 bg-slate-50 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 border border-transparent hover:border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 font-bold text-xl">
                0{idx + 1}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4">{card.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{card.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-20 sm:py-32 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">가맹점 전용 특별 상품</h2>
          <p className="text-slate-500 font-medium">오직 등촌샤브칼국수에서만 누릴 수 있는 KT 제휴 혜택</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {(products.length > 0 ? products : [
            { id: 'hiorder', name: '하이오더', description: '매출을 올리는 스마트한 테이블 오더', points: ['선불/후불 완벽 지원', '국내 최저가 수수료', '24시간 원격 지원'], tags: ['강력추천', '비용절감'], imageUrl: 'https://picsum.photos/400/300?random=11' },
            { id: 'internet', name: '매장 인터넷/WiFi', description: '끊김 없는 안정적인 통신 인프라', points: ['GiGA 비즈 인터넷', '보안 안심 WiFi', 'POS 전용 라인 확보'], tags: ['필수설치'], imageUrl: 'https://picsum.photos/400/300?random=12' },
            { id: 'robot', name: 'KT 서빙로봇', description: '인건비 부담을 덜어주는 최고의 파트너', points: ['정밀 자율 주행', '멀티 서빙 지원', '전담 AS 서비스'], tags: ['인기상품'], imageUrl: 'https://picsum.photos/400/300?random=13' }
          ] as Product[]).map(product => (
            <div key={product.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
              <img loading="lazy" src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-8">
                <div className="flex gap-2 mb-4">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md">{tag}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">{product.description}</p>
                <ul className="space-y-3 mb-8">
                  {product.points.map((p, i) => (
                    <li key={i} className="flex items-center text-sm font-semibold text-slate-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3" />
                      {p}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => {
                    setSelectedProduct(product.id);
                    scrollTo('leads-section');
                  }}
                  className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  이 상품 상담받기
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cases */}
      <section id="cases" className="py-20 sm:py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">전국 등촌샤브칼국수 설치 사례</h2>
          <p className="text-slate-500 font-medium">이미 많은 사장님들이 KT와 함께하고 있습니다.</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {(cases.length > 0 ? cases : Array.from({length: 4}).map((_, i) => ({
            id: i.toString(),
            title: `OO점 설치 완료`,
            description: '하이오더 24대 설치',
            images: [`https://picsum.photos/600/600?random=${i + 20}`]
          })) as any[]).map(c => (
            <div key={c.id} className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer">
              <img loading="lazy" src={c.images[0]} alt={c.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white font-bold text-sm sm:text-base">{c.title}</p>
                <p className="text-white/70 text-xs">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notices */}
      <section id="notices" className="py-20 sm:py-32 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 text-center">공지사항 및 뉴스</h2>
          <div className="space-y-4">
            {notices.map(notice => (
              <div key={notice.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <button 
                  onClick={() => setActiveNotice(activeNotice === notice.id ? null : notice.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center space-x-4">
                    {notice.isFixed && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-extrabold rounded uppercase tracking-tighter">HOT</span>
                    )}
                    <span className="font-bold text-slate-800 line-clamp-1">{notice.title}</span>
                  </div>
                  {activeNotice === notice.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </button>
                {activeNotice === notice.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-50 animate-in slide-in-from-top-2">
                    <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap mb-4">
                      {notice.content}
                    </div>
                    {notice.imageUrl && <img src={notice.imageUrl} alt="공지 이미지" className="rounded-xl w-full max-w-md" />}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <section id="leads-section" className="py-20 sm:py-32 px-6 bg-[#0050FF]/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-8 leading-tight">
              지금 상담 신청하고<br />
              <span className="text-[#0050FF]">특별 혜택을 선점하세요</span>
            </h2>
            <div className="space-y-6">
              {[
                "상담 후 24시간 이내 맞춤형 견적 제공",
                "가맹점 전용 초기 설치비 면제 혜택",
                "하이오더 전용 홍보물 키트 무상 증정"
              ].map((text, i) => (
                <div key={i} className="flex items-center justify-center md:justify-start space-x-3 text-lg font-semibold text-slate-600">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">✓</div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 w-full">
            <LeadForm initialProduct={selectedProduct} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-500 py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-xl mb-2">등촌샤브칼국수 x KT</h4>
            <p className="text-sm">KT 전국 공식 비즈니스 파트너 센터</p>
            <p className="text-xs mt-4">© 2024 Partnership Portal. All Rights Reserved.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex space-x-6 text-sm font-medium">
              <Link to="/admin" className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                관리자 로그인 <ExternalLink size={14} />
              </Link>
            </div>
            <p className="text-xs">상담문의: 1551-8991</p>
          </div>
        </div>
      </footer>

      <KakaoFloatingButton />
      <StickyCTA />
    </div>
  );
};

export default Home;
