export default function ChangelogSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Changelog v3.0</h1>
        <p className="text-gray-400">Complete list of changes from GrowBrew Proxy v2.3 to v3.0</p>
      </div>

      {/* Version badge */}
      <div className="flex items-center gap-4">
        <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
          <span className="text-green-400 font-bold">v3.0</span>
          <span className="text-gray-400 text-sm ml-2">— 2026 Edition</span>
        </div>
        <div className="text-sm text-gray-500">
          Based on original v2.3 by DEERUX & iProgramInCpp
        </div>
      </div>

      {/* Changelog entries */}
      <div className="space-y-4">
        {[
          {
            category: '🔧 Core Protocol',
            items: [
              'Updated protocol version from 120 to 160+ for Growtopia v4.80+',
              'Updated game_version from 4.20 to 4.81',
              'Added usingNewPacketForServer flag support (type2|1)',
              'Updated ENet.Managed wrapper to v6+ with async support',
              'Updated target framework from .NET 5.0 to .NET 8.0',
              'Fixed CRC32 + Range Coder initialization order',
              'Added proper null-termination for all text packets',
            ]
          },
          {
            category: '📦 New Packet Types',
            items: [
              'Added PVE_UPDATE_MODE (40) - Dungeon/PVE mode switching',
              'Added PVE_NPC (41) - NPC interaction in dungeons',
              'Added PVP_CARD_BATTLE (42) - Card battle system',
              'Added PVE_ATTACKED (43) - PVE damage events',
              'Added PVE_LOGIC_UPDATE (44) - PVE state sync',
              'Added PVE_BOSS (45) - Boss encounter handling',
              'Added SET_EXTRA_MODS (46) - Extra character modifications',
              'Added ON_STEP_ON_TILE_MOD (47) - Tile step modifiers',
              'Added PET_UPDATE (48) - Pet system (2025)',
              'Added DUNGEON_UPDATE (49) - Dungeon system (2024)',
              'Added AUCTION_UPDATE (50) - Auction block (2025)',
            ]
          },
          {
            category: '🌐 HTTP Server',
            items: [
              'Updated server_data.php response format for 2026 client',
              'Added loginurl field (/player/login/validate)',
              'Added type2|1 for new ENet protocol handshake',
              'Added maint field (maintenance mode indicator)',
              'Added proto field (protocol version 160)',
              'Added GTVersion field (4.81)',
              'Updated meta field to modern format',
              'Switched to HTTPS for server_data.php fetch',
            ]
          },
          {
            category: '🔐 Login Flow',
            items: [
              'Added captcha_hash field for reCAPTCHA bypass',
              'Added user3 field for Ubisoft account UUID',
              'Added vid (Vendor ID) generation',
              'Added uuid (Device UUID) generation',
              'Added aid (Advertising ID) generation',
              'Added tracker_id for analytics spoofing',
              'Updated fz/zf hash generation for file integrity',
              'Updated platformID handling (0=mobile, 2=desktop)',
              'Updated deviceVersion from 0 to 40',
              'Updated meta field format',
            ]
          },
          {
            category: '🗺️ World Serialization',
            items: [
              'Added tile extra type 0x4B - Pet system data',
              'Added tile extra type 0x4C - Dungeon portal config',
              'Added tile extra type 0x4D - Auction block data',
              'Added tile extra type 0x4E - Flash sale sign',
              'Added tile extra type 0x4F - Affiliate banner',
              'Added tile extra type 0x50 - Reward code terminal',
              'Added tile extra type 0x51 - Grow Pass station',
              'Added tile extra type 0x52 - Mentorship board',
              'Added tile extra type 0x53 - Broadcast crystal',
              'Added tile extra type 0x54 - Challenge board',
              'Added tile extra type 0x55 - Event totem',
              'Added tile extra type 0x56 - Weather controller',
              'Added tile extra type 0x57 - Music player',
              'Added tile extra type 0x58 - Surveillance camera',
              'Added tile extra type 0x59 - Smart fridge',
              'Added tile extra type 0x5A - Robot bench',
              'Added tile extra type 0x5B - Growmoji block',
              'Added tile extra type 0x5C - Banner stand',
              'Added tile extra type 0x5D - Achievement pedestal',
              'Added tile extra type 0x5E - Tournament board',
              'Added tile extra type 0x5F - Seasonal decoration',
            ]
          },
          {
            category: '✨ New Features',
            items: [
              'Added Pet system variant handling (OnPetUpdate)',
              'Added Dungeon update variant handling (OnDungeonUpdate)',
              'Added Auction update variant handling (OnAuctionUpdate)',
              'Added rate limiting helper (25 text / 80 game per 750ms)',
              'Added proper channel management (channel 0 for all traffic)',
              'Added null-termination enforcement for text packets',
              'Added items.dat v26 support (was v18)',
              'Added proper EXTENDED flag (0x08) documentation',
            ]
          },
          {
            category: '🐛 Bug Fixes',
            items: [
              'Fixed double ping reply causing disconnects',
              'Fixed text packet missing null terminator',
              'Fixed tile extra serialization buffer overflows',
              'Fixed subserver switching with new lmode parameter',
              'Fixed world serialization for large worlds (>200KB)',
              'Fixed inventory serialization item_count type (uint32 not uint16)',
              'Fixed random disconnects in populated worlds',
            ]
          },
        ].map((section) => (
          <div key={section.category} className="rounded-xl bg-gray-900 border border-gray-800 p-5">
            <h3 className="text-lg font-bold text-white mb-3">{section.category}</h3>
            <ul className="space-y-1.5">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
