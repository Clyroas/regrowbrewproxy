export default function ProtocolSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Protocol Updates for 2026</h1>
        <p className="text-gray-400">All changes made to support the latest Growtopia client</p>
      </div>

      {/* New Packet Types */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">📦 New Packet Types Added</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 text-gray-400">ID</th>
                <th className="text-left py-2 px-3 text-gray-400">Name</th>
                <th className="text-left py-2 px-3 text-gray-400">Direction</th>
                <th className="text-left py-2 px-3 text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {[
                { id: 39, name: 'PARTICLE_EFFECT_V2', dir: 'S→C', status: 'existing' },
                { id: 40, name: 'ARROW_TO_ITEM', dir: 'S→C', status: 'existing' },
                { id: 41, name: 'TILE_INDEX_SELECTION', dir: 'Both', status: 'existing' },
                { id: 42, name: 'UPDATE_PLAYER_TRIBUTE', dir: 'S→C', status: 'existing' },
                { id: 43, name: 'PVE_UPDATE_MODE', dir: 'S→C', status: 'new' },
                { id: 44, name: 'PVE_NPC', dir: 'Both', status: 'new' },
                { id: 45, name: 'PVP_CARD_BATTLE', dir: 'Both', status: 'new' },
                { id: 46, name: 'PVE_ATTACKED', dir: 'S→C', status: 'new' },
                { id: 47, name: 'PVE_LOGIC_UPDATE', dir: 'Both', status: 'new' },
                { id: 48, name: 'PVE_BOSS', dir: 'S→C', status: 'new' },
                { id: 49, name: 'SET_EXTRA_MODS', dir: 'Both', status: 'new' },
                { id: 50, name: 'ON_STEP_ON_TILE_MOD', dir: 'Both', status: 'new' },
              ].map((pkt) => (
                <tr key={pkt.id} className="hover:bg-gray-800/30">
                  <td className="py-2 px-3 text-gray-300 font-mono">{pkt.id}</td>
                  <td className="py-2 px-3 text-white font-medium">{pkt.name}</td>
                  <td className="py-2 px-3 text-gray-400">{pkt.dir}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      pkt.status === 'new'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {pkt.status === 'new' ? '✨ NEW' : 'Existing'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Updated Login Flow */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">🔐 Updated Login Flow</h2>
        <div className="space-y-3">
          {[
            { step: 1, title: 'HTTP POST to server_data.php', desc: 'Client fetches server IP/port. Proxy intercepts and returns local address.', changed: true },
            { step: 2, title: 'ENet Connect to proxy (port 2)', desc: 'Client connects via ENet with CRC32 + Range Coder + usingNewPacketForServer.', changed: false },
            { step: 3, title: 'SERVER_HELLO (type 1)', desc: 'Proxy sends SERVER_HELLO to client, triggering login data send.', changed: false },
            { step: 4, title: 'GENERIC_TEXT login packet', desc: 'Client sends login data. Proxy intercepts, modifies, and forwards with new fields.', changed: true },
            { step: 5, title: 'ENet Connect to real server', desc: 'Proxy connects to actual GT server with modified credentials.', changed: false },
            { step: 6, title: 'OnSuperMainStart variant', desc: 'Server sends items.dat hash, CDN URL, and settings.', changed: true },
            { step: 7, title: 'World entry', desc: 'Client enters world via action|enter_game and action|join_request.', changed: false },
          ].map((s) => (
            <div key={s.step} className={`flex items-start gap-3 p-3 rounded-lg ${s.changed ? 'bg-green-500/5 border border-green-500/20' : 'bg-gray-800/30'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${s.changed ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-300'}`}>
                {s.step}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{s.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Logon Fields */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">📝 New Logon Packet Fields</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {[
            { field: 'protocol|160', status: 'updated', note: 'Was 120' },
            { field: 'game_version|4.81', status: 'updated', note: 'Was 4.20' },
            { field: 'fz|{hash}', status: 'updated', note: 'File hash check' },
            { field: 'zf|-{hash}', status: 'updated', note: 'Negative file hash' },
            { field: 'captcha_hash|{hash}', status: 'new', note: 'reCAPTCHA bypass hash' },
            { field: 'user3|{uuid}', status: 'new', note: 'Ubisoft account UUID' },
            { field: 'platformID|0', status: 'updated', note: '0=mobile, 2=desktop' },
            { field: 'deviceVersion|40', status: 'updated', note: 'Was 0' },
            { field: 'tracker_id|{uuid}', status: 'new', note: 'Analytics tracker' },
            { field: 'mac|{mac}', status: 'existing', note: 'MAC address spoof' },
            { field: 'rid|{rid}', status: 'existing', note: 'Random ID spoof' },
            { field: 'wk|{winkey}', status: 'existing', note: 'Windows key spoof' },
            { field: 'vid|{vid}', status: 'new', note: 'Vendor ID' },
            { field: 'uuid|{uuid}', status: 'new', note: 'Device UUID' },
            { field: 'aid|{aid}', status: 'new', note: 'Advertising ID' },
            { field: 'gdpr|1', status: 'existing', note: 'GDPR consent' },
          ].map((f) => (
            <div key={f.field} className={`flex items-center gap-2 p-2 rounded text-xs font-mono ${
              f.status === 'new' ? 'bg-green-500/10 border border-green-500/20' :
              f.status === 'updated' ? 'bg-amber-500/10 border border-amber-500/20' :
              'bg-gray-800/50 border border-gray-700/50'
            }`}>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                f.status === 'new' ? 'bg-green-500/30 text-green-300' :
                f.status === 'updated' ? 'bg-amber-500/30 text-amber-300' :
                'bg-gray-700 text-gray-300'
              }`}>
                {f.status}
              </span>
              <span className="text-gray-200">{f.field}</span>
              <span className="text-gray-500 ml-auto">{f.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HTTP Response */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">🌐 Updated HTTP Server Response</h2>
        <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm border border-gray-700">
          <pre className="text-green-300 whitespace-pre-wrap">{`server|127.0.0.1
port|17091
loginurl|/player/login/validate
type|1
meta|ubisoft.com-growtopia-2026
beta_server|127.0.0.1
beta_port|17091
type2|1
maint|
proto|160
GTVersion|4.81`}</pre>
        </div>
      </div>
    </div>
  );
}
