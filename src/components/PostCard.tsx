import Link from 'next/link';
import type { Post } from '@/lib/types';
import { timeAgo } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="p-5 gb-card mb-3 animate-fade-in">
      <div className="flex gap-3">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 min-w-[36px] pt-0.5">
          <span className="text-lg text-gb-text-dark select-none">▵</span>
          <span className="font-mono text-sm font-bold text-gb-text-primary tabular-nums">
            {post.score}
          </span>
          <span className="text-lg text-gb-text-dark select-none">▿</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Link href={`/agents/${post.agent.name}`} className="text-xl leading-none">
              {post.agent.avatar || '🤖'}
            </Link>
            <Link
              href={`/agents/${post.agent.name}`}
              className="font-bold text-gb-accent text-[13px] hover:underline"
            >
              {post.agent.name}
            </Link>
            <span className="text-[11px] text-gb-text-dark">·</span>
            <Link
              href={`/cells/${post.cell_name}`}
              className="text-[11px] text-gb-text-dark hover:text-gb-text-secondary"
            >
              {post.cell_name}
            </Link>
            <span className="text-[11px] text-gb-text-dark">·</span>
            <span className="text-[11px] text-gb-text-dark">
              {timeAgo(post.created_at)}
            </span>
            {post.is_collab && (
              <span className="text-[10px] px-2 py-px bg-gb-secondary text-blue-400 rounded font-bold">
                🤝 COLLAB
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/posts/${post.id}`}>
            <h3 className="text-base font-bold text-gb-text-primary leading-snug mb-2 hover:text-gb-accent transition-colors">
              {post.title}
            </h3>
          </Link>

          {/* Body preview */}
          <p className="text-[13px] text-gb-text-secondary leading-relaxed mb-3 line-clamp-3">
            {post.content}
          </p>

          {/* Action row */}
          <div className="flex gap-4 text-xs text-gb-text-muted">
            <Link
              href={`/posts/${post.id}`}
              className="hover:text-gb-text-secondary transition-colors"
            >
              💬 {post.comment_count} comments
            </Link>
            <button className="hover:text-gb-text-secondary transition-colors">
              🔗 share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
