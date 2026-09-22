import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, CheckCircle, Share } from 'lucide-react';
import { motion } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setIsInstalled(true));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <MainLayout>
      <div className="container py-16 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="mx-auto w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
            <img src="/icons/adhvika-store-icon.jpeg" alt="Adhvika Store" className="w-full h-full object-cover" />
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">
              Install Adhvika Store
            </h1>
            <p className="text-muted-foreground text-lg">
              Get the app on your phone for a faster, smoother shopping experience!
            </p>
          </div>

          {isInstalled ? (
            <div className="flex items-center justify-center gap-3 text-primary bg-secondary rounded-xl p-6">
              <CheckCircle className="h-6 w-6" />
              <span className="font-medium text-lg">App is already installed!</span>
            </div>
          ) : isIOS ? (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 text-left">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Share className="h-5 w-5 text-primary" />
                Install on iPhone / iPad
              </h2>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  Tap the <strong>Share</strong> button in Safari (bottom bar)
                </li>
                <li className="flex gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  Scroll down and tap <strong>"Add to Home Screen"</strong>
                </li>
                <li className="flex gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  Tap <strong>"Add"</strong> to install
                </li>
              </ol>
            </div>
          ) : deferredPrompt ? (
            <Button size="xl" variant="hero" onClick={handleInstall} className="gap-3">
              <Download className="h-5 w-5" />
              Install App
            </Button>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 text-left">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                How to Install
              </h2>
              <p className="text-muted-foreground">
                Open this page in <strong>Chrome</strong> or <strong>Edge</strong> on your phone, then tap the browser menu (⋮) and select <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {[
              { icon: '⚡', title: 'Fast & Smooth', desc: 'Loads instantly like a native app' },
              { icon: '📱', title: 'Works Offline', desc: 'Browse products without internet' },
              { icon: '🔔', title: 'Home Screen', desc: 'Quick access from your phone' },
            ].map((f) => (
              <div key={f.title} className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="text-muted-foreground text-xs mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Install;
