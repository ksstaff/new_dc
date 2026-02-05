
import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Notice } from '../../types';
import { uploadFile } from '../../lib/storage';
import { Plus, Trash2, Edit2, Pin } from 'lucide-react';

const AdminNotices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<Partial<Notice> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const snap = await getDocs(query(collection(db, 'notices'), orderBy('isFixed', 'desc'), orderBy('createdAt', 'desc')));
    setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Notice));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = currentNotice?.imageUrl || '';
    if (imageFile) {
      imageUrl = await uploadFile(imageFile, 'notices');
    }

    const payload = {
      title: currentNotice?.title,
      content: currentNotice?.content,
      imageUrl,
      isFixed: currentNotice?.isFixed || false,
      isActive: currentNotice?.isActive ?? true,
      createdAt: currentNotice?.id ? currentNotice.createdAt : Date.now()
    };

    if (currentNotice?.id) {
      await updateDoc(doc(db, 'notices', currentNotice.id), payload);
    } else {
      await addDoc(collection(db, 'notices'), payload);
    }

    setIsEditing(false);
    setImageFile(null);
    setCurrentNotice(null);
    fetchNotices();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('이 공지사항을 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'notices', id));
      fetchNotices();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold">공지사항 관리</h1>
        <button 
          onClick={() => {
            setCurrentNotice({ isFixed: false, isActive: true });
            setIsEditing(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} />
          <span>신규 공지 등록</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {notices.map(notice => (
          <div key={notice.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:bg-slate-50/30 transition-colors">
            <div className="flex items-center space-x-4">
              {notice.isFixed && <Pin size={18} className="text-red-500 fill-red-500" />}
              <div>
                <h3 className="font-bold text-slate-800">{notice.title}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1">{new Date(notice.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  setCurrentNotice(notice);
                  setIsEditing(true);
                }}
                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(notice.id)}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <form onSubmit={handleSave} className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-extrabold mb-8">{currentNotice?.id ? '공지사항 수정' : '신규 공지 등록'}</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">제목</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                  value={currentNotice?.title || ''}
                  onChange={e => setCurrentNotice({...currentNotice, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">내용</label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  value={currentNotice?.content || ''}
                  onChange={e => setCurrentNotice({...currentNotice, content: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-8">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={currentNotice?.isFixed || false}
                    onChange={e => setCurrentNotice({...currentNotice, isFixed: e.target.checked})}
                  />
                  <span className="text-sm font-bold text-slate-700">상단 고정 공지</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={currentNotice?.isActive ?? true}
                    onChange={e => setCurrentNotice({...currentNotice, isActive: e.target.checked})}
                  />
                  <span className="text-sm font-bold text-slate-700">활성화(게시)</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">이미지 첨부 (선택)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all"
              >
                취소
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:bg-slate-300"
              >
                {loading ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminNotices;
