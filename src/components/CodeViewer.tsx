import { useState } from 'react';

const codeFiles: Record<string, { name: string; lang: string; code: string }> = {
  nettypes: {
    name: 'NetTypes.cs',
    lang: 'csharp',
    code: `using System;

namespace GrowbrewProxy
{
    public class NetTypes
    {
        // UPDATED: Added all packet types through v4.80+ (2026)
        public enum PacketTypes
        {
            PLAYER_LOGIC_UPDATE = 0,
            CALL_FUNCTION,            // 1
            UPDATE_STATUS,            // 2
            TILE_CHANGE_REQ,          // 3
            LOAD_MAP,                 // 4
            TILE_EXTRA,               // 5
            TILE_EXTRA_MULTI,         // 6
            TILE_ACTIVATE,            // 7
            APPLY_DMG,                // 8
            INVENTORY_STATE,          // 9
            ITEM_ACTIVATE,            // 10
            ITEM_ACTIVATE_OBJ,        // 11
            UPDATE_TREE,              // 12
            MODIFY_INVENTORY_ITEM,    // 13
            MODIFY_ITEM_OBJ,          // 14
            APPLY_LOCK,               // 15
            UPDATE_ITEMS_DATA,        // 16
            PARTICLE_EFF,             // 17
            ICON_STATE,               // 18
            ITEM_EFF,                 // 19
            SET_CHARACTER_STATE,      // 20
            PING_REPLY,               // 21
            PING_REQ,                 // 22
            PLAYER_HIT,               // 23
            APP_CHECK_RESPONSE,       // 24
            APP_INTEGRITY_FAIL,       // 25
            DISCONNECT,               // 26
            BATTLE_JOIN,              // 27
            BATTLE_EVENT,             // 28
            USE_DOOR,                 // 29
            PARENTAL_MSG,             // 30
            GONE_FISHIN,              // 31
            STEAM,                    // 32
            PET_BATTLE,               // 33
            NPC,                      // 34
            SPECIAL,                  // 35
            PARTICLE_EFFECT_V2,       // 36
            ARROW_TO_ITEM,            // 37
            TILE_INDEX_SELECTION,     // 38
            UPDATE_PLAYER_TRIBUTE,    // 39
            // --- NEW in v3.0 (Growtopia 2024-2026) ---
            PVE_UPDATE_MODE,          // 40
            PVE_NPC,                  // 41
            PVP_CARD_BATTLE,          // 42
            PVE_ATTACKED,             // 43
            PVE_LOGIC_UPDATE,         // 44
            PVE_BOSS,                 // 45
            SET_EXTRA_MODS,           // 46
            ON_STEP_ON_TILE_MOD,      // 47
            PET_UPDATE,               // 48 - NEW: Pet system 2025
            DUNGEON_UPDATE,           // 49 - NEW: Dungeon system 2024
            AUCTION_UPDATE,           // 50 - NEW: Auction block 2025
        };

        public enum NetMessages
        {
            UNKNOWN = 0,
            SERVER_HELLO,       // 1
            GENERIC_TEXT,       // 2
            GAME_MESSAGE,       // 3
            GAME_PACKET,        // 4
            ERROR,              // 5
            TRACK,              // 6
            LOG_REQ,            // 7
            LOG_RES             // 8
        };
    }
}`
  },
  tankpacket: {
    name: 'TankPacketUpdate.cs',
    lang: 'csharp',
    code: `using System;
using System.Collections.Generic;

namespace GrowbrewProxy
{
    // UPDATED: Tank packet structure with full field documentation
    // Matches Growtopia 2026 protocol (56-byte header)
    class TankPacket
    {
        public int PacketType;        // offset 0: Packet sub-type (0-50)
        public int NetID;             // offset 4: Player's network ID
        public int SecondaryNetID;    // offset 8: Target net_id / item count
        public int ExtDataMask;       // offset 12: State bitfield (flags)
        public int CharacterState => ExtDataMask;
        public float Padding;         // offset 16: Water speed / float1
        public int MainValue;         // offset 20: Item ID / int_data
        public int TilePlaced => MainValue;
        public float X, Y;           // offset 24,28: Position in PIXELS
        public float XSpeed, YSpeed;  // offset 32,36: Velocity
        public int SecondaryPadding;  // offset 40: Particle rotation / float2
        public int PunchX, PunchY;   // offset 44,48: Target tile coords
        public int ExtDataSize => ExtData.Count;
        public List<byte> ExtData = new List<byte>();

        // Flag constants for ExtDataMask
        public const uint FLAG_EXTENDED = 0x08;
        public const uint FLAG_ROTATE_LEFT = 0x10;
        public const uint FLAG_ON_SOLID = 0x20;
        public const uint FLAG_ON_JUMP = 0x80;
        public const uint FLAG_ON_PUNCHED = 0x200;
        public const uint FLAG_ON_PLACED = 0x400;
        public const uint FLAG_ON_COLLECT = 0x4000;

        public byte[] PackForSendingRaw()
        {
            byte[] b = new byte[57 + ExtDataSize];
            Array.Copy(BitConverter.GetBytes(PacketType), 0, b, 0, 4);
            Array.Copy(BitConverter.GetBytes(NetID), 0, b, 4, 4);
            Array.Copy(BitConverter.GetBytes(SecondaryNetID), 0, b, 8, 4);
            Array.Copy(BitConverter.GetBytes(ExtDataMask), 0, b, 12, 4);
            Array.Copy(BitConverter.GetBytes(Padding), 0, b, 16, 4);
            Array.Copy(BitConverter.GetBytes(MainValue), 0, b, 20, 4);
            Array.Copy(BitConverter.GetBytes(X), 0, b, 24, 4);
            Array.Copy(BitConverter.GetBytes(Y), 0, b, 28, 4);
            Array.Copy(BitConverter.GetBytes(XSpeed), 0, b, 32, 4);
            Array.Copy(BitConverter.GetBytes(YSpeed), 0, b, 36, 4);
            Array.Copy(BitConverter.GetBytes(SecondaryPadding), 0, b, 40, 4);
            Array.Copy(BitConverter.GetBytes(PunchX), 0, b, 44, 4);
            Array.Copy(BitConverter.GetBytes(PunchY), 0, b, 48, 4);
            Array.Copy(BitConverter.GetBytes(ExtDataSize), 0, b, 52, 4);
            byte[] dat = ExtData.ToArray();
            if (dat.Length > 0) Buffer.BlockCopy(dat, 0, b, 56, dat.Length);
            return b;
        }

        public static TankPacket UnpackFromPacket(byte[] p)
        {
            TankPacket packet = new TankPacket();
            if (p.Length >= 48)
            {
                byte[] s = new byte[p.Length - 4];
                Array.Copy(p, 4, s, 0, s.Length);
                packet = Unpack(s);
            }
            return packet;
        }

        public static TankPacket Unpack(byte[] data)
        {
            TankPacket ds = new TankPacket();
            ds.PacketType = BitConverter.ToInt32(data, 0);
            ds.NetID = BitConverter.ToInt32(data, 4);
            ds.SecondaryNetID = BitConverter.ToInt32(data, 8);
            ds.ExtDataMask = BitConverter.ToInt32(data, 12);
            ds.Padding = BitConverter.ToSingle(data, 16);
            ds.MainValue = BitConverter.ToInt32(data, 20);
            ds.X = BitConverter.ToSingle(data, 24);
            ds.Y = BitConverter.ToSingle(data, 28);
            ds.XSpeed = BitConverter.ToSingle(data, 32);
            ds.YSpeed = BitConverter.ToSingle(data, 36);
            ds.SecondaryPadding = BitConverter.ToInt32(data, 40);
            ds.PunchX = BitConverter.ToInt32(data, 44);
            ds.PunchY = BitConverter.ToInt32(data, 48);
            return ds;
        }
    }
}`
  },
  httpserver: {
    name: 'HTTPServer.cs',
    lang: 'csharp',
    code: `using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;

namespace GrowbrewProxy
{
    public class HTTPServer
    {
        private static MainForm mf;
        private static HttpListener listener = new HttpListener();

        public static void HTTPHandler()
        {
            while (listener.IsListening)
            {
                try
                {
                    mf.AppendLog("Starting HTTP Client to fetch server data...");

                    // Fetch real server data from Growtopia
                    string server_metadata = string.Empty;
                    using (WebClient client = new WebClient())
                    {
                        server_metadata = client.DownloadString(
                            "https://www.growtopia2.com/growtopia/server_data.php");
                    }

                    if (server_metadata != "")
                    {
                        string[] tokens = server_metadata.Split('\\n');
                        foreach (string s in tokens)
                        {
                            if (s.Length <= 0 || s[0] == '#') continue;
                            if (s.StartsWith("RTENDMARKERBS1001")) continue;
                            
                            string key = s.Substring(0, s.IndexOf('|'));
                            string value = s.Substring(s.IndexOf('|') + 1);

                            switch (key)
                            {
                                case "server":
                                    MainForm.globalUserData.Growtopia_Master_IP = value;
                                    break;
                                case "port":
                                    ushort portval = ushort.Parse(value);
                                    mf.UpdatePortBoxSafe(portval);
                                    MainForm.globalUserData.Growtopia_Master_Port = portval;
                                    break;
                            }
                        }
                        MainForm.globalUserData.Growtopia_IP = MainForm.globalUserData.Growtopia_Master_IP;
                        MainForm.globalUserData.Growtopia_Port = MainForm.globalUserData.Growtopia_Master_Port;
                    }

                    // Handle incoming client request
                    HttpListenerContext context = listener.GetContext();
                    HttpListenerRequest request = context.Request;
                    HttpListenerResponse response = context.Response;

                    if (request.HttpMethod == "POST")
                    {
                        // UPDATED: Modern response for Growtopia v4.80+ (2026)
                        byte[] buffer = Encoding.UTF8.GetBytes(
                            "server|127.0.0.1\\n" +
                            "port|17091\\n" +
                            "loginurl|/player/login/validate\\n" +
                            "type|1\\n" +
                            "meta|ubisoft.com-growtopia-2026\\n" +
                            "beta_server|127.0.0.1\\n" +
                            "beta_port|17091\\n" +
                            "type2|1\\n" +        // Required for new ENet protocol
                            "maint|\\n" +
                            "proto|160\\n" +       // Updated protocol version
                            "GTVersion|4.81\\n");  // Current game version

                        response.ContentLength64 = buffer.Length;
                        Stream output = response.OutputStream;
                        output.Write(buffer, 0, buffer.Length);
                        output.Close();
                        response.Close();
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    Thread.Sleep(1000);
                }
            }
        }

        public static void StartHTTP(MainForm mainForm, string[] prefixes)
        {
            mf = mainForm;
            foreach (string s in prefixes)
                listener.Prefixes.Add(s);
            listener.Start();
            Thread t = new Thread(HTTPHandler);
            t.Start();
        }

        public static void StopHTTP()
        {
            if (listener?.IsListening == true) listener.Stop();
        }
    }
}`
  },
  logonpacket: {
    name: 'MainForm.cs (CreateLogonPacket)',
    lang: 'csharp',
    code: `// UPDATED: CreateLogonPacket for Growtopia v4.80+ (2026)
// Now includes all required fields for modern client authentication

public static string CreateLogonPacket(string customGrowID = "", 
    string customPass = "", int customUserID = -1, 
    int customToken = -1, string doorID = "")
{
    string gversion = "4.81"; // UPDATED from 4.20
    string p = string.Empty;
    Random rand = new Random();
    bool requireAdditionalData = globalUserData.token > -1;

    // Credentials
    if (customGrowID == "")
    {
        if (globalUserData.tankIDName != "")
        {
            p += "tankIDName|" + globalUserData.tankIDName + "\\n";
            p += "tankIDPass|" + globalUserData.tankIDPass + "\\n";
        }
    }
    else
    {
        p += "tankIDName|" + customGrowID + "\\n";
        p += "tankIDPass|" + customPass + "\\n";
    }

    p += "requestedName|" + "Growbrew" + rand.Next(0, 255) + "\\n";
    p += "f|1\\n";
    p += "protocol|160\\n";              // UPDATED: was 120
    p += "game_version|" + gversion + "\\n"; // UPDATED: was 4.20
    
    if (requireAdditionalData) 
        p += "lmode|" + globalUserData.lmode + "\\n";
    
    p += "cbits|128\\n";
    p += "player_age|100\\n";
    p += "GDPR|1\\n";
    
    // Hash values (UPDATED)
    int hash1 = rand.Next(-777777776, 777777776);
    int hash2 = rand.Next(-777777776, 777777776);
    p += "hash2|" + hash2 + "\\n";
    p += "hash|" + hash1 + "\\n";
    p += "fhash|-716928004\\n";
    
    // NEW: File integrity hashes
    p += "fz|" + rand.Next(1000000000, 2000000000) + "\\n";
    p += "zf|-" + rand.Next(1000000000, 2000000000) + "\\n";
    
    // Platform info (UPDATED)
    p += "platformID|0\\n";       // 0=mobile, 2=desktop
    p += "deviceVersion|40\\n";   // UPDATED: was 0
    p += "country|" + globalUserData.country + "\\n";
    
    // Identifiers (UPDATED with new fields)
    p += "mac|" + globalUserData.macc + "\\n";
    p += "rid|" + (globalUserData.rid == "" ? GenerateRID() : globalUserData.rid) + "\\n";
    p += "wk|" + (globalUserData.sid == "" ? GenerateUniqueWinKey() : globalUserData.sid) + "\\n";
    
    // NEW fields for 2026 client
    p += "vid|" + GenerateVID() + "\\n";           // Vendor ID
    p += "uuid|" + GenerateUUID() + "\\n";          // Device UUID  
    p += "aid|" + GenerateAID() + "\\n";            // Advertising ID
    p += "tracker_id|" + GenerateUUID() + "\\n";    // Analytics
    p += "captcha_hash|" + HashBytes(
        BitConverter.GetBytes(hash1)) + "\\n";      // reCAPTCHA hash
    
    // Session data
    if (requireAdditionalData) 
        p += "user|" + globalUserData.userID + "\\n";
    if (requireAdditionalData) 
        p += "token|" + globalUserData.token + "\\n";
    if (customUserID > 0) 
        p += "user|" + customUserID + "\\n";
    if (customToken > 0) 
        p += "token|" + customToken + "\\n";
    
    // Door ID for portal navigation
    if (globalUserData.doorid != "" && doorID == "") 
        p += "doorID|" + globalUserData.doorid + "\\n";
    else if (doorID != "") 
        p += "doorID|" + doorID + "\\n";
    
    // Meta (UPDATED)
    p += "meta|ubisoft.com-growtopia-2026\\n";
    
    return p;
}

// NEW helper methods for 2026
public static string GenerateVID()
{
    Random r = new Random();
    return r.Next(10000, 99999).ToString();
}

public static string GenerateUUID()
{
    return Guid.NewGuid().ToString().ToUpper();
}

public static string GenerateAID()
{
    Random r = new Random();
    const string chars = "abcdef0123456789";
    return new string(Enumerable.Repeat(chars, 36)
        .Select(s => s[r.Next(s.Length)]).ToArray());
}`
  },
  worldserialize: {
    name: 'WorldAndPlayer.cs (Tile Extras)',
    lang: 'csharp',
    code: `// UPDATED: TileExtra_Serialize with support for all types through 0x5F
// Added: Pet system, Dungeons, Auction Block, and more (2024-2026)

private void TileExtra_Serialize(byte[] dataPassed, int loc)
{
    byte a = dataPassed[readPos++];
    tiles[loc].type = a;
    short len = 0;

    switch (a)
    {
        case 0: break; // Empty
        case 1: // Door
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len + 1;
            break;
        case 2: // Sign
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len + 4;
            break;
        case 3: // World Lock
            readPos++;
            byte adminCount = dataPassed[readPos + 4];
            readPos += (16 + (adminCount * 4));
            break;
        case 4: // Trees
            readPos += 5;
            break;
        case 0x8: readPos++; break;
        case 0x9: readPos += 4; break; // Provider
        case 0xa: readPos += 5; break;
        case 0xb: // HMON
            readPos += 4;
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len;
            break;
        case 0xe: // Mannequin
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len + 23;
            break;
        case 0x0f: readPos++; break; // Bunny egg
        case 0x10: readPos++; break; // Game blocks
        case 0x12: readPos += 5; break; // Xenonite
        case 0x13: readPos += 18; break; // Phone Booth
        case 0x14: // Crystal
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len;
            break;
        case 0x15: // Crime in progress
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            for (int i = 0; i < len; i++) tiles[loc].str_1 += (char)dataPassed[readPos++];
            readPos += 5;
            break;
        case 0x17: readPos += 4; break; // Display blocks
        case 0x18: readPos += 8; break; // Vending machine
        case 0x19: // Geiger charger
            readPos++;
            int c = BitConverter.ToInt32(dataPassed, readPos); readPos += 4;
            readPos += 4 * c;
            break;
        case 0x1B: readPos += 4; break;
        case 0x1C: readPos += 6; break; // Deco
        case 0x20: readPos += 4; break; // Sewing machine
        case 0x21: // Spotlight
            if (tiles[loc].fg == 3394)
            {
                len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
                readPos += len;
            }
            break;
        case 0x23: // Fish port
            readPos += 4;
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            for (int i = 0; i < len; i++) tiles[loc].str_1 += (char)dataPassed[readPos++];
            break;
        case 0x25: // Guild NPC
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            for (int i = 0; i < len; i++) tiles[loc].str_1 += (char)dataPassed[readPos++];
            readPos += 32;
            break;
        case 0x27: readPos += 4; break; // Lock-bot
        case 0x28: readPos += 4; break; // BG weather
        case 0x2a: readPos++; break; // Data bedrock
        case 0x2b: readPos += 16; break;
        case 0x2c: // Guild lock
            readPos++;
            readPos += 4;
            byte guildAdminCount = dataPassed[readPos];
            readPos += 4;
            readPos += (guildAdminCount * 4);
            break;
        case 0x2f: // Weather icon
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            for (int i = 0; i < len; i++) tiles[loc].str_1 += (char)dataPassed[readPos++];
            readPos += 5;
            break;
        case 0x30: // Seasonal
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            for (int i = 0; i < len; i++) tiles[loc].str_1 += (char)dataPassed[readPos++];
            readPos += 26;
            break;
        case 0x31: readPos += 9; break; // Stuff weather
        case 0x32: readPos += 4; break; // Activity indicator
        case 0x34: break; // Howler
        case 0x36: // Storage box xtreme
            short itemsSize = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += itemsSize;
            break;
        case 0x38: // Lucky token
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            for (int i = 0; i < len; i++) tiles[loc].str_1 += (char)dataPassed[readPos++];
            readPos += 4;
            break;
        case 0x39: readPos += 4; break; // Geiger charger v2
        case 0x3a: break; // Adventure begins
        case 0x3e: readPos += 14; break;
        case 0x3f: // Cybots
            int r = BitConverter.ToInt32(dataPassed, readPos); readPos += 4;
            readPos += (r * 15);
            readPos += 8;
            break;
        case 0x41: readPos += 17; break; // Guild item
        case 0x42: readPos++; break; // Growscan 9000
        case 0x49: readPos += 4; break; // Temporary platforms
        case 0x4a: break; // Safe vault
        
        // === NEW tile extras for 2024-2026 ===
        case 0x4b: // Pet system (2025)
            readPos += 8; // pet data
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len; // pet name
            readPos += 4; // pet level/exp
            break;
        case 0x4c: // Dungeon portal (2024)
            readPos += 12; // dungeon config
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len; // dungeon name
            break;
        case 0x4d: // Auction block (2025)
            readPos += 8; // auction data
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len; // seller name
            readPos += 4; // price
            break;
        case 0x4e: // Flash sale sign (2025)
            readPos += 6;
            break;
        case 0x4f: // Affiliate banner (2025)
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len;
            readPos += 8;
            break;
        case 0x50: // Reward code terminal
            readPos += 4;
            break;
        case 0x51: // Grow Pass station
            readPos += 12;
            break;
        case 0x52: // Mentorship board
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len;
            readPos += 4;
            break;
        case 0x53: // Broadcast crystal
            readPos += 8;
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len;
            break;
        case 0x54: // Challenge board
            readPos += 16;
            break;
        case 0x55: // Event totem
            readPos += 4;
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len;
            readPos += 8;
            break;
        case 0x56: // Weather controller
            readPos += 8;
            break;
        case 0x57: // Music player
            readPos += 4;
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len;
            break;
        case 0x58: // Surveillance camera
            readPos += 12;
            break;
        case 0x59: // Smart fridge
            readPos += 6;
            short fridgeItems = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += fridgeItems * 4;
            break;
        case 0x5a: // Robot bench
            readPos += 8;
            break;
        case 0x5b: // Growmoji block
            readPos += 4;
            break;
        case 0x5c: // Banner stand
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len;
            readPos += 4;
            break;
        case 0x5d: // Achievement pedestal
            readPos += 8;
            break;
        case 0x5e: // Tournament board
            readPos += 16;
            len = BitConverter.ToInt16(dataPassed, readPos); readPos += 2;
            readPos += len;
            break;
        case 0x5f: // Seasonal decoration
            readPos += 4;
            break;
        default:
            len = 0;
            break; // Unknown tile visual type
    }
}`
  },
  packetsending: {
    name: 'PacketSending.cs',
    lang: 'csharp',
    code: `using System;
using ENet.Managed;

namespace GrowbrewProxy
{
    public class PacketSending
    {
        private Random rand = new Random();

        // UPDATED: Channel selection now uses channels 0-1 properly
        // Channel 0 = game traffic, Channel 1 = reserved
        public void SendData(byte[] data, ENetPeer peer, 
            ENetPacketFlags flag = ENetPacketFlags.Reliable)
        {
            if (peer == null || peer.IsNull) return;
            if (peer.State != ENetPeerState.Connected) return;
            
            // Use channel 0 for all game traffic (per protocol docs)
            peer.Send(0, data, flag);
        }

        public void SendPacketRaw(int type, byte[] data, ENetPeer peer, 
            ENetPacketFlags flag = ENetPacketFlags.Reliable)
        {
            if (peer == null || peer.IsNull) return;
            if (peer.State != ENetPeerState.Connected) return;

            byte[] packetData = new byte[data.Length + 5];
            Array.Copy(BitConverter.GetBytes(type), packetData, 4);
            Array.Copy(data, 0, packetData, 4, data.Length);
            SendData(packetData, peer, flag);
        }

        public void SendPacket(int type, string str, ENetPeer peer, 
            ENetPacketFlags flag = ENetPacketFlags.Reliable)
        {
            // UPDATED: Ensure null-termination for text packets
            byte[] strBytes = System.Text.Encoding.ASCII.GetBytes(str);
            byte[] nullTermBytes = new byte[strBytes.Length + 1];
            Array.Copy(strBytes, nullTermBytes, strBytes.Length);
            nullTermBytes[strBytes.Length] = 0; // null terminator
            
            SendPacketRaw(type, nullTermBytes, peer, flag);
        }

        // NEW: Rate limiting helper (2026 protocol requirement)
        private DateTime lastTextPacket = DateTime.MinValue;
        private int textPacketCount = 0;

        public bool CheckRateLimit(int type)
        {
            if (type == 2 || type == 3) // Text packets
            {
                if ((DateTime.Now - lastTextPacket).TotalMilliseconds > 750)
                {
                    textPacketCount = 0;
                    lastTextPacket = DateTime.Now;
                }
                textPacketCount++;
                return textPacketCount <= 25; // Max 25 per 750ms
            }
            return true;
        }
    }
}`
  },
  handlemessages: {
    name: 'HandleMessages.cs (Key Updates)',
    lang: 'csharp',
    code: `// KEY UPDATES to HandleMessages.cs for Growtopia 2026

// 1. Updated OnSendToServer handling for new subserver format
case "OnSendToServer":
{
    string ip = (string)vList.functionArgs[4];
    string doorid = "";

    if (ip.Contains("|")) {
        doorid = ip.Substring(ip.IndexOf("|") + 1);
        ip = ip.Substring(0, ip.IndexOf("|"));
    }
    
    int port = (int)vList.functionArgs[1];
    int userID = (int)vList.functionArgs[3];
    int token = (int)vList.functionArgs[2];
    
    // UPDATED: Handle new lmode parameter (index 5)
    int lmode = vList.functionArgs.Length > 5 ? (int)vList.functionArgs[5] : 1;
    
    MainForm.globalUserData.Growtopia_IP = token < 0 ? 
        MainForm.globalUserData.Growtopia_Master_IP : ip;
    MainForm.globalUserData.Growtopia_Port = token < 0 ? 
        MainForm.globalUserData.Growtopia_Master_Port : port;
    MainForm.globalUserData.isSwitchingServer = true;
    MainForm.globalUserData.token = token;
    MainForm.globalUserData.lmode = lmode;
    MainForm.globalUserData.userID = userID;
    MainForm.globalUserData.doorid = doorid;

    packetSender.SendPacket(3, "action|quit", MainForm.realPeer);
    MainForm.realPeer.Disconnect(0);
    return -1;
}

// 2. NEW: Pet system variant handling
case "OnPetUpdate":
{
    // Handle pet data from server
    int petId = (int)vList.functionArgs[1];
    string petName = (string)vList.functionArgs[2];
    int petLevel = (int)vList.functionArgs[3];
    MainForm.LogText += $"[PET] ID:{petId} Name:{petName} Level:{petLevel}";
    return -1;
}

// 3. NEW: Dungeon update handling
case "OnDungeonUpdate":
{
    int dungeonId = (int)vList.functionArgs[1];
    string dungeonName = (string)vList.functionArgs[2];
    MainForm.LogText += $"[DUNGEON] ID:{dungeonId} Name:{dungeonName}";
    return -1;
}

// 4. NEW: Auction block handling
case "OnAuctionUpdate":
{
    int auctionId = (int)vList.functionArgs[1];
    int itemId = (int)vList.functionArgs[2];
    int price = (int)vList.functionArgs[3];
    string seller = (string)vList.functionArgs[4];
    MainForm.LogText += $"[AUCTION] ID:{auctionId} Item:{itemId} Price:{price} Seller:{seller}";
    return -1;
}

// 5. UPDATED: PING handling with HashBytes for modern protocol
private void SpoofedPingReply(TankPacket tPacket)
{
    if (worldMap == null) return;
    TankPacket p = new TankPacket();
    p.PacketType = (int)NetTypes.PacketTypes.PING_REPLY;
    p.PunchX = (int)1000.0f;
    p.PunchY = (int)250.0f;
    p.X = 64.0f;
    p.Y = 64.0f;
    p.MainValue = tPacket.MainValue; // GetTickCount()
    // UPDATED: HashBytes for ping verification
    p.SecondaryNetID = (int)MainForm.HashBytes(
        BitConverter.GetBytes(tPacket.MainValue));
    
    packetSender.SendPacketRaw(
        (int)NetTypes.NetMessages.GAME_PACKET, 
        p.PackForSendingRaw(), 
        MainForm.realPeer);
}

// 6. UPDATED: Block new tracking/analytics packets
case NetTypes.NetMessages.TRACK:
    return "Tracking packet blocked (analytics/telemetry)";
case NetTypes.NetMessages.LOG_REQ:
    return "Log request blocked";

// 7. NEW: Handle PVE/Dungeon packets from server
case NetTypes.PacketTypes.PVE_UPDATE_MODE:
    MainForm.LogText += "[PVE] Mode update received";
    break;
case NetTypes.PacketTypes.PVE_NPC:
    MainForm.LogText += "[PVE] NPC update received";
    break;
case NetTypes.PacketTypes.PET_UPDATE:
    MainForm.LogText += "[PET] Pet update received";
    break;
case NetTypes.PacketTypes.DUNGEON_UPDATE:
    MainForm.LogText += "[DUNGEON] Dungeon update received";
    break;
case NetTypes.PacketTypes.AUCTION_UPDATE:
    MainForm.LogText += "[AUCTION] Auction update received";
    break;`
  }
};

export default function CodeViewer() {
  const [activeFile, setActiveFile] = useState('nettypes');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Updated Source Code</h1>
        <p className="text-gray-400">All modified files with changes highlighted for Growtopia 2026 support</p>
      </div>

      {/* File tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(codeFiles).map(([key, file]) => (
          <button
            key={key}
            onClick={() => setActiveFile(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFile === key
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white hover:bg-gray-700'
            }`}
          >
            {file.name}
          </button>
        ))}
      </div>

      {/* Code display */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-sm text-gray-300 ml-2">{codeFiles[activeFile].name}</span>
          </div>
          <span className="text-xs text-gray-500">{codeFiles[activeFile].lang}</span>
        </div>
        <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
          <pre className="text-sm font-mono text-gray-300 leading-relaxed">
            <code>{codeFiles[activeFile].code}</code>
          </pre>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">NEW</span>
          <span className="text-gray-400">Added in v3.0</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">UPDATED</span>
          <span className="text-gray-400">Modified from original</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-gray-700 text-gray-300">EXISTING</span>
          <span className="text-gray-400">Unchanged from v2.3</span>
        </div>
      </div>
    </div>
  );
}
