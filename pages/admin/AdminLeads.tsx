
import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Lead, LeadStatus } from '../../types';
import { STATUS_COLORS } from '../../constants';
import { Search, Download, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'leads'), orderBy('createdAt', 'desc')));
    setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Lead));
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: LeadStatus) => {
    await updateDoc(doc(db, 'leads', id), { status });
    fetchLeads();
  };

  const handleUpdateMemo = async (id: string, memo: string) => {
    await updateDoc(doc(db, 'leads', id), { memo });
    alert('메모가 저장되었습니다.');
    fetchLeads();
  };

  const handleDelete = async (id: string) => {
    if (confirm('이 상담 내역을 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'leads', id));
      fetchLeads();
    }
  };

  const exportToCSV = () => {
    const headers = ['매장명', '연락처', '상품', '지역', '시간', '문의내용', '상태', '등록일'];
    const rows = leads.map(l => [
      l.storeName,
      l.phone,
      l.products.join(', '),
      l.region,
      l.preferredTime,
      l.message,
      l.status,
      new Date(l.createdAt).toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(l => 
    l.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold">상담 리드 관리</h1>
        <button 
          onClick={exportToCSV}
          className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm"
        >
          <Download size={18} />
          <span>CSV 다운로드</span>
        </button>
      </div>

      <div className="mb-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="매장명 또는 연락처로 검색"
          className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-slate-400 bg-slate-50 uppercase tracking-widest">
                <th className="px-8 py-5">매장/일시</th>
                <th className="px-8 py-5">연락처/지역</th>
                <th className="px-8 py-5">상담 상품</th>
                <th className="px-8 py-5">상태</th>
                <th className="px-8 py-5">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-extrabold text-slate-900">{lead.storeName}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">{new Date(lead.createdAt).toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-700">{lead.phone}</p>
                    <p className="text-xs font-medium text-slate-500">{lead.region || '-'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1">
                      {lead.products.map(p => (
                        <span key={p} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-extrabold">{p}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <select
                      className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg border-none outline-none ${STATUS_COLORS[lead.status]}`}
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                    >
                      {Object.values(LeadStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="메모/상세"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">
                    상담 리드가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-extrabold">{selectedLead.storeName}</h2>
                  <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">Lead Details</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 mb-4 uppercase">상담 기본 정보</p>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div><p className="text-slate-400 font-medium mb-1">지역</p><p className="font-bold">{selectedLead.region || '미입력'}</p></div>
                    <div><p className="text-slate-400 font-medium mb-1">희망시간</p><p className="font-bold">{selectedLead.preferredTime || '미입력'}</p></div>
                    <div className="col-span-2"><p className="text-slate-400 font-medium mb-1">문의내용</p><p className="font-bold leading-relaxed">{selectedLead.message || '내용 없음'}</p></div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">상담 관리 메모</label>
                  <textarea
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-medium"
                    rows={4}
                    placeholder="통화 내용이나 특이사항을 기록하세요."
                    defaultValue={selectedLead.memo}
                    onBlur={(e) => handleUpdateMemo(selectedLead.id, e.target.value)}
                  />
                  <p className="text-[10px] text-slate-400 mt-2 text-right font-bold italic">입력 후 포커스를 해제하면 자동 저장됩니다.</p>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  닫기
                </button>
                <button 
                   onClick={() => {
                    handleUpdateStatus(selectedLead.id, LeadStatus.COMPLETED);
                    setSelectedLead(null);
                   }}
                  className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 size={18} />
                  <span>상담 완료 처리</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const X = ({ size, color }: { size: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={color}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default AdminLeads;
