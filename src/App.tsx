import { useState } from 'react';
import Sidebar from './components/Sidebar';
import HeroSection from './components/HeroSection';
import ArchitectureSection from './components/ArchitectureSection';
import CodeViewer from './components/CodeViewer';
import ChangelogSection from './components/ChangelogSection';
import ProtocolSection from './components/ProtocolSection';
import SetupGuide from './components/SetupGuide';

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <main className="flex-1 lg:ml-72">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg border border-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="max-w-6xl mx-auto px-4 py-8 lg:px-8">
          {activeSection === 'overview' && <HeroSection />}
          {activeSection === 'architecture' && <ArchitectureSection />}
          {activeSection === 'protocol' && <ProtocolSection />}
          {activeSection === 'code' && <CodeViewer />}
          {activeSection === 'changelog' && <ChangelogSection />}
          {activeSection === 'setup' && <SetupGuide />}
        </div>
      </main>
    </div>
  );
}
