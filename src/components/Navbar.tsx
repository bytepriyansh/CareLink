import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut, LifeBuoy } from 'lucide-react';
import { ThemeToggle } from './ui/theme-toggle';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import clsx from 'clsx';
import { useAuth } from '../hooks/use-auth';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Assistant', path: '/assistant' },
  { name: 'Vitals', path: '/vitals' },
  { name: 'Report', path: '/report' },
  { name: 'Sketch2AI', path: '/sketch' },
  { name: 'BodyLanguage', path: '/body' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.displayName) return 'U';
    const names = user.displayName.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-xl border-b',
        scrolled
          ? 'bg-white/80 dark:bg-slate-900/90 border-slate-200/30 dark:border-slate-800 shadow-lg'
          : 'bg-white/30 dark:bg-slate-900/30 border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center space-x-3 group relative"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative z-10">
              <Heart className="h-8 w-8 text-teal-500 group-hover:text-teal-400 transition-colors duration-300" />
              <div className="absolute -inset-2 bg-teal-500/20 rounded-full blur-md opacity-70 group-hover:bg-teal-400/30 animate-pulse transition-all duration-500 pointer-events-none"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent tracking-tight">
              CareLink AI
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  'relative px-3 py-2 text-sm font-medium transition-all duration-300 group',
                  location.pathname === item.path
                    ? 'text-teal-500'
                    : 'text-gray-700 dark:text-gray-300 hover:text-teal-500'
                )}
              >
                {item.name}
                <span className={clsx(
                  'absolute bottom-0 left-1/2 w-0 h-[2px] bg-gradient-to-r from-teal-400 to-blue-500 rounded-full transform -translate-x-1/2 transition-all duration-300',
                  location.pathname === item.path ? 'w-10' : 'group-hover:w-6'
                )}></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <DropdownMenu onOpenChange={setProfileOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 hover:bg-white/20 dark:hover:bg-slate-700/40 transition-all duration-300"
                  >
                    <Avatar className="h-9 w-9 border-2 border-white/20 hover:border-teal-400/30 transition-colors duration-300">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    {profileOpen && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 blur-md animate-pulse transition-all duration-500 pointer-events-none"></div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 mt-2 backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/20 dark:border-slate-700/50 rounded-xl shadow-xl"
                  align="end"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-700/50" />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer focus:bg-gray-100/50 dark:focus:bg-slate-700/50 transition-colors duration-200"
                  >
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4 text-teal-500" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer focus:bg-gray-100/50 dark:focus:bg-slate-700/50 transition-colors duration-200"
                  >
                    <Link to="/support">
                      <LifeBuoy className="mr-2 h-4 w-4 text-teal-500" />
                      <span>Support</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-700/50" />
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-red-100/50 dark:focus:bg-red-900/50 text-red-500 dark:text-red-400 transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="hidden sm:flex bg-gradient-to-r from-white/10 to-white/20 border border-white/20 hover:from-white/20 hover:to-white/30 dark:from-slate-700/20 dark:to-slate-700/40 dark:hover:from-slate-700/30 dark:hover:to-slate-700/50 transition-all duration-300 hover:shadow-md"
                  >
                    Sign In
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? (
                    <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={clsx(
          'md:hidden overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-white/20 dark:border-slate-800/50 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                'block px-4 py-3 rounded-lg font-medium text-base transition-all duration-300',
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/70 dark:to-blue-900/70 text-teal-600 dark:text-teal-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-teal-500'
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-4 py-3 rounded-lg font-medium text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-teal-500 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg font-medium text-base text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-300"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-4 py-3 rounded-lg font-medium text-base bg-gradient-to-r from-teal-500/10 to-blue-500/10 text-teal-600 dark:text-teal-300 hover:from-teal-500/20 hover:to-blue-500/20 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
