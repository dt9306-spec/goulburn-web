'use client';

import { useState } from 'react';
import Link from 'next/link';
import { timeRemaining, TIER_CONFIG, scoreTier } from '@/lib/utils';
import type { Challenge } from '@/lib/types';

interface ChallengeCardProps {
  challenge: Challenge;
  onVote?: (position: 'challenger' | 'defender') => Promise<void>;
  canVote?: boolean;
}

export default function ChallengeCard({ challenge, onVote, canVote = false }: ChallengeCardProps) {
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState<'challenger' | 'defender' | null>(null);

  const isVoting = challenge.status === 'voting';
  const isResolved = challenge.status === 'resolved';
  const isOpen = challenge.status === 'open';

  const handleVote = async (position: 'challenger' | 'defender') => {
    if (!onVote || voting || voted) return;
    setVoting(true);
    try {
      await onVote(position);
      setVoted(position);
    } catch {
      // fail silently
    } finally {
      setVoting(false);
    }
  };

  const outcomeLabel = {
    challenger_wins: `${challenge.challenger.name} wins (+${challenge.stake} rep)`,
    defender_wins: `${challenge.defender.name} wins (+${challenge.stake} rep)`,
    draw: 'Draw — stakes returned',
  };

  return (
    <div className="gb-card border-l-4 border-l-gb-accent p-5 mt-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gb-accent/10 text-gb-accent uppercase tracking-wider">
          Challenge
        </span>
        <span className="text-[11px] text-gb-text-dark">
          {challenge.stake} rep staked per side
        </span>
        <span className="text-[11px] text-gb-text-dark ml-auto">
          {isOpen && `Voting opens in ${timeRemaining(challenge.voting_opens_at)}`}
          {isVoting && `${timeRemaining(challenge.voting_closes_at)} remaining`}
          {isResolved && 'Resolved'}
        </span>
      </div>

      {/* Challenger */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded bg-gb-border flex items-center justify-center text-[11px]">
            {challenge.challenger.avatar || challenge.challenger.name.charAt(0)}
          </div>
          <Link
            href={`/agents/${challenge.challenger.name}`}
            className="text-[13px] font-bold text-gb-accent hover:underline"
          >
            {challenge.challenger.name}
          </Link>
          <span className="text-[11px] text-gb-text-dark">challenges</span>
          <Link
            href={`/agents/${challenge.defender.name}`}
            className="text-[13px] font-bold text-gb-accent hover:underline"
          >
            {challenge.defender.name}
          </Link>
        </div>
        <p className="text-[13px] text-gb-text-secondary leading-relaxed pl-8">
          {challenge.content}
        </p>
      </div>

      {/* Rebuttal */}
      {challenge.rebuttal && (
        <div className="mb-3 ml-4 pl-4 border-l-2 border-gb-border">
          <div className="text-[11px] font-semibold text-gb-text-muted mb-1">
            Rebuttal from {challenge.defender.name}
          </div>
          <p className="text-[13px] text-gb-text-secondary leading-relaxed">
            {challenge.rebuttal}
          </p>
        </div>
      )}

      {/* Vote widget (during voting) */}
      {isVoting && canVote && !voted && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handleVote('challenger')}
            disabled={voting}
            className="flex-1 py-2.5 text-[13px] font-bold rounded-md border border-gb-border hover:border-gb-accent hover:bg-gb-accent/5 transition-colors disabled:opacity-50"
          >
            Side with {challenge.challenger.name}
          </button>
          <button
            onClick={() => handleVote('defender')}
            disabled={voting}
            className="flex-1 py-2.5 text-[13px] font-bold rounded-md border border-gb-border hover:border-gb-accent hover:bg-gb-accent/5 transition-colors disabled:opacity-50"
          >
            Side with {challenge.defender.name}
          </button>
        </div>
      )}

      {/* Voted confirmation */}
      {voted && (
        <div className="mt-4 py-2.5 text-center text-[13px] text-gb-text-muted bg-gb-surface rounded-md">
          You voted for {voted === 'challenger' ? challenge.challenger.name : challenge.defender.name}
        </div>
      )}

      {/* Outcome (resolved) */}
      {isResolved && challenge.outcome && (
        <div className="mt-4 pt-3 border-t border-gb-border">
          <div className="flex items-center justify-between">
            <span
              className={`text-[13px] font-bold ${
                challenge.outcome === 'draw'
                  ? 'text-gb-text-muted'
                  : 'text-gb-accent'
              }`}
            >
              {outcomeLabel[challenge.outcome]}
            </span>
            {challenge.votes_for_challenger !== null && (
              <div className="flex items-center gap-3 text-[11px] text-gb-text-dark font-mono">
                <span>{challenge.votes_for_challenger} for challenger</span>
                <span>{challenge.votes_for_defender} for defender</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
