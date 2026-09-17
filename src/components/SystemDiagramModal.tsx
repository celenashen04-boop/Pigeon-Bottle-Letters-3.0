import React, { useState } from 'react';
import { 
  Network, 
  Layers, 
  Cpu, 
  Sparkles, 
  Feather, 
  Waves, 
  ShieldCheck, 
  X,
  ArrowRight,
  Server,
  Monitor,
  Clock,
  Compass
} from 'lucide-react';

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DiagramTab = 'architecture' | 'lifecycle' | 'security';

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<DiagramTab>('architecture');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="system-diagram-title"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#ffffff] border border-[#e7e5e4] rounded-2xl shadow-2xl overflow-hidden text-[#1c1917]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#e7e5e4] bg-[#faf8f5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#b45309]">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 id="system-diagram-title" className="font-cinzel text-lg sm:text-xl font-bold text-[#1c1917] flex items-center gap-2">
                <span>Drift System Architecture</span>
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-[#fef3c7] border border-[#fde68a] text-[#92400e]">
                  Spec v2.0
                </span>
              </h2>
              <p className="text-xs text-[#78716c] font-serif-vintage">
                Overview of presentation, procedural world physics, and server-side AI mentoring
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#78716c] hover:text-[#1c1917] hover:bg-[#f5f5f4] transition-colors cursor-pointer"
            title="Close system diagram"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-5 sm:px-7 py-2.5 border-b border-[#e7e5e4] bg-[#ffffff] overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a] shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917] hover:bg-[#f5f5f4]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full Stack Architecture</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lifecycle')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'lifecycle'
                ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a] shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917] hover:bg-[#f5f5f4]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Journey Lifecycles</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a] shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917] hover:bg-[#f5f5f4]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security & Real-Time Sync</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-[#fbfaf8]">

          {/* TAB 1: FULL STACK ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              
              {/* Flow Pipeline */}
              <div className="bg-[#ffffff] border border-[#e7e5e4] rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#1c1917]">
                    Three-Tier System Topology
                  </h3>
                  <span className="text-[11px] text-[#78716c] font-serif-vintage">
                    Client UI → Procedural Engine → Server & Gemini
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Layer 1: Client UI */}
                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#b45309] font-cinzel font-bold text-xs pb-2 border-b border-[#e7e5e4]">
                        <Monitor className="w-4 h-4" />
                        <span>1. Client Presentation</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-[#44403c] font-serif-vintage">
                        <li>• <strong>React 18 & Vite SPA</strong></li>
                        <li>• 2D Procedural Cartography & Live Chart</li>
                        <li>• Custom Pigeon Attire & Sea-Glass Bottles</li>
                        <li>• Interactive Parchment & Wax Stamp Insignia</li>
                        <li>• Ambient Web Audio Ocean Surf Synthesizer</li>
                      </ul>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#e7e5e4] text-[10px] font-mono text-[#78716c]">
                      State: LocalStorage v3
                    </div>
                  </div>

                  {/* Layer 2: World Engine */}
                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#0284c7] font-cinzel font-bold text-xs pb-2 border-b border-[#e7e5e4]">
                        <Cpu className="w-4 h-4" />
                        <span>2. World Simulation Engine</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-[#44403c] font-serif-vintage">
                        <li>• <strong>Real-Time Synchronization:</strong> Wall-clock progression</li>
                        <li>• Distance-based flight duration calculations</li>
                        <li>• Oceanic gyre drift & tidal beaching physics</li>
                        <li>• Professional career targeting & matching</li>
                        <li>• Flyway weather patterns & seasonal shifts</li>
                      </ul>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#e7e5e4] text-[10px] font-mono text-[#78716c]">
                      Engine: Pure TypeScript
                    </div>
                  </div>

                  {/* Layer 3: Server & Gemini AI */}
                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#059669] font-cinzel font-bold text-xs pb-2 border-b border-[#e7e5e4]">
                        <Server className="w-4 h-4" />
                        <span>3. Server & Gemini API</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-[#44403c] font-serif-vintage">
                        <li>• <strong>Node Express Server</strong> on Port 3000</li>
                        <li>• <code className="text-[#92400e]">/api/ai/letter-help</code>: Career peer sounding board</li>
                        <li>• <code className="text-[#92400e]">/api/ai/poetic-format</code>: Stationery mood styler</li>
                        <li>• <code className="text-[#92400e]">/api/ai/translate</code>: Emotional cadence preserver</li>
                        <li>• Resilient model fallback: <code>gemini-2.5-flash</code></li>
                      </ul>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#e7e5e4] text-[10px] font-mono text-[#78716c]">
                      Auth: Server GEMINI_API_KEY
                    </div>
                  </div>
                </div>
              </div>

              {/* Architectural Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#ffffff] border border-[#e7e5e4] rounded-xl p-4 space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-cinzel font-bold text-[#1c1917]">
                    <Clock className="w-4 h-4 text-[#b45309]" />
                    <span>Wall-Clock Time Synchronization</span>
                  </div>
                  <p className="text-xs text-[#57534e] font-serif-vintage leading-relaxed">
                    Progress is calculated against actual elapsed seconds since release. When you leave the tab or close the browser, your carrier pigeons continue flying across the continent and drift bottles keep journeying through maritime currents.
                  </p>
                </div>

                <div className="bg-[#ffffff] border border-[#e7e5e4] rounded-xl p-4 space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-cinzel font-bold text-[#1c1917]">
                    <ShieldCheck className="w-4 h-4 text-[#059669]" />
                    <span>Zero Secret Exposure Architecture</span>
                  </div>
                  <p className="text-xs text-[#57534e] font-serif-vintage leading-relaxed">
                    No API keys or cloud credentials touch the browser environment. All mentor feedback, tone refinement, and stationery styling requests flow through authenticated server routes.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: JOURNEY LIFECYCLES */}
          {activeTab === 'lifecycle' && (
            <div className="space-y-6">
              
              {/* Pigeon Lifecycle */}
              <div className="bg-[#ffffff] border border-[#e7e5e4] rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-sm">
                    🕊️
                  </div>
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#1c1917]">
                    Carrier Pigeon Journey Cycle
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-lg p-3">
                    <div className="font-bold text-[#b45309] mb-1">1. Dispatch & Attire</div>
                    <p className="text-[#57534e] font-serif-vintage">
                      Assign homing name, select custom vestments (e.g. aviator goggles), and select recipient from address book.
                    </p>
                  </div>

                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-lg p-3">
                    <div className="font-bold text-[#b45309] mb-1">2. Realistic Duration</div>
                    <p className="text-[#57534e] font-serif-vintage">
                      Travel time scales with actual distance: 4-8 hours for coastal hops up to 1-3 days for cross-ocean voyages.
                    </p>
                  </div>

                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-lg p-3">
                    <div className="font-bold text-[#b45309] mb-1">3. Live En Route Flight</div>
                    <p className="text-[#57534e] font-serif-vintage">
                      Pigeon animates along waypoint arcs on the live cartography map, subject to headwind turbulence and coastal thermals.
                    </p>
                  </div>

                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-lg p-3">
                    <div className="font-bold text-[#b45309] mb-1">4. Windowsill Touchdown</div>
                    <p className="text-[#57534e] font-serif-vintage">
                      Touches down safely at destination haven, delivers the letter capsule, and issues a gentle delivery notification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottle Lifecycle */}
              <div className="bg-[#ffffff] border border-[#e7e5e4] rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#e0f2fe] border border-[#bae6fd] flex items-center justify-center text-sm">
                    🍾
                  </div>
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#1c1917]">
                    Ocean Drift Bottle Cycle
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-lg p-3">
                    <div className="font-bold text-[#0284c7] mb-1">1. Sea-Glass Casting</div>
                    <p className="text-[#57534e] font-serif-vintage">
                      Select glass tint, attach a tactile keepsake, and optionally configure career or industry filtering.
                    </p>
                  </div>

                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-lg p-3">
                    <div className="font-bold text-[#0284c7] mb-1">2. Oceanic Gyre Drift</div>
                    <p className="text-[#57534e] font-serif-vintage">
                      Follows maritime ocean currents at ~1 knot drift velocity across days and weeks of nautical travel.
                    </p>
                  </div>

                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-lg p-3">
                    <div className="font-bold text-[#0284c7] mb-1">3. Shoreline Beaching</div>
                    <p className="text-[#57534e] font-serif-vintage">
                      Tides deposit the bottle on remote pebbled shores, lighthouses, or archipelagos across the globe.
                    </p>
                  </div>

                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-lg p-3">
                    <div className="font-bold text-[#0284c7] mb-1">4. Discovery & Reply</div>
                    <p className="text-[#57534e] font-serif-vintage">
                      Retrieved by beachcombers or verified matching professionals, who unseal the wax cork and can write back.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SECURITY & SYNC */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-[#ffffff] border border-[#e7e5e4] rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="font-cinzel text-base font-bold text-[#1c1917]">
                  Privacy, Storage & Resilient Architecture
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-xl p-4 space-y-2">
                    <div className="font-bold text-[#1c1917] flex items-center gap-1.5">
                      <span>🔒</span>
                      <span>No Telemetry / No Tracking</span>
                    </div>
                    <p className="text-[#57534e] font-serif-vintage leading-relaxed">
                      No typing indicators, no online presence trackers, and no read-receipt surveillance. Messages exist on their own deliberate timescale.
                    </p>
                  </div>

                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-xl p-4 space-y-2">
                    <div className="font-bold text-[#1c1917] flex items-center gap-1.5">
                      <span>💾</span>
                      <span>Deterministic Local State</span>
                    </div>
                    <p className="text-[#57534e] font-serif-vintage leading-relaxed">
                      All letters, flight paths, and ocean coordinates persist in structured client storage, restoring seamlessly whenever you return to the sanctuary.
                    </p>
                  </div>

                  <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-xl p-4 space-y-2">
                    <div className="font-bold text-[#1c1917] flex items-center gap-1.5">
                      <span>✨</span>
                      <span>Safe AI Sounding Board</span>
                    </div>
                    <p className="text-[#57534e] font-serif-vintage leading-relaxed">
                      Career outreach advisor drafts authentic, thoughtful reach-out letters without generic corporate buzzwords or artificial hype.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#e7e5e4] bg-[#faf8f5] flex items-center justify-between text-xs text-[#78716c] font-serif-vintage">
          <span>Drift Epistolary Architecture · Production Specification</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1c1917] hover:bg-[#292524] text-[#ffffff] font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
