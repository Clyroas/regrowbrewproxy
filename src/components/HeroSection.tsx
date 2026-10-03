export default function HeroSection() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 p-8 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
              v3.0 — 2026 Edition
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/30">
              Growtopia v4.80+
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            GrowBrew Proxy
            <span className="text-green-400"> Updated</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mb-6">
            A complete reverse-engineering and update of the open-source Growtopia ENet proxy,
            now supporting the latest Growtopia protocol (2026) with modern packet types,
            updated login flow, and new tile extra serialization.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-300">ENet Protocol 160+</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm text-gray-300">items.dat v26</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-sm text-gray-300">47 Packet Types</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Files Updated', value: '15+', color: 'green' },
          { label: 'New Packet Types', value: '12', color: 'blue' },
          { label: 'Tile Extras Added', value: '20+', color: 'purple' },
          { label: 'Protocol Version', value: '160', color: 'amber' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
            <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* What Changed */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">🔄 What Changed in v3.0</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Protocol Update', desc: 'Updated from protocol 120 to 160+ with new ENet handshake requirements' },
            { title: 'Game Version', desc: 'Updated from v4.20 to v4.80+ with new login fields and meta data' },
            { title: 'New Packet Types', desc: 'Added PVE_UPDATE_MODE, PVE_NPC, PVP_CARD_BATTLE, SET_EXTRA_MODS, ON_STEP_ON_TILE_MOD' },
            { title: 'Tile Extras', desc: 'Added serialization for types 0x4B-0x5F (pet system, dungeons, auction block)' },
            { title: 'HTTP Server', desc: 'Updated server_data.php response with type2|1 and modern meta fields' },
            { title: 'Login Flow', desc: 'Added new required fields: captcha_hash, user3, platform, ubi_token' },
            { title: 'Variant System', desc: 'Added support for Vector2, Vector3, Rect types in variant calls' },
            { title: 'Anti-Detection', desc: 'Updated spoofing methods for modern client integrity checks' },
          ].map((item) => (
            <div key={item.title} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-green-400">{item.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Original vs Updated */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">📊 Original vs Updated Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400">Feature</th>
                <th className="text-left py-3 px-4 text-red-400">Original (v2.3)</th>
                <th className="text-left py-3 px-4 text-green-400">Updated (v3.0)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {[
                ['Game Version', '4.20', '4.80+'],
                ['Protocol', '120', '160+'],
                ['ENet Wrapper', 'ENet.Managed v5', 'ENet.Managed v6+'],
                ['Packet Types', '38', '47'],
                ['Tile Extra Types', '0x4A', '0x5F+'],
                ['Login Fields', '15', '25+'],
                ['items.dat Support', 'v18', 'v26'],
                ['Target Framework', '.NET 5.0', '.NET 8.0'],
                ['HTTP Response', 'Basic', 'Full modern response'],
                ['Pet System', '❌', '✅'],
                ['Dungeon Support', '❌', '✅'],
                ['Auction Block', '❌', '✅'],
              ].map(([feature, old, newVal]) => (
                <tr key={feature} className="hover:bg-gray-800/30">
                  <td className="py-2 px-4 text-gray-300">{feature}</td>
                  <td className="py-2 px-4 text-red-300">{old}</td>
                  <td className="py-2 px-4 text-green-300">{newVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
