/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DeliveryMode, 
  Letter, 
  PigeonFlight, 
  DriftBottle, 
  LetterNotification,
  StampReaction, 
  WorldSeason 
} from './types';
import { 
  loadWorldSimulation, 
  saveWorldSimulation, 
  syncWorldRealTime, 
  dispatchCarrierPigeon, 
  castBottleIntoOcean 
} from './simulation/worldEngine';
import { toggleProceduralOcean, setMasterVolume, playWaxSealThud } from './utils/ambientAudio';
import { DashboardMap } from './components/DashboardMap';
import { NotificationsFeed } from './components/NotificationsFeed';
import { WriteLetterModal } from './components/WriteLetterModal';
import { LetterReaderModal } from './components/LetterReaderModal';
import { SystemDiagramModal } from './components/SystemDiagramModal';
import { 
  Feather, 
  Waves, 
  Volume2, 
  VolumeX, 
  Compass, 
  CheckCircle, 
  Send, 
  Bell, 
  Sparkles,
  Info,
  Network
} from 'lucide-react';

export default function App() {
  const [isMuted, setIsMuted] = useState(true);

  // Simulation state
  const [pigeonFlights, setPigeonFlights] = useState<PigeonFlight[]>([]);
  const [bottles, setBottles] = useState<DriftBottle[]>([]);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [notifications, setNotifications] = useState<LetterNotification[]>([]);
  const [currentSeason, setCurrentSeason] = useState<WorldSeason>({
    name: 'Early Autumn Mist',
    code: 'autumn',
    description: 'Equinoctial tailwinds across northern flyways, crisp sea swells.',
    windPattern: 'North-westerly moderate breeze with morning valley fog',
    seaCurrentSpeed: '1.8 knots south-eastward gyre',
    flywayCondition: 'Favorable tailwinds, migratory flocks gathering',
    skyColor: 'from-[#1e1712] via-[#241a13] to-[#120f0c]',
  });

  // Modals state
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [writeModalMode, setWriteModalMode] = useState<DeliveryMode>('pigeon');
  const [replyTargetLetter, setReplyTargetLetter] = useState<Letter | undefined>(undefined);
  const [isDiagramOpen, setIsDiagramOpen] = useState(false);

  const [selectedReadingLetter, setSelectedReadingLetter] = useState<Letter | null>(null);
  const [readingFlightContext, setReadingFlightContext] = useState<PigeonFlight | undefined>(undefined);
  const [readingBottleContext, setReadingBottleContext] = useState<DriftBottle | undefined>(undefined);

  // Ephemeral toast notification
  const [eventNotice, setEventNotice] = useState<string | null>(null);

  // Synchronize world with actual elapsed wall-clock time on mount & periodic ticker
  useEffect(() => {
    // 1. Immediate sync with real-world time
    const initialSync = syncWorldRealTime();
    setPigeonFlights(initialSync.pigeonFlights);
    setBottles(initialSync.bottles);
    setLetters(initialSync.letters);
    setNotifications(initialSync.notifications);

    // 2. Periodic background check every 15s for live real-time progress & arrivals
    const interval = setInterval(() => {
      const liveSync = syncWorldRealTime();
      if (liveSync.hasChanges) {
        setPigeonFlights([...liveSync.pigeonFlights]);
        setBottles([...liveSync.bottles]);
        setLetters([...liveSync.letters]);
        setNotifications([...liveSync.notifications]);
        if (liveSync.arrivedPigeons.length > 0) {
          const first = liveSync.arrivedPigeons[0];
          setEventNotice(`🕊️ Pigeon "${first.pigeonName || 'Homer'}" completed its journey and arrived in ${first.destinationName}!`);
          setTimeout(() => setEventNotice(null), 6000);
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Persist state to local storage
  const persistState = (
    flights: PigeonFlight[], 
    bList: DriftBottle[], 
    lList: Letter[], 
    notifs: LetterNotification[]
  ) => {
    saveWorldSimulation({
      pigeonFlights: flights,
      bottles: bList,
      letters: lList,
      notifications: notifs,
      worldSeason: currentSeason,
      dayCount: 1,
    });
  };

  // Toggle ambient procedural ocean audio
  const handleToggleSound = () => {
    const isPlaying = toggleProceduralOcean();
    setIsMuted(!isPlaying);
  };

  // Open Writer
  const handleOpenWriteModal = (mode: DeliveryMode = 'pigeon', replyLetter?: Letter) => {
    setWriteModalMode(mode);
    setReplyTargetLetter(replyLetter);
    setIsWriteModalOpen(true);
  };

  // Open Reader (Reread previously written letter or incoming dispatch)
  const handleOpenLetter = (letter: Letter, flight?: PigeonFlight, bottle?: DriftBottle) => {
    // Mark letter as read
    const updatedLetters = letters.map(l => l.id === letter.id ? { ...l, isRead: true } : l);
    setLetters(updatedLetters);
    persistState(pigeonFlights, bottles, updatedLetters, notifications);

    setSelectedReadingLetter({ ...letter, isRead: true });
    setReadingFlightContext(flight);
    setReadingBottleContext(bottle);
  };

  // Reply from reader
  const handleReplyFromReader = (letter: Letter) => {
    setSelectedReadingLetter(null);
    handleOpenWriteModal('pigeon', letter);
  };

  // Mark a notification as read
  const handleMarkNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    persistState(pigeonFlights, bottles, letters, updated);
  };

  // Add stamp reaction
  const handleAddReaction = (letterId: string, reaction: StampReaction) => {
    const updatedLetters = letters.map(l => {
      if (l.id === letterId) {
        return {
          ...l,
          reactions: [...(l.reactions || []), reaction],
        };
      }
      return l;
    });
    setLetters(updatedLetters);

    if (selectedReadingLetter && selectedReadingLetter.id === letterId) {
      setSelectedReadingLetter({
        ...selectedReadingLetter,
        reactions: [...(selectedReadingLetter.reactions || []), reaction],
      });
    }

    persistState(pigeonFlights, bottles, updatedLetters, notifications);
  };

  // Send Pigeon with assigned name, clothes, and recipient position
  const handleSendPigeon = (
    newLetter: Letter, 
    recipient: string, 
    coords: { x: number; y: number }, 
    city: string,
    pigeonName?: string,
    pigeonClothes?: string,
    recipientCompany?: string,
    recipientPosition?: string
  ) => {
    const flight = dispatchCarrierPigeon(newLetter, recipient, coords, city, pigeonName, pigeonClothes, recipientCompany, recipientPosition);
    const updatedFlights = [flight, ...pigeonFlights];
    const updatedLetters = [newLetter, ...letters];

    setPigeonFlights(updatedFlights);
    setLetters(updatedLetters);
    persistState(updatedFlights, bottles, updatedLetters, notifications);

    const posTag = recipientPosition ? ` (${recipientPosition})` : '';
    setEventNotice(`🕊️ Carrier pigeon "${flight.pigeonName || 'Homer'}" released toward ${recipient}${posTag} in ${city}. En route on the map.`);
    setTimeout(() => setEventNotice(null), 5000);
  };

  // Cast Bottle into Ocean with glass color, wax seal, and targeted career fields
  const handleCastBottle = (
    newLetter: Letter, 
    isAnonymous: boolean,
    bottleColor?: string,
    waxSealColor?: string,
    waxSealInsignia?: string,
    targetIndustry?: string,
    targetPosition?: string
  ) => {
    const bottle = castBottleIntoOcean(newLetter, isAnonymous, bottleColor, waxSealColor, waxSealInsignia, targetIndustry, targetPosition);
    const updatedBottles = [bottle, ...bottles];
    const updatedLetters = [newLetter, ...letters];

    setBottles(updatedBottles);
    setLetters(updatedLetters);
    persistState(pigeonFlights, updatedBottles, updatedLetters, notifications);

    const targetDesc = targetPosition 
      ? `targeting ${targetPosition} (${targetIndustry || 'specialized field'})`
      : (targetIndustry && targetIndustry !== 'Open to All Professions' ? `targeting ${targetIndustry}` : 'into open oceanic gyres');

    setEventNotice(`🌊 Drift bottle sealed and cast ${targetDesc}. Tracking buoy active on world chart.`);
    setTimeout(() => setEventNotice(null), 5500);
  };

  // -------------------------------------------------------------
  // STATS CALCULATIONS (# pigeons/bottles sent, # delivered)
  // -------------------------------------------------------------
  const mySentPigeons = pigeonFlights.filter(p => p.sender === 'You');
  const pigeonsSentCount = mySentPigeons.length;
  const pigeonsDeliveredCount = mySentPigeons.filter(p => p.status === 'delivered').length;

  const mySentBottles = bottles.filter(b => b.senderName === 'You' || b.letter?.author === 'You');
  const bottlesSentCount = mySentBottles.length;
  const bottlesDeliveredCount = mySentBottles.filter(b => b.status === 'discovered' || b.isTaken).length;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#292524] flex flex-col selection:bg-[#fed7aa] selection:text-[#7c2d12]">
      
      {/* Toast Notification */}
      {eventNotice && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-[#ffffff] border border-[#d97706] text-[#292524] p-3.5 rounded-xl shadow-2xl flex items-start gap-3 animate-fadeIn">
          <div className="w-7 h-7 rounded-lg bg-[#fef3c7] text-[#b45309] flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs font-serif-vintage leading-relaxed">
            {eventNotice}
          </div>
          <button
            onClick={() => setEventNotice(null)}
            className="text-[#78716c] hover:text-[#1c1917] text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">

        {/* ============================================================ */}
        {/* 1. DRIFT HEADER                                              */}
        {/* ============================================================ */}
        <header className="flex items-center gap-2.5 pt-1 pb-1">
          <span className="text-2xl sm:text-3xl">🕊️</span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-widest text-[#1c1917]">
            DRIFT
          </h1>
        </header>

        {/* ============================================================ */}
        {/* 2. WRITE A NEW LETTER BUTTON ("Send Letter with Pigeon")     */}
        {/* ============================================================ */}
        <section className="bg-[#ffffff] border border-[#e7e5e4] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#1c1917] flex items-center gap-2 shrink-0">
              <Sparkles className="w-4 h-4 text-[#b45309]" />
              <span>Entrust Words to the Wind & Waves</span>
            </h3>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
              {/* Primary button: "Send Letter with Pigeon" */}
              <button
                type="button"
                onClick={() => handleOpenWriteModal('pigeon')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] hover:from-[#b91c1c] hover:to-[#991b1b] text-[#ffffff] text-xs sm:text-sm font-bold tracking-wide border border-[#b91c1c] shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <Feather className="w-4 h-4 text-[#fde68a]" />
                <span>Send Letter with Pigeon</span>
              </button>

              {/* Companion Bottle Button */}
              <button
                type="button"
                onClick={() => handleOpenWriteModal('bottle')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0369a1] to-[#075985] hover:from-[#0284c7] hover:to-[#0369a1] text-[#ffffff] text-xs sm:text-sm font-bold tracking-wide border border-[#38bdf8]/50 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <Waves className="w-4 h-4 text-[#bae6fd]" />
                <span>Cast Ocean Bottle</span>
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. STATS COUNTERS: # pigeons/bottles sent, # delivered       */}
        {/* ============================================================ */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Pigeons Sent - Pigeon Emoji */}
          <div className="bg-[#ffffff] border border-[#e7e5e4] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-2xl text-[#b45309] shrink-0">
              🕊️
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#78716c] font-mono">
                Pigeons Sent
              </div>
              <div className="text-2xl font-cinzel font-bold text-[#1c1917]">
                {pigeonsSentCount}
              </div>
              <div className="text-[10px] text-[#78716c] font-serif-vintage">
                Homing flights dispatched
              </div>
            </div>
          </div>

          {/* Pigeons Delivered - Pigeon Emoji */}
          <div className="bg-[#ffffff] border border-[#e7e5e4] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-2xl text-[#b45309] shrink-0">
              🕊️
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#78716c] font-mono">
                Pigeons Delivered
              </div>
              <div className="text-2xl font-cinzel font-bold text-[#1c1917]">
                {pigeonsDeliveredCount}
              </div>
              <div className="text-[10px] text-[#78716c] font-serif-vintage">
                Safely reached windowsill
              </div>
            </div>
          </div>

          {/* Bottles Sent - Bottle Emoji */}
          <div className="bg-[#ffffff] border border-[#e7e5e4] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-[#e0f2fe] border border-[#bae6fd] flex items-center justify-center text-2xl text-[#0284c7] shrink-0">
              🍾
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#78716c] font-mono">
                Bottles Sent
              </div>
              <div className="text-2xl font-cinzel font-bold text-[#1c1917]">
                {bottlesSentCount}
              </div>
              <div className="text-[10px] text-[#78716c] font-serif-vintage">
                Cast into ocean swells
              </div>
            </div>
          </div>

          {/* Bottles Delivered / Washed Up - Bottle Emoji */}
          <div className="bg-[#ffffff] border border-[#e7e5e4] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-[#e0f2fe] border border-[#bae6fd] flex items-center justify-center text-2xl text-[#0284c7] shrink-0">
              🍾
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#78716c] font-mono">
                Bottles Washed Up
              </div>
              <div className="text-2xl font-cinzel font-bold text-[#1c1917]">
                {bottlesDeliveredCount}
              </div>
              <div className="text-[10px] text-[#78716c] font-serif-vintage">
                Retrieved & taken by souls
              </div>
            </div>
          </div>

        </section>

        {/* ============================================================ */}
        {/* 3. MAP (LAND AND SEA)                                        */}
        {/* ============================================================ */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#b45309]" />
                <h2 className="font-cinzel text-lg font-bold text-[#1c1917]">
                  Land & Sea Live Chart
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsDiagramOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ffffff] hover:bg-[#f5f5f4] text-[#78716c] hover:text-[#1c1917] text-xs font-mono border border-[#e7e5e4] transition-colors shadow-sm"
                title="Inspect data flow & physics model diagram"
              >
                <Network className="w-3 h-3 text-[#b45309]" />
                <span>Architecture Spec</span>
              </button>
            </div>
          </div>

          {/* Dedicated Map Component */}
          <DashboardMap
            pigeons={pigeonFlights}
            bottles={bottles}
            letters={letters}
            onOpenLetter={handleOpenLetter}
          />
        </section>

        {/* ============================================================ */}
        {/* 5. NOTIFICATIONS ON RECEIVED LETTERS, WASHED BOTTLES, ETC.   */}
        {/* ============================================================ */}
        <section className="space-y-2">
          <NotificationsFeed
            notifications={notifications}
            letters={letters}
            flights={pigeonFlights}
            bottles={bottles}
            onOpenLetter={handleOpenLetter}
            onReplyToPigeon={handleReplyFromReader}
            onMarkNotificationRead={handleMarkNotificationRead}
          />
        </section>

      </main>

      {/* Epistolary Aesthetic Footer */}
      <footer className="border-t border-[#e7e5e4] bg-[#ffffff] py-6 px-4 text-center text-xs text-[#78716c] font-serif-vintage mt-10">
        <div className="max-w-xl mx-auto space-y-1.5">
          <p className="italic text-[#57534e]">
            “The weight of a message is measured by the wind it has weathered and the days spent waiting.”
          </p>
          <div className="text-[11px] text-[#a8a29e]">
            Drift Epistolary Sanctuary
          </div>
        </div>
      </footer>

      {/* Compose Letter Modal */}
      <WriteLetterModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        defaultMode={writeModalMode}
        replyToLetter={replyTargetLetter}
        onSendPigeon={handleSendPigeon}
        onCastBottle={handleCastBottle}
      />

      {/* Read Letter Modal */}
      <LetterReaderModal
        letter={selectedReadingLetter}
        onClose={() => setSelectedReadingLetter(null)}
        onReply={handleReplyFromReader}
        onAddReaction={handleAddReaction}
        flightContext={readingFlightContext}
        bottleContext={readingBottleContext}
      />

      {/* System Architecture Diagram Modal */}
      <SystemDiagramModal
        isOpen={isDiagramOpen}
        onClose={() => setIsDiagramOpen(false)}
      />

    </div>
  );
}
