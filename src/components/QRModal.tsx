import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, isStatic = false }) => {
  const { settings } = useStore();
  const shopUrl = window.location.href;
  const [copied, setCopied] = useState(false);

  // BRANDING DATA
  const storeLogo = settings?.logoUrl;


  const handleCopy = async () => {
    if (isStatic) return;
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
    <div className="flex flex-col gap-3 w-full">
      <Button
        onClick={handleCopy}
        variant="secondary"
        className="!h-16"
        mode="rectangle"
        showFingerprint={true}
        fingerprintType="detailed"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">
          {copied ? 'KOPYALANDI ✅' : `${displayUrl} metnini kopyala`}
        </span>
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      isStatic={isStatic}
      maxWidth="max-w-sm"
      footer={footer}
      hideCloseButton={false}
      noPadding
    >
      <div className="flex flex-col items-center justify-center p-8">
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
      </div>
    </BaseModal>
  );
};

export default QRModal;
