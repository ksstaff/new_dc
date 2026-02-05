
import React, { useEffect, useState } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { SiteSettings } from '../../types';
import { DEFAULT_SITE_SETTINGS } from '../../constants';
import { uploadFile } from '../../lib/storage';
import { Save, RefreshCcw, Plus, Trash2 } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const snap = await getDocs(collection(db, 'siteSettings'));
    if (!snap.empty) {
      setSettings({ id: snap.docs[0].id, ...snap.docs[0].data() } as SiteSettings);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    let heroUrl = settings.hero.imageUrl;
    if (heroFile) {
      heroUrl = await uploadFile(heroFile, 'hero');
    }

    const payload = {
      ...settings,
      hero: { ...settings.hero, imageUrl: heroUrl }
    };

    await setDoc(doc(db, 'siteSettings', settings.id || 'default'), payload);
    alert('설정이 저장되었습니다.');
    setLoading(false);
  };

  const addPartnershipCard = () => {
    const newCards = [
      ...settings.partnership.cards,
      { title: '', content: '' }
    ];
    setSettings({
      ...settings,
      partnership: { ...settings.partnership, cards: newCards }
    });
  };

  const removePartnershipCard = (index: number) => {
    if (settings.partnership.cards.length <= 1) {
      alert('최소 1개의 카드는 유지해야 합니다.');
      return;
    }
    const newCards = settings.partnership.cards.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      partnership: { ...settings.partnership, cards: newCards }
    });
  };

  const updateCardTitle = (index: number, title: string) => {
    const newCards = [...settings.partnership.cards];
    newCards[index].title = title;
    setSettings({
      ...settings,
      partnership: { ...settings.partnership, cards: newCards }
    });
  };

  const updateCardContent = (index: number, content: string) => {
    const newCards = [...settings.partnership.cards];
    newCards[index].content = content;
    setSettings({
      ...settings,
      partnership: { ...settings.partnership, cards: newCards }
    });
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900">사이트 설정</h1>
        <div className="flex space-x-3">
          <button 
            onClick={fetchSettings}
            className="p-3 bg-white border border-gray-100 rounded-xl text-slate-500 hover:text-blue-600 transition-colors shadow-sm"
          >
            <RefreshCcw size={20} />
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:bg-slate-300"
          >
            <Save size={20} />
            <span>{loading ? '저장 중...' : '변경사항 저장'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-12 pb-20">
        {/* Hero Section */}
        <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h2 className="text-xl font-extrabold mb-8 flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3" />
            메인 히어로 관리
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">배경 이미지</label>
                <div className="mt-1 flex items-center space-x-4">
                  <img src={settings.hero.imageUrl} className="w-32 h-20 object-cover rounded-xl border border-gray-100" />
                  <input 
                    type="file" 
                    onChange={e => setHeroFile(e.target.files?.[0] || null)} 
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">메인 타이틀 (줄바꿈 \n 사용)</label>
                <textarea 
                  rows={2}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg"
                  value={settings.hero.title}
                  onChange={e => setSettings({...settings, hero: {...settings.hero, title: e.target.value}})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">서브 문구</label>
                <input 
                  type="text"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={settings.hero.subtitle}
                  onChange={e => setSettings({...settings, hero: {...settings.hero, subtitle: e.target.value}})}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Section */}
        <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-extrabold flex items-center">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3" />
              파트너십 섹션 관리
            </h2>
            <button 
              onClick={addPartnershipCard}
              className="flex items-center space-x-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors"
            >
              <Plus size={16} />
              <span>카드 추가</span>
            </button>
          </div>
          
          <div className="space-y-6">
             <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">섹션 타이틀</label>
                <textarea 
                  rows={2}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg"
                  value={settings.partnership.title}
                  onChange={e => setSettings({...settings, partnership: {...settings.partnership, title: e.target.value}})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settings.partnership.cards.map((card, idx) => (
                  <div key={idx} className="relative p-6 bg-slate-50 rounded-2xl space-y-4 group">
                    <button 
                      onClick={() => removePartnershipCard(idx)}
                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                    <p className="font-bold text-blue-600 text-xs uppercase tracking-widest">Card #{idx + 1}</p>
                    <input 
                      placeholder="카드 제목"
                      className="w-full px-4 py-2 bg-white rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
                      value={card.title}
                      onChange={e => updateCardTitle(idx, e.target.value)}
                    />
                    <textarea 
                      placeholder="카드 내용"
                      rows={3}
                      className="w-full px-4 py-2 bg-white rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-600 resize-none"
                      value={card.content}
                      onChange={e => updateCardContent(idx, e.target.value)}
                    />
                  </div>
                ))}
              </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminSettings;
