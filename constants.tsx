
import { SiteSettings, LeadStatus } from './types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  hero: {
    title: "등촌샤브칼국수 x KT\n공식 파트너십 특별 혜택",
    subtitle: "전국 등촌샤브칼국수 가맹점주님만을 위한 하이오더 및 매장 솔루션 최대 할인 혜택을 확인하세요.",
    imageUrl: "https://picsum.photos/1920/1080?random=1",
    badges: ["가맹점 전용 혜택", "공식 파트너십", "전담 설치·AS"],
    cta1: "상담 신청하기",
    cta2: "혜택/상품 보기"
  },
  partnership: {
    title: "성공적인 매장 운영의 시작\nKT 공식 파트너십",
    description: "본사와 KT의 공식 제휴를 통해 안정적인 서비스와 차별화된 가격 경쟁력을 제공합니다.",
    cards: [
      { title: "압도적 비용 절감", content: "가맹점 전용 특가로 초기 도입비와 월 이용료를 대폭 낮췄습니다." },
      { title: "검증된 솔루션", content: "수많은 매장에서 증명된 KT의 인프라로 오진단 없는 매장 운영을 지원합니다." },
      { title: "전담 케어 시스템", content: "등촌 전 전담팀이 배정되어 설치부터 사후 관리까지 책임집니다." }
    ]
  }
};

export const PRODUCT_OPTIONS = [
  { id: 'hiorder', label: '하이오더(테이블오더)' },
  { id: 'internet', label: '매장 인터넷/WiFi' },
  { id: 'robot', label: '서빙로봇' }
];

export const STATUS_COLORS: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'bg-blue-100 text-blue-600',
  [LeadStatus.CONTACTED]: 'bg-green-100 text-green-600',
  [LeadStatus.PENDING]: 'bg-orange-100 text-orange-600',
  [LeadStatus.COMPLETED]: 'bg-gray-100 text-gray-600'
};
