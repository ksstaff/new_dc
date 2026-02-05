
import React from 'react';

const StickyCTA: React.FC = () => {
  const scrollToForm = () => {
    document.getElementById('leads-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40 sm:hidden">
      <button
        onClick={scrollToForm}
        className="w-full py-4 bg-[#0050FF] text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all"
      >
        실시간 상담 신청하기
      </button>
    </div>
  );
};

export default StickyCTA;
