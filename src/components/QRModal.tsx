import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Link, MessageCircle } from 'lucide-react';
import { useStore } from '../store';
import Button from './Button';
import BaseModal from './BaseModal';
import { QRModalProps } from '../types';

/**
 * QR MODAL (DIAMOND EDITION)
 * -----------------------------------------------------------
 * Interactive shop QR generator with integrated sharing tools.
 * Uses real-time settings for branded QR output.
 */
const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useStore();
  const shopUrl = window.location.href;
  const [copied, setCopied] = useState(false);

  // BRANDING DATA
  const storeName = settings?.name || 'Dijital Katalog';
  const storeLogo = settings?.logoUrl;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: storeName,
          text: `${storeName} dükkanını ziyaret edin!`,
          url: shopUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError')
          console.error('Sharing failed', err);
      }
    } else {
      handleCopy();
    }
  };

  const handleWhatsAppShare = () => {
    const text = `👋 Selam! ${storeName} dükkanını incelemek ister misin?\n\n🔗 ${shopUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shopUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const displayUrl = shopUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const footer = (
    <div className="flex flex-col gap-3">
      <Button
        onClick={handleWhatsAppShare}
        variant="primary"
        className="!py-4 !bg-[#25D366] hover:!bg-[#128C7E] !border-none shadow-lg shadow-green-100"
        mode="rectangle"
        icon={<MessageCircle size={18} fill="currentColor" />}
      >
        <span className="text-[11px] font-black uppercase tracking-widest text-white">
          WhatsApp'ta Paylaş
        </span>
      </Button>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleCopy}
          variant="secondary"
          className="!py-3 border-stone-100"
          mode="rectangle"
          icon={<Link size={16} />}
        >
          <span className="text-[10px] font-black uppercase tracking-widest">
            {copied ? 'KOPYALANDI' : 'KOPYALA'}
          </span>
        </Button>
        <Button
          onClick={handleShare}
          variant="secondary"
          className="!py-3 border-stone-100"
          mode="rectangle"
          icon={<Share2 size={16} />}
        >
          <span className="text-[10px] font-black uppercase tracking-widest">
            PAYLAŞ
          </span>
        </Button>
      </div>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-sm"
      title="DÜKKAN QR KODU"
      subtitle={displayUrl}
      footer={footer}
      hideCloseButton={false}
    >
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative group p-6 bg-white border border-stone-100 rounded-[2.5rem] shadow-xl shadow-stone-100/50 transition-all duration-500 hover:scale-[1.02]">
          {/* DECORATIVE CORNERS */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-stone-200 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-stone-200 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-stone-200 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-stone-200 rounded-br-lg"></div>

          {/* QR CODE BASE */}
          <div className="relative flex items-center justify-center">
            <QRCodeSVG
              value={shopUrl}
              size={200}
              level="H"
              includeMargin={false}
              className="rounded-xl overflow-hidden"
            />
            
            {/* OVERLAY LOGO (DIAMOND ROUNDED) */}
            {storeLogo && (
              <div className="absolute w-14 h-14 bg-white p-1 rounded-2xl shadow-md border border-stone-50 flex items-center justify-center overflow-hidden">
                <img 
                  src={storeLogo} 
                  alt="Store Logo" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
        
        <p className="mt-8 text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] animate-pulse">
          Okut ve dükkana gir
        </p>
      </div>
    </BaseModal>
  );
};

export default QRModal;
