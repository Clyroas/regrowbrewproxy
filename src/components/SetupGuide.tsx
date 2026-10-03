export default function SetupGuide() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Setup Guide</h1>
        <p className="text-gray-400">How to build and run the updated GrowBrew Proxy v3.0</p>
      </div>

      {/* Prerequisites */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">📋 Prerequisites</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: '.NET 8.0 SDK', desc: 'Download from dotnet.microsoft.com', required: true },
            { title: 'Visual Studio 2022', desc: 'Or VS Code with C# Dev Kit', required: true },
            { title: 'ENet.Managed v6+', desc: 'NuGet package (auto-installed)', required: true },
            { title: 'Windows 10/11 x64', desc: 'ARM64 support experimental', required: true },
            { title: 'Growtopia Client', desc: 'Latest version from official sources', required: true },
            { title: 'Admin Privileges', desc: 'For editing hosts file', required: false },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
              <span className={`text-lg ${item.required ? 'text-green-400' : 'text-gray-500'}`}>
                {item.required ? '✓' : '○'}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">🚀 Setup Steps</h2>
        <div className="space-y-6">
          {[
            {
              step: 1,
              title: 'Clone the Repository',
              code: 'git clone https://github.com/Clyroas/regrowbrewproxy.git\ncd regrowbrewproxy',
              note: 'Or download the updated v3.0 source from the releases page.'
            },
            {
              step: 2,
              title: 'Restore NuGet Packages',
              code: 'dotnet restore GrowbrewProxy.sln',
              note: 'This installs ENet.Managed v6+ and other dependencies.'
            },
            {
              step: 3,
              title: 'Build the Project',
              code: 'dotnet build -c Release -r win-x64',
              note: 'Make sure to enable "Allow unsafe code" in project properties.'
            },
            {
              step: 4,
              title: 'Edit Hosts File',
              code: '# Add to C:\\Windows\\System32\\drivers\\etc\\hosts:\n127.0.0.1 growtopia1.com\n127.0.0.1 growtopia2.com',
              note: 'Run Notepad as Administrator to edit this file.'
            },
            {
              step: 5,
              title: 'Copy enet.dll',
              code: '# Copy enet.dll to the build output folder:\ncopy enet.dll bin\\Release\\net8.0\\win-x64\\',
              note: 'The custom ENet native library is required for usingNewPacket support.'
            },
            {
              step: 6,
              title: 'Run the Proxy',
              code: 'cd bin\\Release\\net8.0\\win-x64\\\n.\\GrowbrewProxy.exe',
              note: 'Click "Start HTTP Server" then "Start Proxy" in the GUI.'
            },
            {
              step: 7,
              title: 'Launch Growtopia',
              code: '# Just open Growtopia normally - it will connect through the proxy',
              note: 'The proxy intercepts all traffic. Check the log tab for activity.'
            },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-sm font-bold text-green-400 flex-shrink-0">
                {s.step}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs text-green-300 border border-gray-700 mb-2">
                  <pre className="whitespace-pre-wrap">{s.code}</pre>
                </div>
                <p className="text-xs text-gray-400">💡 {s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">🔧 Troubleshooting</h2>
        <div className="space-y-3">
          {[
            {
              problem: 'Client disconnects immediately after connecting',
              solution: 'Ensure CRC32 + Range Coder are enabled and usingNewPacketForServer is set. Check that enet.dll is in the output folder.'
            },
            {
              problem: 'Client ignores packets / no world loads',
              solution: 'Packet exceeds 16384 bytes. Check that extended data flag (0x08) is set when sending data > 56 bytes.'
            },
            {
              problem: 'Login fails / "Invalid version"',
              solution: 'Update game_version and protocol fields in CreateLogonPacket. Check the latest values from server_data.php.'
            },
            {
              problem: 'Items.dat re-downloads every login',
              solution: 'Hash mismatch in OnSuperMainStart. Ensure the items.dat hash matches what the server sends.'
            },
            {
              problem: 'Players invisible to each other',
              solution: 'net_id must be unique per world. Check that player net IDs are properly assigned.'
            },
            {
              problem: 'ENet.Managed fails to load',
              solution: 'Reinstall the NuGet package. Ensure enet.dll native library matches your architecture (x64).'
            },
            {
              problem: 'Random disconnects in populated worlds',
              solution: 'Increase timeout values: peer.Timeout(1000, 5000, 8000). Ensure rate limits are respected.'
            },
            {
              problem: 'World serialization fails / crashes',
              solution: 'Check tile extra type handling. Unknown types should be handled gracefully with a default skip.'
            },
          ].map((item) => (
            <div key={item.problem} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
              <p className="text-sm font-medium text-red-400">❌ {item.problem}</p>
              <p className="text-xs text-gray-300 mt-1">✅ {item.solution}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Credits */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">👥 Credits</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'DEERUX (playingo)', role: 'Original proxy author' },
            { name: 'iProgramInCpp', role: 'Tank packet struct, variant system, HashBytes' },
            { name: 'moien007', role: 'ENet.Managed wrapper library' },
            { name: 'Kernys', role: 'BSON serialization library' },
            { name: 'ama6nen', role: 'BRB status change exploit' },
            { name: 'Ghost (slime)', role: 'on_step_on_tile_mod exploit' },
            { name: 'mar4ello6', role: 'ENet protocol fix for type2|1' },
            { name: 'NetroIndonesia', role: 'GTPS protocol documentation (2026)' },
          ].map((credit) => (
            <div key={credit.name} className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                {credit.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{credit.name}</p>
                <p className="text-xs text-gray-400">{credit.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-6">
        <h2 className="text-lg font-bold text-red-400 mb-2">⚠️ Disclaimer</h2>
        <p className="text-sm text-gray-300">
          This project is for educational and research purposes only. Using proxies or modified clients
          may violate Growtopia's Terms of Service. The authors are not responsible for any bans or
          account actions resulting from the use of this software. Growtopia is a trademark of Ubisoft.
        </p>
      </div>
    </div>
  );
}
