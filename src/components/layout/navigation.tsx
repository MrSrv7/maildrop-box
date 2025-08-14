import Link from 'next/link';
import { Mail, Home } from 'lucide-react';

interface NavigationProps {
  currentPath?: string;
}

export function Navigation({ currentPath }: NavigationProps) {
  return (
    <nav className="flex items-center gap-4">
      <Link 
        href="/"
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      {currentPath?.startsWith('/inbox') && (
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Mail className="w-4 h-4" />
          <span className="hidden sm:inline">Inbox</span>
        </div>
      )}
    </nav>
  );
}
