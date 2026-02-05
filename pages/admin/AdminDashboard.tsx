
import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Lead, LeadStatus } from '../../types';
import { Inbox, UserCheck, Clock, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0 });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, 'leads'));
      const leads = snap.docs.map(d => d.data() as Lead);
      setStats({
        total: leads.length,
        new: leads.filter(l => l.status === LeadStatus.NEW).length,
        contacted: leads.filter(l => l.status === LeadStatus.CONTACTED).length
      });

      const recentSnap = await getDocs(query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(5)));
      setRecentLeads(recentSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Lead));
    };
    fetchData();
  }, []);

  const cards = [
    { label: '전체 상담', value: stats.total, icon: Inbox, color: 'bg-blue-500' },
    { label: '미확인 신규', value: stats.new, icon: Clock, color: 'bg-orange-500' },
    { label: '연락 완료', value: stats.contacted, icon: UserCheck, color: 'bg-green-500' },
    { label: '전환율', value: '12%', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">대시보드</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center space-x-6">
            <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-100`}>
              <card.icon size={28} />
            </div>
            <div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">{card.label}</p>
              <p className="text-3xl font-extrabold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-extrabold text-xl">최근 상담 신청</h2>
            <button className="text-sm font-bold text-blue-600">전체보기</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-400 bg-slate-50 uppercase tracking-widest">
                  <th className="px-8 py-4">매장명</th>
                  <th className="px-8 py-4">연락처</th>
                  <th className="px-8 py-4">상품</th>
                  <th className="px-8 py-4">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 font-bold">{lead.storeName}</td>
                    <td className="px-8 py-5 text-slate-500 text-sm">{lead.phone}</td>
                    <td className="px-8 py-5">
                      <div className="flex gap-1">
                        {lead.products.map(p => (
                          <span key={p} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold">{p}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        lead.status === LeadStatus.NEW ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <h2 className="font-extrabold text-xl mb-6">시스템 안내</h2>
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 mb-2">오늘의 주요 일정</p>
              <p className="text-sm font-bold">오후 2시: KT 하이오더 프로모션 공지 업데이트 예정</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-xs font-bold text-blue-400 mb-2">관리자 도움말</p>
              <p className="text-sm font-bold text-blue-900 leading-relaxed">상담 완료 건은 상태를 '완료'로 변경하여 효율적인 리드 관리를 시작하세요.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
