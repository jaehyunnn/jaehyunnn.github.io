'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, MessageCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Person {
  name: string;
  phone: string;
  accountBank?: string;
  accountNumber?: string;
  accountHolder?: string;
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

  const PersonCard = ({ person, label }: { person: Person; label: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <p className="text-gray-600 text-sm mb-2">{label}</p>
      <p className="text-lg font-semibold text-gray-800 mb-4">{person.name}</p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => makeCall(person.phone)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors text-sm"
        >
          <Phone className="w-4 h-4" />
          전화
        </button>
        <button
          onClick={() => sendMessage(person.phone)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          문자
        </button>
      </div>

      {person.accountBank && person.accountNumber && (
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">계좌번호</p>
          <div className="flex items-center justify-between gap-2 bg-gray-50 p-3 rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {person.accountBank}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {person.accountNumber}
              </p>
              {person.accountHolder && (
                <p className="text-xs text-gray-500">{person.accountHolder}</p>
              )}
            </div>
            <button
              onClick={() =>
                copyAccount(
                  `${person.accountBank} ${person.accountNumber}`,
                  `${label}-${person.name}`
                )
              }
              className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="계좌번호 복사"
            >
              {copiedAccount === `${label}-${person.name}` ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section ref={ref} className="py-20 px-6 bg-gradient-to-b from-rose-50/30 to-white">
      <div className="max-w-4xl mx-auto">
        {/* 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4">
            Contact
          </h2>
          <div className="w-12 h-px bg-rose-300 mx-auto mb-4" />
          <p className="text-gray-600 text-sm">연락처 및 마음 전하실 곳</p>
        </motion.div>

        {/* 신랑측 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-px bg-rose-200" />
            <h3 className="text-xl font-serif text-gray-800">신랑측</h3>
            <div className="flex-1 h-px bg-rose-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {groomFather && <PersonCard person={groomFather} label="신랑 아버지" />}
            {groomMother && <PersonCard person={groomMother} label="신랑 어머니" />}
            <PersonCard person={groom} label="신랑" />
          </div>
        </motion.div>

        {/* 신부측 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-px bg-rose-200" />
            <h3 className="text-xl font-serif text-gray-800">신부측</h3>
            <div className="flex-1 h-px bg-rose-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brideFather && <PersonCard person={brideFather} label="신부 아버지" />}
            {brideMother && <PersonCard person={brideMother} label="신부 어머니" />}
            <PersonCard person={bride} label="신부" />
          </div>
        </motion.div>

        {/* 안내 메시지 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 leading-relaxed">
            축하의 마음을 담아 축의금을 전달하고 싶으신 분들을 위해<br />
            계좌번호를 기재하였습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
