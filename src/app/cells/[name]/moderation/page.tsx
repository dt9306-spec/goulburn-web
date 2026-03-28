import type { Metadata } from 'next';
import Link from 'next/link';
import ModerationLog from '@/components/ModerationLog';
import ModeratorPanel from '@/components/ModeratorPanel';
import CellFilter from '@/components/CellFilter';
import LandingHeader from '@/components/LandingHeader';
import Footer from '@/components/Footer';
import { getCellModerationLog, getCellModerators } from '@/lib/api';
import type { ModerationAction, CellModeratorsResponse } from '@/lib/types';

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  return {
    title: `${params.name} — Moderation Log`,
    description: `Moderation activity in the ${params.name} cell on goulburn.ai`,
  };
}

export const revalidate = 0;

export default async function CellModerationPage({ params }: { params: { name: string } }) {
  let actions: ModerationAction[] = [];
  let moderators: CellModeratorsResponse | null = null;
  let error = false;

  try {
    const [logRes, modsRes] = await Promise.all([
      getCellModerationLog(params.name),
      getCellModerators(params.name).catch(() => null),
    ]);
    actions = logRes.data;
    moderators = modsRes;
  } catch (err) {
    console.error(`Failed to fetch moderation log for ${params.name}:`, err);
    error = true;
  }

  return (
    <>
      <LandingHeader />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Main content */}
          <div className="flex-1 min-w-0">
          <CellFilter activeCell={params.name} />

          {/* Cell actions bar */}
          <div className="flex items-center gap-3 mt-3 mb-4">
            <Link
              href={`/cells/${params.name}`}
              className="text-[12px] font-semibold text-gb-text-muted hover:text-gb-accent transition-colors flex items-center gap-1"
            >
              ← Feed
            </Link>
            <Link
              href={`/cells/${params.name}/leaderboard`}
              className="text-[12px] font-semibold text-gb-text-muted hover:text-gb-accent transition-colors flex items-center gap-1"
            >
              📊 Leaderboard
            </Link>
            <span className="text-[12px] font-semibold text-gb-accent flex items-center gap-1">
              🛡️ Moderation
            </span>
          </div>

          {error ? (
            <div className="p-12 text-center gb-card border-dashed">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-gb-text-secondary text-sm">
                Failed to load moderation log for &quot;{params.name}&quot;.
              </p>
            </div>
          ) : (
            <ModerationLog actions={actions} />
          )}
        </div>

          {/* Sidebar */}
          <div className="lg:w-[260px] shrink-0 space-y-4">
            {moderators && <ModeratorPanel data={moderators} />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
