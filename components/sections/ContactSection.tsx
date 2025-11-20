'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, MessageCircle, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface Person {
  name: string;
  phone: string;
  accountBank?: string;
  accountNumber?: string;
  accountHolder?: string;
  kakaopayLink?: string;
}

interface ContactSectionProps {
  groom: Person;
  groomFather?: Person;
  groomMother?: Person;
  bride: Person;
  brideFather?: Person;
  brideMother?: Person;
}

export default function ContactSection({
  groom,
  groomFather,
  groomMother,
  bride,
  brideFather,
  brideMother
}: ContactSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [groomSideExpanded, setGroomSideExpanded] = useState(false);
  const [brideSideExpanded, setBrideSideExpanded] = useState(false);

  const makeCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const sendMessage = (phone: string) => {
    window.location.href = `sms:${phone}`;
  };

  const copyAccount = async (accountInfo: string, label: string) => {
    try {
      await navigator.clipboard.writeText(accountInfo);
      setCopiedAccount(label);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (err) {
      alert('복사에 실패했습니다.');
    }
  };

  const openKakaoPay = (link: string) => {
    window.open(link, '_blank');
  };

  const PersonCard = ({ person, label }: { person: Person; label: string }) => (
    <div className="glass-strong p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-amber-200/30">
      <p className="text-amber-800/70 text-xs mb-1.5 font-light">{label}</p>
      <div className="flex items-center gap-2 mb-3">
        <p className="text-base font-semibold text-amber-900">{person.name}</p>
        {person.kakaopayLink && (
          <button
            onClick={() => openKakaoPay(person.kakaopayLink!)}
            className="flex-shrink-0 transition-all duration-300 hover:scale-110"
            aria-label="카카오페이 송금"
          >
            <Image src="/icons/kakao_pay.svg" alt="카카오페이" width={50} height={50} />
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => makeCall(person.phone)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 glass hover:glass-strong text-amber-700 rounded-xl transition-all duration-300 text-xs shadow-md hover:shadow-lg font-medium"
        >
          <Phone className="w-3.5 h-3.5" />
          전화
        </button>
        <button
          onClick={() => sendMessage(person.phone)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 glass hover:glass-strong text-amber-700 rounded-xl transition-all duration-300 text-xs shadow-md hover:shadow-lg font-medium"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          문자
        </button>
      </div>

      {person.accountBank && person.accountNumber && (
        <div className="pt-3 border-t border-amber-300/30">
          <p className="text-xs text-amber-800/60 mb-1.5 font-light">계좌번호</p>
          <div className="flex items-center justify-between gap-2 glass-subtle p-2.5 rounded-xl">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-amber-900 truncate">
                {person.accountBank}
              </p>
              <p className="text-xs text-amber-800 truncate">
                {person.accountNumber}
              </p>
              {person.accountHolder && (
                <p className="text-xs text-amber-700/70">{person.accountHolder}</p>
              )}
            </div>
            <button
              onClick={() =>
                copyAccount(
                  `${person.accountBank} ${person.accountNumber}`,
                  `${label}-${person.name}`
                )
              }
              className="flex-shrink-0 p-1.5 hover:bg-amber-100/30 rounded-lg transition-colors"
              aria-label="계좌번호 복사"
            >
              {copiedAccount === `${label}-${person.name}` ? (
                <Check className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-amber-700" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section ref={ref} className="py-20 px-6 relative">
      <div className="max-w-4xl mx-auto">
        {/* 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-amber-900 mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
            Contact
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto mb-4" />
          <p className="text-amber-800/70 text-sm font-light">연락처 및 마음 전하실 곳</p>
        </motion.div>

        {/* 신랑측 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <button
            onClick={() => setGroomSideExpanded(!groomSideExpanded)}
            className="w-full flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity"
          >
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-400/40" />
            <h3 className="text-base text-amber-900 font-medium">신랑측</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-400/40 to-transparent" />
            {groomSideExpanded ? (
              <ChevronUp className="w-4 h-4 text-amber-700" />
            ) : (
              <ChevronDown className="w-4 h-4 text-amber-700" />
            )}
          </button>

          <motion.div
            initial={false}
            animate={{
              height: groomSideExpanded ? 'auto' : 0,
              opacity: groomSideExpanded ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* 부모님 - 모바일에서 가로 2열, 데스크톱에서도 가로 배열 */}
              {groomFather && <PersonCard person={groomFather} label="신랑 아버지" />}
              {groomMother && <PersonCard person={groomMother} label="신랑 어머니" />}
              {/* 신랑 - 모바일에서 full width */}
              <div className="col-span-2 md:col-span-1">
                <PersonCard person={groom} label="신랑" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 신부측 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            onClick={() => setBrideSideExpanded(!brideSideExpanded)}
            className="w-full flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity"
          >
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-400/40" />
            <h3 className="text-base text-amber-900 font-medium">신부측</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-400/40 to-transparent" />
            {brideSideExpanded ? (
              <ChevronUp className="w-4 h-4 text-amber-700" />
            ) : (
              <ChevronDown className="w-4 h-4 text-amber-700" />
            )}
          </button>

          <motion.div
            initial={false}
            animate={{
              height: brideSideExpanded ? 'auto' : 0,
              opacity: brideSideExpanded ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* 부모님 - 모바일에서 가로 2열, 데스크톱에서도 가로 배열 */}
              {brideFather && <PersonCard person={brideFather} label="신부 아버지" />}
              {brideMother && <PersonCard person={brideMother} label="신부 어머니" />}
              {/* 신부 - 모바일에서 full width */}
              <div className="col-span-2 md:col-span-1">
                <PersonCard person={bride} label="신부" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 안내 메시지 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-amber-800/60 leading-relaxed font-light">
            축하의 마음을 전달하고 싶으신 분들을 위해<br />
            계좌번호를 기재하였습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
