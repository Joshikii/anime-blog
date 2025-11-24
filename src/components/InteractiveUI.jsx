import React, { useState, useEffect, useRef } from 'react';
import { User, ChevronRight, Calendar, ArrowLeft, PenTool, Lock, Mail, Search, Home, Smile, Coffee, Share2, Twitter, MessageCircle, X, Send, MapPin, Heart, Star, Tag, CheckCircle, Maximize, Minimize, Link, Check, Cookie } from 'lucide-react';

// --- CONFIGURATION ---

// 1. GOOGLE ANALYTICS
// Sostituisci con il tuo ID vero (es. 'G-XB52...')
const GA_MEASUREMENT_ID = 'G-T3HWPDGY2S'; 

// 2. WALINE COMMENTS
const WALINE_SERVER_URL = 'https://waline-anime-blog-comments.vercel.app'; 

// 3. NEWSLETTER
const NEWSLETTER_ACTION = "https://buttondown.com/api/emails/embed-subscribe/Joo";

const BASE_URL = "/anime-blog";

// --- HELPER: Carica Google Analytics Dinamicamente ---
const loadGoogleAnalytics = () => {
  if (typeof window === 'undefined' || window.gtag) return; 

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
  
  window.gtag = gtag; 
  console.log("Google Analytics Loaded 🚀");
};

// --- COMPONENTS ---

// *** HOME FEED (Era mancante!) ***
export const HomeFeed = ({ posts }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', ...new Set(posts.map(p => p.data.category))];

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(p => p.data.category === activeCategory);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore</h2>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-black text-white shadow-md transform scale-105' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {filteredPosts.length > 0 ? filteredPosts.map(post => (
          <a key={post.slug} href={`${BASE_URL}/blog/${post.slug}`} className="group cursor-pointer border-b border-gray-200 pb-10 last:border-0 block">
            <div className="overflow-hidden rounded-xl aspect-[21/9] bg-gray-100 relative mb-4">
              <img src={post.data.image} alt={post.data.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800">
                {post.data.category}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {new Date(post.data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
                {post.data.title}
              </h2>
              <p className="text-gray-600 leading-relaxed line-clamp-2">{post.data.description}</p>
              <div className="pt-2">
                <span className="inline-flex items-center text-sm font-bold text-black group-hover:underline">
                  Read <ChevronRight size={16} />
                </span>
              </div>
            </div>
          </a>
        )) : (
          <div className="py-20 text-center bg-gray-50 rounded-xl">
             <Search className="mx-auto text-gray-300 mb-2" size={32} />
             <p className="text-gray-500">No articles found in "{activeCategory}".</p>
          </div>
        )}
      </div>
      
      <div className="md:hidden mt-16 pt-10 border-t border-gray-200">
        <NewsletterBox />
      </div>
    </>
  );
};

export const Header = ({ onSearchClick, onSubscribeClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href={`${BASE_URL}/`} className="flex items-center gap-2 cursor-pointer group shrink-0">
          <div className="bg-black text-white p-1.5 rounded-md group-hover:bg-red-600 transition-colors"><PenTool size={20} /></div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Anime<span className="font-light text-gray-500">Focus</span></h1>
        </a>
        <nav className="flex gap-2 items-center">
          <a href={`${BASE_URL}/`} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 hover:text-black mr-1" title="Home">
            <Home size={22} strokeWidth={2} />
          </a>
          <button onClick={onSearchClick} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 hover:text-black mr-1" title="Search">
            <Search size={22} strokeWidth={2} />
          </button>
          <a href={`${BASE_URL}/about`} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 hover:text-black" title="About">
            <Smile size={22} strokeWidth={2} />
          </a>
          <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>
          <button onClick={onSubscribeClick} className="hidden md:block bg-black text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors">Subscribe</button>
        </nav>
      </div>
    </header>
  );
};

export const SearchOverlay = ({ isOpen, onClose, posts }) => {
  const [query, setQuery] = useState('');
  const filtered = query === '' ? [] : posts.filter(p => 
    p.data.title.toLowerCase().includes(query.toLowerCase()) || 
    p.data.category.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md animate-fade-in flex flex-col">
      <div className="max-w-3xl w-full mx-auto px-6 pt-8">
        <div className="flex justify-end mb-8">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={32} className="text-gray-500" />
          </button>
        </div>
        <div className="relative mb-12">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={32} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-transparent border-b-2 border-gray-200 text-3xl font-bold py-4 pl-12 focus:outline-none focus:border-black transition-colors" 
            autoFocus 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
          />
        </div>
        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          {query !== '' && filtered.length === 0 && (
            <p className="text-gray-400 text-lg">No results found.</p>
          )}
          {filtered.map(post => (
            <a key={post.slug} href={`${BASE_URL}/blog/${post.slug}`} className="group flex gap-4 items-center cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                <img src={post.data.image} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-gray-400 mb-1 block">{post.data.category}</span>
                <h3 className="text-xl font-bold group-hover:text-red-600 transition-colors">{post.data.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- NEWSLETTER BOX (MODIFICATA: Usa <input> invece di Textarea) ---
export const NewsletterBox = ({ className }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    // Non preveniamo il default qui, lasciamo che il form apra il popup di Buttondown
    if (!email) return;
    
    setStatus('loading');
    // Feedback visivo per l'utente
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setEmail('');
      }, 3000);
    }, 1500);
  };

  return (
    <div className={`bg-black text-white p-6 rounded-2xl shadow-xl overflow-hidden ${className}`}>
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Mail size={18} /> Newsletter</h3>
      <p className="text-gray-400 text-xs mb-4">Don't miss my latest analysis. Zero spam.</p>
      
      <form 
        action={NEWSLETTER_ACTION} 
        method="post" 
        target="popupwindow" 
        onSubmit={(e) => {
            window.open(NEWSLETTER_ACTION, 'popupwindow', 'scrollbars=yes,width=800,height=600');
            handleSubmit(e);
        }}
        className="space-y-2"
      >
        <div className="relative">
             {/* INPUT SEMPLICE E ROBUSTO */}
             <input 
                type="email" 
                name="email" 
                placeholder="Your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-gray-800 border-none rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-white outline-none transition-all h-[40px]" 
                required
             />
        </div>
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-white text-black font-bold text-sm py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-70"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
};

export const SubscribeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-fade-in flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 z-10">
          <X size={20} />
        </button>
        
        <div className="flex flex-col">
          <div className="bg-black text-white p-8 text-center">
            <Mail className="mx-auto mb-4" size={32} />
            <h3 className="text-2xl font-bold mb-2">Newsletter</h3>
            <p className="text-gray-300 text-sm">Get my analysis directly in your inbox.</p>
          </div>
          <form action={NEWSLETTER_ACTION} method="post" target="_blank" rel="noopener noreferrer" className="p-8" onSubmit={() => setTimeout(onClose, 1000)}>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Your email</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="alex@example.com" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black mb-6 outline-none transition-all" 
            />
            <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors flex justify-center items-center gap-2">Subscribe Now</button>
            <p className="text-[10px] text-gray-400 text-center mt-4">Powered by Buttondown</p>
          </form>
        </div>
      </div>
    </div>
  );
};

// Manteniamo la DynamicTextarea per i commenti (se usati in futuro)
export const DynamicTextarea = ({ value, onChange, placeholder, className, required, name, onKeyDown }) => {
  const textareaRef = useRef(null);
  useEffect(() => { if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'; } }, [value]);
  return <textarea ref={textareaRef} name={name} rows={1} placeholder={placeholder} className={`${className} resize-none overflow-hidden`} value={value} onChange={onChange} required={required} onKeyDown={onKeyDown} />;
};

export const WalineComments = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/@waline/client@v3/dist/waline.css';
    document.head.appendChild(link);

    import('https://unpkg.com/@waline/client@v3/dist/waline.js').then(({ init }) => {
      if (containerRef.current) {
        init({
          el: containerRef.current,
          serverURL: WALINE_SERVER_URL,
          lang: 'en',
          dark: false, 
          emoji: [
              'https://unpkg.com/@waline/emojis@1.1.0/weibo',
              'https://unpkg.com/@waline/emojis@1.1.0/bilibili',
          ],
          meta: ['nick', 'mail'], 
          requiredMeta: ['nick', 'mail'],
          pageSize: 10,
        });
      }
    });

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">Discussion</h3>
      <div ref={containerRef} id="waline" />
    </div>
  );
};

export const RelatedPosts = ({ currentSlug, posts }) => {
  const related = posts.filter(p => p.slug !== currentSlug).slice(0, 2);
  
  return (
    <div className="bg-gray-50 py-12 mt-8 rounded-2xl px-8">
      <h3 className="font-bold text-xl mb-6">You might also like</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {related.map(post => (
          <a key={post.slug} href={`${BASE_URL}/blog/${post.slug}`} className="group cursor-pointer block">
            <div className="aspect-[16/9] rounded-lg bg-gray-200 overflow-hidden mb-3">
              <img src={post.data.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 className="font-bold text-lg group-hover:text-red-600 transition-colors leading-tight">
                {post.data.title}
            </h4>
            <span className="text-xs text-gray-500 mt-1 block">{post.data.category}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export const SocialShare = () => {
  const [copied, setCopied] = useState(false);
  const getShareData = () => {
    if (typeof window === 'undefined') return { url: '', title: '' };
    return { url: window.location.href, title: document.title };
  };
  const shareTwitter = () => {
    const { url, title } = getShareData();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  };
  const shareWhatsApp = () => {
    const { url, title } = getShareData();
    window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
  };
  const handleNativeShare = async () => {
    const { url, title } = getShareData();
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch (err) { console.log('Error sharing:', err); }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) { console.error('Failed to copy:', err); }
    }
  };
  return (
    <div className="flex flex-col items-center justify-center py-6 border-t border-gray-100 mt-8">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Share</span>
      <div className="flex gap-4">
        <button onClick={shareTwitter} className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-black hover:text-white transition-all"><Twitter size={18} /></button>
        <button onClick={shareWhatsApp} className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-green-500 hover:text-white transition-all"><MessageCircle size={18} /></button>
        <button onClick={handleNativeShare} className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all relative">
          {copied ? <Check size={18} /> : <Share2 size={18} />}
          {copied && <span className="absolute -top-8 bg-black text-white text-[10px] py-1 px-2 rounded animate-fade-in">Copied!</span>}
        </button>
      </div>
    </div>
  );
};

export const ReadingProgress = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setWidth(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent"><div className="h-full bg-red-600 transition-all duration-100 ease-out" style={{ width: `${width}%` }}></div></div>;
};

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const consent = localStorage.getItem('animefocus_cookie_consent');
    if (!consent) { const timer = setTimeout(() => setIsVisible(true), 1000); return () => clearTimeout(timer); }
  }, []);
  const handleAccept = () => { localStorage.setItem('animefocus_cookie_consent', 'accepted'); setIsVisible(false); loadGoogleAnalytics(); };
  const handleDecline = () => { localStorage.setItem('animefocus_cookie_consent', 'declined'); setIsVisible(false); };
  if (!isVisible) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[80] w-[calc(100%-3rem)] max-w-sm bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="bg-gray-100 p-2 rounded-full shrink-0 text-gray-600"><Cookie size={24} /></div>
        <div><h4 className="font-bold text-gray-900 mb-1">Cookie Policy</h4><p className="text-xs text-gray-500 leading-relaxed mb-4">We use cookies to analyze traffic. No personal data sold.</p><div className="flex gap-3"><button onClick={handleAccept} className="flex-1 bg-black text-white text-xs font-bold py-2 rounded-lg hover:bg-gray-800 transition-colors">Accept</button><button onClick={handleDecline} className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-lg hover:bg-gray-200 transition-colors">Decline</button></div></div>
      </div>
    </div>
  );
};

export const AppLayout = ({ children, posts }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  return (
    <>
      <Header onSearchClick={() => setIsSearchOpen(true)} onSubscribeClick={() => setIsSubscribeOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} posts={posts} />
      <SubscribeModal isOpen={isSubscribeOpen} onClose={() => setIsSubscribeOpen(false)} />
      <CookieBanner />
      {children}
    </>
  );
};