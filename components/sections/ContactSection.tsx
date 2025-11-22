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

interface PersonCardProps {
  person: Person;
  label: string;
  onCall: (phone: string) => void;
  onMessage: (phone: string) => void;
  onCopy: (accountInfo: string, label: string) => void;
  onKakaoPay: (link: string) => void;
  copiedAccount: string | null;
}

const PersonCard = ({ person, label, onCall, onMessage, onCopy, onKakaoPay, copiedAccount }: PersonCardProps) => (
  <div className="bg-white p-6 rounded-sm shadow-md border border-stone-200/50 hover:shadow-xl transition-all duration-300">
    <p className="text-stone-400 text-xs mb-2 font-medium tracking-wider uppercase">{label}</p>
    <div className="flex items-center justify-between mb-6">
      <p className="text-lg font-medium text-stone-800">{person.name}</p>
      {person.kakaopayLink && (
        <button
          onClick={() => onKakaoPay(person.kakaopayLink!)}
          className="flex-shrink-0 transition-all duration-300 hover:opacity-80"
          aria-label="카카오페이 송금"
        >
          <Image src="/icons/kakao_pay.svg" alt="카카오페이" width={42} height={42} />
        </button>
      )}
    </div>

    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onCall(person.phone)}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-sm transition-all duration-300 text-xs font-medium border border-stone-200"
      >
        <Phone className="w-3.5 h-3.5" />
        Call
      </button>
      <button
        onClick={() => onMessage(person.phone)}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-sm transition-all duration-300 text-xs font-medium border border-stone-200"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        Message
      </button>
    </div>

    {person.accountBank && person.accountNumber && (
      <div className="pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between gap-2 p-3 bg-stone-50/50 rounded-sm">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-medium text-stone-700">
                {person.accountBank}
              </p>
              <p className="text-xs text-stone-500">
                {person.accountNumber}
              </p>
            </div>
            {person.accountHolder && (
              <p className="text-xs text-stone-400">{person.accountHolder}</p>
            )}
          </div>
          <button
            onClick={() =>
              onCopy(
                `${person.accountBank} ${person.accountNumber}`,
                `${label}-${person.name}`
              )
            }
            className="flex-shrink-0 p-2 hover:bg-stone-200/50 rounded-full transition-colors"
            aria-label="계좌번호 복사"
          >
            {copiedAccount === `${label}-${person.name}` ? (
              <Check className="w-4 h-4 text-stone-600" />
            ) : (
              <Copy className="w-4 h-4 text-stone-400" />
            )}
          </button>
        </div>
      </div>
    )}
  </div>
);

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
    window.location.assign(`tel:${phone}`);
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

  const commonProps = {
    onCall: makeCall,
    onMessage: sendMessage,
    onCopy: copyAccount,
    onKakaoPay: openKakaoPay,
    copiedAccount
  };

  return (
    <section ref={ref} className="py-24 px-6 relative bg-[#fbfaf8]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
      <div className="max-w-4xl mx-auto">
        {/* 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-2xl text-amber-900/80 tracking-[0.2em] uppercase mb-3">
            Contact
          </h2>
          <div className="text-2xl md:text-4xl text-amber-950 font-medium mb-4">
            마음 전하실 곳
          </div>
        </motion.div>

        {/* 안내 메시지 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 mb-16 text-center"
        >
          <p className="text-sm text-stone-500 leading-relaxed font-light">
            참석이 어려우신 분들을 위해<br />
            계좌번호를 기재하였습니다.<br />
            너그러운 마음으로 양해 부탁드립니다.
          </p>
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
            className="w-full flex items-center gap-4 mb-6 hover:opacity-70 transition-opacity group"
          >
            <div className="w-12 h-px bg-stone-300" />
            <h3 className="text-lg text-stone-800 font-medium">Groom&apos;s Side</h3>
            <div className="flex-1 h-px bg-stone-200" />
            {groomSideExpanded ? (
              <ChevronUp className="w-5 h-5 text-stone-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-stone-400" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
              {/* 신랑 - 모바일에서 full width */}
              <div className="col-span-1 md:col-span-1">
                <PersonCard person={groom} label="GROOM" {...commonProps} />
              </div>
              {/* 부모님 */}
              {groomFather && <PersonCard person={groomFather} label="FATHER" {...commonProps} />}
              {groomMother && <PersonCard person={groomMother} label="MOTHER" {...commonProps} />}
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
            className="w-full flex items-center gap-4 mb-6 hover:opacity-70 transition-opacity group"
          >
            <div className="w-12 h-px bg-stone-300" />
            <h3 className="text-lg text-stone-800 font-medium">Bride&apos;s Side</h3>
            <div className="flex-1 h-px bg-stone-200" />
            {brideSideExpanded ? (
              <ChevronUp className="w-5 h-5 text-stone-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-stone-400" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
              {/* 신부 - 모바일에서 full width */}
              <div className="col-span-1 md:col-span-1">
                <PersonCard person={bride} label="BRIDE" {...commonProps} />
              </div>
              {/* 부모님 */}
              {brideFather && <PersonCard person={brideFather} label="FATHER" {...commonProps} />}
              {brideMother && <PersonCard person={brideMother} label="MOTHER" {...commonProps} />}
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
