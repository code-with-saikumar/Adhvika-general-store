import React, { useState, useEffect } from 'react';

const WHATSAPP_NUMBER = '917337377689';
const DEFAULT_MESSAGE = 'Hi! I need help with something from Adhvika General Store.';

const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('wa_btn_seen');
    if (!hasVisited) {
      setPulse(true);
      const tooltipTimer = setTimeout(() => setShowTooltip(true), 2000);
      const hideTimer = setTimeout(() => {
        setShowTooltip(false);
        setPulse(false);
        sessionStorage.setItem('wa_btn_seen', '1');
      }, 8000);
      return () => { clearTimeout(tooltipTimer); clearTimeout(hideTimer); };
    }
  }, []);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-4 z-50">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-3 animate-fade-in">
          <div className="bg-foreground text-background text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            Need help? Chat with us!
            <div className="absolute -bottom-1 right-5 w-2 h-2 bg-foreground rotate-45" />
          </div>
        </div>
      )}

      {/* Pulse ring */}
      {pulse && (
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
      )}

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
        onClick={() => { setShowTooltip(false); setPulse(false); sessionStorage.setItem('wa_btn_seen', '1'); }}
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.129 6.744 3.047 9.379L1.054 31.49l6.328-2.03A15.89 15.89 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.335 22.594c-.39 1.1-1.932 2.013-3.18 2.28-.854.18-1.968.324-5.72-1.23-4.8-1.988-7.886-6.857-8.124-7.174-.23-.316-1.924-2.563-1.924-4.888 0-2.326 1.218-3.468 1.65-3.942.39-.428 1.022-.618 1.625-.618.196 0 .372.01.53.018.432.018.648.044.934.724.356.848 1.222 2.98 1.33 3.198.108.22.218.516.068.808-.14.298-.262.43-.482.684-.22.254-.43.448-.65.722-.2.238-.424.494-.176.926.248.428 1.102 1.816 2.366 2.942 1.628 1.45 2.998 1.9 3.426 2.108.428.21.684.176.934-.104.256-.286 1.094-1.272 1.386-1.71.286-.428.58-.356.974-.214.398.14 2.524 1.19 2.956 1.408.432.22.72.324.826.508.108.184.108 1.068-.282 2.168z"/>
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppButton;
