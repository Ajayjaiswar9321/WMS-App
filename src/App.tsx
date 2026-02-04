import { useEffect } from 'react';
import { useAuthStore, useUIStore } from '@/store';
import { LoginScreen } from '@/screens/LoginScreen';
import { MainApp } from '@/screens/MainApp';
import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { theme } = useUIStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="h-full w-full overflow-hidden">
      {isAuthenticated ? <MainApp /> : <LoginScreen />}
    </div>
  );
}

export default App;
