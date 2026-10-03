interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'architecture', label: 'Architecture', icon: '🏗️' },
  { id: 'protocol', label: 'Protocol Updates', icon: '📡' },
  { id: 'code', label: 'Updated Source', icon: '💻' },
  { id: 'changelog', label: 'Changelog v3.0', icon: '📋' },
  { id: 'setup', label: 'Setup Guide', icon: '🔧' },
];

export default function Sidebar({ activeSection, setActiveSection, isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-800 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xl font-bold">
              G
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">GrowBrew Proxy</h1>
              <p className="text-xs text-green-400">v3.0 — 2026 Updated</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Original by:</p>
            <p className="text-sm text-white font-medium">DEERUX & iProgramInCpp</p>
            <p className="text-xs text-gray-500 mt-2">Updated for Growtopia v4.80+</p>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-xs text-amber-400 font-medium">⚠️ Educational Purpose</p>
            <p className="text-xs text-amber-200/70 mt-1">This project is for educational/research purposes only.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
