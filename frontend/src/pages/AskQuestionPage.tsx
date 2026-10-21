import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Bot
} from 'lucide-react';
import type { Field, ChatMessageItem, StructuredAdvice } from '../types';
import { api } from '../services/api';

interface AskQuestionPageProps {
  activeField: Field | null;
}

export const AskQuestionPage: React.FC<AskQuestionPageProps> = ({ activeField }) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => {
    const saved = localStorage.getItem('farmtwin_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: i18n.language === 'te'
          ? 'నమస్కారం! నేను మీ ఫార్మ్‌ట్విన్ AI సహాయకుడిని. మీ పంట తెగుళ్లు, ఎరువుల మోతాదు లేదా విత్తనాల గురించి ఏ భాషలోనైనా అడగవచ్చు.'
          : 'Welcome! I am your FarmTwin AI agricultural intelligence assistant. Ask any question about your crop, fertilizer dosage, or pests in Telugu or English.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('farmtwin_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Voice speech-to-text integration using Web Speech API
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported on this browser. Please type your question.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === 'te' ? 'te-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend && !selectedImage) return;

    const userMessage: ChatMessageItem = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      imageUrl: imagePreview || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    const currentImage = selectedImage;
    handleRemoveImage();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('question', textToSend);
      formData.append('language', i18n.language || 'te');
      if (activeField?.id) {
        formData.append('field_id', activeField.id.toString());
      }
      if (currentImage) {
        formData.append('file', currentImage);
      }

      const res = await api.askQuestion(formData);
      const advice: StructuredAdvice = res.advice || {
        short_answer: 'సిఫార్సు సిద్ధంగా ఉంది.',
        practical_steps: ['నీటి పారుదల శుభ్రం చేయండి.', 'వేపనూనె 5 మి.లీ పిచికారీ చేయండి.'],
        why: 'వాతావరణ తేమ కారణం.',
        cautions: ['మాస్క్ ధరించండి.'],
        sources: ['ANGRAU & KVK']
      };

      const botMessage: ChatMessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: advice.short_answer,
        structuredContent: advice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage: ChatMessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'క్షమించండి, సర్వర్‌లో చిన్న సమస్య వచ్చింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    t('ask.q1'),
    t('ask.q2'),
    t('ask.q3'),
    t('ask.q4')
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] sm:h-[calc(100vh-14rem)] min-h-[520px] sm:min-h-[620px] text-[#2A080C]">
      {/* Header Info */}
      <div className="mb-3 shrink-0 pb-3 border-b border-[#E6D9C8]">
        <h2 className="font-luxury-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#2A080C]">
          {t('ask.title')}
        </h2>
        <p className="text-xs sm:text-sm text-[#5D4B45] mt-1">
          {t('ask.subtitle')}
        </p>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 sm:p-6 bg-[#F2E9DE]/60 border border-[#E6D9C8]">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 border ${
                  isUser 
                    ? 'bg-[#6B0F1A] border-[#4A0810] text-[#FFFDF9]' 
                    : 'bg-[#FFFDF9] border-[#E6D9C8] text-[#6B0F1A]'
                }`}
              >
                {isUser ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>

              <div
                className={`max-w-[88%] sm:max-w-xl lg:max-w-2xl p-4 sm:p-5 border ${
                  isUser
                    ? 'bg-[#6B0F1A] text-[#FFFDF9] border-[#4A0810]'
                    : 'bg-[#FFFDF9] text-[#2A080C] border-[#E6D9C8] space-y-3.5 shadow-2xs'
                }`}
              >
                {/* Uploaded image */}
                {msg.imageUrl && (
                  <div className="mb-2 border border-[#E6D9C8] max-h-48 overflow-hidden">
                    <img src={msg.imageUrl} alt="Crop symptom" className="w-full object-cover" />
                  </div>
                )}

                {/* Primary Text */}
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {msg.content}
                </p>

                {/* Structured Breakdown for Assistant Replies */}
                {msg.structuredContent && (
                  <div className="space-y-2.5 pt-2 border-t border-[#E6D9C8] text-xs">
                    {/* Practical Steps */}
                    {msg.structuredContent.practical_steps?.length > 0 && (
                      <div>
                        <span className="font-bold text-[#6B0F1A] text-[10px] uppercase tracking-wider font-mono flex items-center gap-1 mb-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t('advice.whatToDo')}</span>
                        </span>
                        <ul className="space-y-1.5 pl-1">
                          {msg.structuredContent.practical_steps.map((st, i) => (
                            <li key={i} className="flex items-start space-x-2 text-[#2A080C]">
                              <span className="font-bold text-[#6B0F1A] font-mono shrink-0">[{i + 1}]</span>
                              <span className="leading-snug">{st}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Why */}
                    {msg.structuredContent.why && (
                      <div className="p-2.5 bg-[#FAF6F0] border border-[#E6D9C8] text-[#5D4B45]">
                        <span className="font-bold text-[#2A080C] text-[10px] uppercase font-mono block mb-0.5">
                          💡 {t('advice.why')}:
                        </span>
                        <span className="leading-snug">{msg.structuredContent.why}</span>
                      </div>
                    )}

                    {/* Cautions */}
                    {msg.structuredContent.cautions?.length > 0 && (
                      <div className="p-2.5 bg-[#FFFBF5] border border-[#6B0F1A]/25 text-[#6B0F1A]">
                        <span className="font-bold flex items-center gap-1 mb-0.5 text-[10px] uppercase font-mono">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{t('advice.cautions')}:</span>
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-[#5D4B45]">
                          {msg.structuredContent.cautions.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Sources */}
                    {msg.structuredContent.sources?.length > 0 && (
                      <div className="text-[10px] text-[#7D6B64] font-mono uppercase tracking-wider pt-1 border-t border-[#E6D9C8]">
                        <span className="font-bold block text-[#2A080C]">{t('advice.sources')}:</span>
                        <span>{msg.structuredContent.sources.join(' • ')}</span>
                      </div>
                    )}
                  </div>
                )}

                <span
                  className={`text-[9px] block text-right mt-1 font-mono uppercase tracking-wider ${
                    isUser ? 'text-[#E8D5B5]' : 'text-[#7D6B64]'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-2 text-[#6B0F1A] text-xs p-2.5 bg-[#FFFDF9] max-w-xs border border-[#E6D9C8]">
            <Sparkles className="w-4 h-4 animate-spin text-[#C5A059]" />
            <span className="font-mono uppercase tracking-wider text-[10px]">{t('ask.analyzing')}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-2 overflow-x-auto flex space-x-1.5 no-scrollbar shrink-0">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="whitespace-nowrap px-3 py-1.5 bg-[#FFFDF9] hover:bg-[#6B0F1A] text-[#2A080C] hover:text-[#FFFDF9] text-[11px] font-semibold border border-[#E6D9C8] transition touch-target"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Image Preview Thumbnail */}
      {imagePreview && (
        <div className="p-2 bg-[#FFFDF9] border border-[#E6D9C8] mb-1 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <img src={imagePreview} alt="Preview" className="w-10 h-10 object-cover border border-[#E6D9C8]" />
            <span className="text-xs text-[#5D4B45] font-medium">{t('ask.photoAttached')}</span>
          </div>
          <button
            onClick={handleRemoveImage}
            className="p-1 text-[#7D6B64] hover:text-[#6B0F1A] touch-target"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="bg-[#FFFDF9] p-2 border border-[#E6D9C8] shadow-xs flex items-center space-x-2 shrink-0">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
          id="crop-photo-upload"
        />

        <label
          htmlFor="crop-photo-upload"
          className="p-2.5 text-[#5D4B45] hover:text-[#6B0F1A] hover:bg-[#FAF6F0] cursor-pointer touch-target flex items-center justify-center transition"
          aria-label={t('ask.photoUpload')}
        >
          <ImageIcon className="w-5 h-5" />
        </label>

        <button
          onClick={handleToggleVoice}
          className={`p-2.5 touch-target flex items-center justify-center transition ${
            isListening
              ? 'bg-[#6B0F1A] text-[#FFFDF9] animate-pulse'
              : 'text-[#5D4B45] hover:text-[#6B0F1A] hover:bg-[#FAF6F0]'
          }`}
          aria-label="Voice input"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={t('ask.inputPlaceholder')}
          className="flex-1 text-xs sm:text-sm px-2 py-2 bg-transparent text-[#2A080C] placeholder:text-[#A89689] focus:outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || (!input.trim() && !selectedImage)}
          className="p-2.5 bg-[#6B0F1A] hover:bg-[#540912] disabled:bg-[#E6D9C8] text-[#FFFDF9] disabled:text-[#A89689] touch-target flex items-center justify-center transition border border-[#C5A059]/40"
          aria-label={t('ask.send')}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[10px] text-[#7D6B64] text-center mt-1 uppercase font-mono tracking-wider shrink-0">
        {t('ask.disclaimer')}
      </p>
    </div>
  );
};
