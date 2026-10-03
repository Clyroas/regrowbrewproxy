export default function ArchitectureSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Proxy Architecture</h1>
        <p className="text-gray-400">How the GrowBrew proxy intercepts and modifies Growtopia traffic</p>
      </div>

      {/* Architecture Diagram */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Network Flow</h2>
        <div className="relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Client */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 w-full lg:w-48 text-center">
              <div className="text-3xl mb-2">🎮</div>
              <p className="text-sm font-bold text-blue-400">GT Client</p>
              <p className="text-xs text-gray-400">Connects to 127.0.0.1:2</p>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-green-400 text-xs">ENet UDP</div>
              <div className="w-24 lg:w-32 h-0.5 bg-gradient-to-r from-blue-500 to-green-500" />
              <div className="text-xs text-gray-500">Port 2</div>
            </div>

            {/* Proxy */}
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 w-full lg:w-56 text-center">
              <div className="text-3xl mb-2">🔄</div>
              <p className="text-sm font-bold text-green-400">GrowBrew Proxy</p>
              <p className="text-xs text-gray-400">Intercepts & modifies packets</p>
              <div className="mt-2 flex flex-wrap gap-1 justify-center">
                <span className="px-2 py-0.5 text-[10px] rounded bg-gray-800 text-gray-300">Server Host</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-gray-800 text-gray-300">Client Host</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-gray-800 text-gray-300">HTTP Server</span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-green-400 text-xs">ENet UDP</div>
              <div className="w-24 lg:w-32 h-0.5 bg-gradient-to-r from-green-500 to-purple-500" />
              <div className="text-xs text-gray-500">Port 17091</div>
            </div>

            {/* Server */}
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 w-full lg:w-48 text-center">
              <div className="text-3xl mb-2">🌐</div>
              <p className="text-sm font-bold text-purple-400">GT Server</p>
              <p className="text-xs text-gray-400">Official Growtopia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Components */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            title: 'ENet Server (m_Host)',
            desc: 'Listens on port 2 for the GT client. Uses CRC32 checksum + Range Coder compression + usingNewPacketForServer flag.',
            color: 'blue',
            details: ['Max peers: 32', 'Channels: 2', 'Protocol: New (type2|1)']
          },
          {
            title: 'ENet Client (client)',
            desc: 'Connects to the real Growtopia server. Mirrors all packets through the proxy with modifications.',
            color: 'purple',
            details: ['Max peers: 64', 'Channels: 2', 'Protocol: New (type2|1)']
          },
          {
            title: 'HTTP Server',
            desc: 'Intercepts server_data.php requests. Returns proxy IP/port so client connects locally.',
            color: 'green',
            details: ['Port 80', 'POST handler', 'Dynamic IP/port fetch']
          },
          {
            title: 'Packet Handler',
            desc: 'Core message processing. Handles both client→server and server→client packet interception.',
            color: 'amber',
            details: ['HandlePacketFromClient()', 'HandlePacketFromServer()', 'VariantList parsing']
          },
          {
            title: 'World Serializer',
            desc: 'Full world data deserialization including all tile extras up to type 0x5F.',
            color: 'red',
            details: ['Tile mapping', 'Dropped items', 'Player tracking']
          },
          {
            title: 'Variant System',
            desc: 'Parses and constructs Growtopia variant call packets (RPC mechanism).',
            color: 'cyan',
            details: ['String/Int/Float/Vector args', 'Function name dispatch', 'GamePacketProton builder']
          },
        ].map((comp) => (
          <div key={comp.title} className={`p-5 rounded-xl bg-gray-900 border border-${comp.color}-500/20`}>
            <h3 className={`text-sm font-bold text-${comp.color}-400 mb-2`}>{comp.title}</h3>
            <p className="text-xs text-gray-400 mb-3">{comp.desc}</p>
            <div className="flex flex-wrap gap-1">
              {comp.details.map((d) => (
                <span key={d} className="px-2 py-0.5 text-[10px] rounded bg-gray-800 text-gray-300 border border-gray-700">
                  {d}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* File Structure */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">📁 Project Structure</h2>
        <div className="font-mono text-sm text-gray-300 space-y-1">
          {[
            { path: 'GrowbrewProxy/', type: 'dir', depth: 0 },
            { path: '├── Program.cs', type: 'file', depth: 1, desc: 'Entry point' },
            { path: '├── MainForm.cs', type: 'file', depth: 1, desc: 'Main UI + proxy logic + logon packet' },
            { path: '├── HandleMessages.cs', type: 'file', depth: 1, desc: 'Packet interception handler' },
            { path: '├── PacketSending.cs', type: 'file', depth: 1, desc: 'ENet packet sending utilities' },
            { path: '├── NetTypes.cs', type: 'file', depth: 1, desc: 'Packet/Message type enums (UPDATED)' },
            { path: '├── TankPacketUpdate.cs', type: 'file', depth: 1, desc: '56-byte tank packet struct' },
            { path: '├── VariantList.cs', type: 'file', depth: 1, desc: 'Variant call parser/builder' },
            { path: '├── WorldAndPlayer.cs', type: 'file', depth: 1, desc: 'World serialization (UPDATED)' },
            { path: '├── HTTPServer.cs', type: 'file', depth: 1, desc: 'HTTP intercept server (UPDATED)' },
            { path: '├── ItemDatabase.cs', type: 'file', depth: 1, desc: 'Item definitions' },
            { path: '├── PriceChecker.cs', type: 'file', depth: 1, desc: 'Item price lookup' },
            { path: '├── AccountChecker.cs', type: 'file', depth: 1, desc: 'Account validation' },
            { path: '├── HardwareID.cs', type: 'file', depth: 1, desc: 'HWID generation/spoofing' },
            { path: '├── DllInjector.cs', type: 'file', depth: 1, desc: 'DLL injection utilities' },
            { path: '├── ENet.Managed/', type: 'dir', depth: 1, desc: 'ENet wrapper (v6+)' },
            { path: '└── Kernys.Bson/', type: 'dir', depth: 1, desc: 'BSON config serialization' },
          ].map((item) => (
            <div key={item.path} className="flex items-center gap-2 hover:bg-gray-800/30 px-2 py-0.5 rounded">
              <span className={item.type === 'dir' ? 'text-yellow-400' : 'text-gray-400'}>
                {item.path}
              </span>
              {item.desc && (
                <span className="text-xs text-gray-500 ml-2">— {item.desc}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
