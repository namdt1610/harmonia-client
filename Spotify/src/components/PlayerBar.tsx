import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PlayerBar() {
  const t = useTranslations('Player');
  
  return (
    <footer className="h-24 bg-neutral-900 border-t border-neutral-800 px-4 flex items-center">
      <div className="w-1/4 flex items-center">
        <div className="w-14 h-14 bg-neutral-800 mr-3 flex-shrink-0"></div>
        <div>
          <p className="font-medium">{t('songTitle', { fallback: 'Song Title' })}</p>
          <p className="text-xs text-neutral-400">{t('artistName', { fallback: 'Artist Name' })}</p>
        </div>
        <button className="ml-4 text-neutral-400 hover:text-white">
          <Heart size={16} />
        </button>
      </div>
      
      <div className="w-1/2 flex flex-col items-center justify-center">
        <div className="flex items-center space-x-4">
          <button className="text-neutral-400 hover:text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.86 7 4.701 1.797a.5.5 0 0 0-.753.43v10.546a.5.5 0 0 0 .753.43L13.86 9a.5.5 0 0 0 0-.999z"></path>
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
            </svg>
          </button>
          <button className="text-neutral-400 hover:text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.14 9 11.3 14.203a.5.5 0 0 0 .753-.43V3.227a.5.5 0 0 0-.753-.43L2.14 7a.5.5 0 0 0 0 .999z"></path>
            </svg>
          </button>
        </div>
        <div className="w-full flex items-center mt-2">
          <span className="text-xs text-neutral-400 mr-2">1:24</span>
          <div className="h-1 flex-1 bg-neutral-700 rounded-full">
            <div className="h-full w-1/3 bg-white rounded-full"></div>
          </div>
          <span className="text-xs text-neutral-400 ml-2">3:45</span>
        </div>
      </div>
      
      <div className="w-1/4 flex justify-end items-center space-x-3 text-neutral-400">
        <button className="hover:text-white">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.426 2.574a2.831 2.831 0 0 0-4.797 1.55l3.247 3.247a2.831 2.831 0 0 0 1.55-4.797zM10.5 8.118l-2.619-2.62A63303.13 63303.13 0 0 0 4.74 9.075L2.065 12.12a1.287 1.287 0 0 0 1.816 1.816l3.06-2.688 3.56-3.129zM7.12 4.094a4.331 4.331 0 1 1 4.786 4.786l-3.974 3.493-3.06 2.689a2.787 2.787 0 0 1-3.933-3.933l2.676-3.045 3.505-3.99z"></path>
          </svg>
        </button>
        <button className="hover:text-white">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5zm2.5-1a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2h-9z"></path>
          </svg>
        </button>
        <button className="hover:text-white">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 2.75C6 1.784 6.784 1 7.75 1h6.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15h-6.5A1.75 1.75 0 0 1 6 13.25V2.75zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25h-6.5zm-6 0a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25H4V11H1.75A1.75 1.75 0 0 1 0 9.25v-6.5C0 1.784.784 1 1.75 1H4v1.5H1.75zM4 15H2v-1.5h2V15z"></path>
            <path d="M13 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-1-5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
          </svg>
        </button>
        <div className="flex items-center w-20">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z"></path>
          </svg>
          <div className="h-1 flex-1 bg-neutral-700 rounded-full mx-2">
            <div className="h-full w-2/3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}