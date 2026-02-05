
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PRODUCT_OPTIONS } from '../constants';
import { LeadStatus } from '../types';

interface LeadFormProps {
  initialProduct?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ initialProduct }) => {
  const [formData, setFormData] = useState({
    storeName: '',
    phone: '',
    products: initialProduct ? [initialProduct] : [] as string[],
    region: '',
    preferredTime: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.products.length === 0) {
      alert('상담받으실 상품을 하나 이상 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        status: LeadStatus.NEW,
        memo: '',
        createdAt: Date.now()
      });
      setIsSuccess(true);
      setFormData({
        storeName: '',
        phone: '',
        products: [],
        region: '',
        preferredTime: '',
        message: ''
      });
    } catch (error) {
      console.error(error);
      alert('제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleProduct = (id: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(id) 
        ? prev.products.filter(p => p !== id)
        : [...prev.products, id]
    }));
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-gray-100">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-4">상담 신청 완료</h3>
        <p className="text-slate-500 mb-8 leading-relaxed">
          등촌샤브칼국수 전담팀에서 확인 후<br />곧 연락드리겠습니다. 감사합니다.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="px-8 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl"
        >
          확인
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">매장명 (필수)</label>
          <input
            required
            type="text"
            placeholder="등촌샤브칼국수 OO점"
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={formData.storeName}
            onChange={e => setFormData({...formData, storeName: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">연락처 (필수)</label>
          <input
            required
            type="tel"
            placeholder="010-0000-0000"
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-3 text-slate-700">상담 요청 상품 (복수 선택 가능)</label>
          <div className="grid grid-cols-1 gap-2">
            {PRODUCT_OPTIONS.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleProduct(option.id)}
                className={`flex items-center px-4 py-3 rounded-xl border-2 transition-all text-left ${
                  formData.products.includes(option.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                    : 'border-slate-100 bg-white text-slate-500'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  formData.products.includes(option.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-300'
                }`}>
                  {formData.products.includes(option.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700">지역 (선택)</label>
            <input
              type="text"
              placeholder="서울시 강남구"
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              value={formData.region}
              onChange={e => setFormData({...formData, region: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700">희망 연락시간</label>
            <input
              type="text"
              placeholder="오후 2시 이후"
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              value={formData.preferredTime}
              onChange={e => setFormData({...formData, preferredTime: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">문의내용 (선택)</label>
          <textarea
            rows={3}
            placeholder="추가로 궁금하신 사항을 적어주세요."
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
          />
        </div>

        <button
          disabled={isSubmitting}
          className="w-full py-4 bg-[#0050FF] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] disabled:bg-slate-300 transition-all duration-300"
        >
          {isSubmitting ? '신청 중...' : '혜택 받고 상담 신청하기'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
