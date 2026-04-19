import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLang } from '@/context/LangContext';

export default function ChatWidget() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'support', text: t('chatWelcome'), time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: 'user' as const, text: input, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Auto-reply after 1s
    setTimeout(() => {
      const replies = [
        'Merci pour votre message ! Un conseiller vous répondra dans quelques minutes.',
        'Nous avons bien reçu votre demande. Souhaitez-vous des informations sur l\'importation de véhicules ?',
        'Pour toute urgence, contactez-nous au +33 1 23 45 67 89.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: 'support' as const, text: randomReply, time: new Date() },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-4 z-[150] w-[360px] max-w-[calc(100vw-32px)] bg-midnight border border-gold/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ height: '480px', boxShadow: '0 0 40px rgba(0,0,0,0.5), 0 0 20px rgba(200,168,75,0.15)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-midnight to-deep-black">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-turquoise/20 flex items-center justify-center">
                <MessageCircle size={18} className="text-turquoise" />
              </div>
              <div>
                <h4 className="font-montserrat font-semibold text-sm text-white">{t('chatSupport')}</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] text-white/50 font-inter">En ligne</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-inter ${
                    msg.from === 'user'
                      ? 'bg-turquoise text-white rounded-br-md'
                      : 'bg-white/10 text-white/90 rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={t('chatPlaceholder')}
                className="flex-1 h-10 px-4 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter placeholder:text-white/30 focus:border-gold"
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 flex items-center justify-center bg-turquoise rounded-lg hover:bg-turquoise/80 transition-colors"
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-[150] w-14 h-14 rounded-full bg-gradient-to-br from-turquoise to-[#0a5e5d] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 chat-bubble-btn"
        style={{ boxShadow: '0 0 20px rgba(14, 124, 125, 0.5), 0 4px 16px rgba(0,0,0,0.3)' }}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}
