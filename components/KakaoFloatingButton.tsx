
import React from 'react';
import { MessageCircle } from 'lucide-react';

const KakaoFloatingButton: React.FC = () => {
  return (
    <a
      href="http://pf.kakao.com/_xlWgqG"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#FEE500] rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
      aria-label="카카오톡 상담"
    >
      <MessageCircle size={28} color="#3C1E1E" fill="#3C1E1E" />
    </a>
  );
};

export default KakaoFloatingButton;
