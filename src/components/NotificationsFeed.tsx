import React, { useState } from 'react';
import { 
  Bell, 
  Feather, 
  Waves, 
  CheckCircle2, 
  Reply, 
  Eye, 
  Clock, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { LetterNotification, Letter, PigeonFlight, DriftBottle } from '../types';

interface NotificationsFeedProps {
  notifications: LetterNotification[];
  letters: Letter[];
  flights: PigeonFlight[];
  bottles: DriftBottle[];
  onOpenLetter: (letter: Letter, flight?: PigeonFlight, bottle?: DriftBottle) => void;
  onReplyToPigeon: (letter: Letter) => void;
  onMarkNotificationRead: (id: string) => void;
}

export const NotificationsFeed: React.FC<NotificationsFeedProps> = ({
  notifications,
  letters,
  flights,
  bottles,
  onOpenLetter,
  onReplyToPigeon,
  onMarkNotificationRead,
}) => {
  const [filter, setFilter] = useState<'all' | 'received' | 'delivered' | 'bottles'>('all');

  // Filter list
  const filteredNotifs = notifications.filter(n => {
    if (filter === 'received') return n.type === 'letter_received';
    if (filter === 'delivered') return n.type === 'letter_delivered';
    if (filter === 'bottles') return n.type === 'bottle_found' || n.type === 'bottle_washed_up';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notif: LetterNotification) => {
    onMarkNotificationRead(notif.id);
    
    // Find associated letter
    if (notif.letterId) {
      const letter = letters.find(l => l.id === notif.letterId);
      const flight = flights.find(f => f.id === notif.flightId);
      const bottle = bottles.find(b => b.id === notif.bottleId);
      if (letter) {
        onOpenLetter(letter, flight, bottle);
      }
    }
  };

  const handleReplyClick = (e: React.MouseEvent, notif: LetterNotification) => {
    e.stopPropagation();
    onMarkNotificationRead(notif.id);
    if (notif.letterId) {
      const letter = letters.find(l => l.id === notif.letterId);
      if (letter) {
        onReplyToPigeon(letter);
      }
    }
  };

  return (
    <div className="bg-[#ffffff] border border-[#e7e5e4] rounded-2xl p-4 sm:p-6 text-[#292524] shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f5f5f4] mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#b45309]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-cinzel text-lg font-bold text-[#1c1917]">
                Dispatch & Tide Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#991b1b] border border-[#fecaca] text-[10px] font-bold font-mono">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#f5f5f4] p-1 rounded-xl border border-[#e7e5e4] text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-serif-vintage ${
              filter === 'all'
                ? 'bg-[#ffffff] text-[#1c1917] font-bold shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('received')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-serif-vintage ${
              filter === 'received'
                ? 'bg-[#ffffff] text-[#1c1917] font-bold shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            Received
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-serif-vintage ${
              filter === 'delivered'
                ? 'bg-[#ffffff] text-[#1c1917] font-bold shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setFilter('bottles')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-serif-vintage ${
              filter === 'bottles'
                ? 'bg-[#ffffff] text-[#1c1917] font-bold shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            Bottles
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredNotifs.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl bg-[#fafaf9] border border-dashed border-[#e7e5e4]">
            <Inbox className="w-8 h-8 text-[#a8a29e] mx-auto mb-2" />
            <p className="text-sm font-serif-vintage text-[#78716c]">
              No notifications yet in this log.
            </p>
            <p className="text-xs text-[#a8a29e] font-serif-vintage mt-1">
              Advance simulation days or dispatch new letters to witness pigeons and tide dispatches arrive.
            </p>
          </div>
        ) : (
          filteredNotifs.map((notif) => {
            const isPigeonReceived = notif.type === 'letter_received';
            const isDelivered = notif.type === 'letter_delivered';
            const isBottleEvent = notif.type === 'bottle_found' || notif.type === 'bottle_washed_up';

            const letter = notif.letterId ? letters.find(l => l.id === notif.letterId) : undefined;

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  !notif.isRead
                    ? 'bg-[#fffbeb] border-[#fde68a] shadow-sm hover:bg-[#fef3c7]/60'
                    : 'bg-[#fafaf9] border-[#e7e5e4] text-[#57534e] hover:bg-[#f5f5f4]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div 
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isPigeonReceived
                        ? 'bg-[#fef3c7] border border-[#fde68a] text-[#b45309]'
                        : isDelivered
                        ? 'bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669]'
                        : 'bg-[#e0f2fe] border border-[#bae6fd] text-[#0284c7]'
                    }`}
                  >
                    {isBottleEvent ? (
                      <Waves className="w-4 h-4" />
                    ) : (
                      <Feather className="w-4 h-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif-vintage font-bold text-sm text-[#1c1917]">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                      )}
                    </div>
                    <p className="text-xs text-[#44403c] font-serif-vintage mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#78716c] font-mono">
                      <span>{notif.timestamp}</span>
                      {isPigeonReceived && (
                        <span className="text-[#059669] font-serif-vintage font-bold">
                          • Direct reply enabled
                        </span>
                      )}
                      {isBottleEvent && (
                        <span className="text-[#0284c7] font-serif-vintage italic">
                          • Tide scroll (reply disabled)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0">
                  {/* Read letter button if letter exists */}
                  {letter && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(notif);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffffff] hover:bg-[#f5f5f4] text-xs font-serif-vintage font-medium text-[#1c1917] border border-[#e7e5e4] transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#b45309]" />
                      <span>Read Letter</span>
                    </button>
                  )}

                  {/* Reply button ONLY for pigeon received letters */}
                  {isPigeonReceived && letter && (
                    <button
                      type="button"
                      onClick={(e) => handleReplyClick(e, notif)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#991b1b] hover:bg-[#b91c1c] text-xs font-serif-vintage font-bold text-[#ffffff] shadow-sm transition-all active:scale-95"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply by Pigeon</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
