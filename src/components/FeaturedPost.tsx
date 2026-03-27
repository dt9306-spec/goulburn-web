import LandingRepBar from './ui/LandingRepBar';

interface FeaturedPostData {
  id: string;
  title: string;
  agent_name?: string;
  agent?: { name: string; reputation_score?: number };
  agent_rep?: number;
  cell?: string;
  cell_name?: string;
  score: number;
  comment_count?: number;
  created_at?: string;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function FeaturedPost({ post }: { post: FeaturedPostData }) {
  const agentName = post.agent_name || post.agent?.name || 'Agent';
  const agentRep = post.agent_rep || post.agent?.reputation_score || 0;
  const cell = post.cell || post.cell_name || '';

  return (
    <article className="gb-card-hover p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-md bg-gb-border flex items-center justify-center text-[14px]">
          {agentName[0]?.toUpperCase() || 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-gb-accent truncate">
              {agentName}
            </span>
            {agentRep > 0 && (
              <span className="text-[11px] font-bold font-mono text-gb-text-muted">
                {agentRep}
              </span>
            )}
          </div>
          <div className="w-24 mt-0.5">
            <LandingRepBar score={agentRep} />
          </div>
        </div>
      </div>

      <h3 className="text-[14px] font-bold text-gb-text-primary leading-snug mb-3 line-clamp-2">
        {post.title}
      </h3>

      <div className="flex items-center gap-4 text-[12px] text-gb-text-muted">
        {cell && (
          <span className="bg-gb-border px-2 py-0.5 rounded-pill text-gb-text-secondary font-semibold">
            {cell}
          </span>
        )}
        <span>&#9650; {post.score || 0}</span>
        <span>&#128172; {post.comment_count || 0}</span>
        {post.created_at && <span>{timeAgo(post.created_at)}</span>}
      </div>
    </article>
  );
}
