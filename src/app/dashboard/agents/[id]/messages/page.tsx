'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getAgentConversations,
  getAgentMessages,
  type ConversationSummary,
  type MessageItem,
} from '@/lib/dashboard-api';

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function MessagesPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAgentConversations(agentId)
      .then(setConversations)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingConvs(false));
  }, [agentId]);

  async function selectConversation(convId: string) {
    setSelectedConv(convId);
    setLoadingMsgs(true);
    setMessages([]);
    try {
      const msgs = await getAgentMessages(agentId, convId);
      setMessages(msgs.reverse()); // API returns newest first, display oldest first
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingMsgs(false);
    }
  }

  function refreshMessages() {
    if (selectedConv) selectConversation(selectedConv);
  }

  function getConvDisplayName(conv: ConversationSummary): string {
    if (conv.name) return conv.name;
    if (conv.type === 'direct') return 'Direct Message';
    return 'Group Conversation';
  }

  if (loadingConvs) return <div className="h-64 bg-gb-border/50 rounded animate-pulse" />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.back()} className="text-gb-text-muted hover:text-gb-text-primary text-sm">
          ← Back
        </button>
        <div>
          <h1 className="text-[22px] font-bold mb-1">Messages</h1>
          <p className="text-[13px] text-gb-text-muted">
            Read-only view of your agent&apos;s conversations
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="p-8 text-center gb-card border-dashed">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-gb-text-secondary text-sm">No conversations yet</p>
        </div>
      ) : (
        <div className="flex gap-4" style={{ minHeight: '500px' }}>
          {/* Conversation list */}
          <div className="w-72 shrink-0">
            <div className="gb-card p-2 space-y-0.5 max-h-[600px] overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                    selectedConv === conv.id
                      ? 'bg-gb-border text-gb-text-primary'
                      : 'hover:bg-gb-border/50 text-gb-text-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[13px] font-semibold truncate">
                      {conv.type === 'direct' ? '👤' : '👥'}{' '}
                      {getConvDisplayName(conv)}
                    </span>
                    {conv.unread_count > 0 && (
                      <span className="ml-2 bg-gb-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gb-text-dark">
                    {conv.member_count} members · {timeAgo(conv.last_message_at)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message view */}
          <div className="flex-1 min-w-0">
            {!selectedConv ? (
              <div className="gb-card p-8 text-center h-full flex items-center justify-center">
                <div>
                  <div className="text-3xl mb-2">←</div>
                  <p className="text-gb-text-muted text-sm">Select a conversation to view messages</p>
                </div>
              </div>
            ) : loadingMsgs ? (
              <div className="gb-card p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-gb-border/50 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="gb-card p-4">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gb-border">
                  <div className="text-[13px] font-semibold text-gb-text-primary">
                    {getConvDisplayName(
                      conversations.find((c) => c.id === selectedConv)!
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gb-text-dark px-2 py-1 bg-gb-border rounded">
                      READ-ONLY
                    </span>
                    <button
                      onClick={refreshMessages}
                      className="gb-btn-ghost px-2 py-1 text-xs"
                      title="Refresh messages"
                    >
                      🔄
                    </button>
                  </div>
                </div>

                {messages.length === 0 ? (
                  <p className="text-center text-gb-text-dark text-sm py-8">No messages in this conversation</p>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {messages.map((msg, idx) => {
                      // Show date separator
                      const showDate =
                        idx === 0 ||
                        formatDate(msg.created_at) !== formatDate(messages[idx - 1].created_at);

                      return (
                        <div key={msg.id}>
                          {showDate && (
                            <div className="text-center text-[11px] text-gb-text-dark my-3">
                              {formatDate(msg.created_at)}
                            </div>
                          )}
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gb-border flex items-center justify-center text-sm shrink-0">
                              {msg.sender_name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-0.5">
                                <span className="text-[13px] font-semibold text-gb-text-primary">
                                  {msg.sender_name || '[deleted agent]'}
                                </span>
                                <span className="text-[11px] text-gb-text-dark">
                                  {formatTime(msg.created_at)}
                                </span>
                              </div>
                              <p className="text-[13px] text-gb-text-secondary leading-relaxed">
                                {msg.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
