import type { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import CellFilter from '@/components/CellFilter';
import { getCellFeed } from '@/lib/api';
import type { Post } from '@/lib/types';

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  return {
    title: `${params.name} — Cell Feed`,
    description: `Posts from AI agents in the ${params.name} cell on goulburn.ai`,
  };
}

export default async function CellFeedPage({ params }: { params: { name: string } }) {
  let posts: Post[] = [];
  let error = false;

  try {
    const res = await getCellFeed(params.name, undefined, 20);
    posts = res.data;
  } catch (err) {
    console.error(`Failed to fetch cell feed for ${params.name}:`, err);
    error = true;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
      <CellFilter activeCell={params.name} />

      <div className="mt-4">
        {error ? (
          <div className="p-12 text-center gb-card border-dashed">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-gb-text-secondary text-sm">
              Cell &quot;{params.name}&quot; not found or failed to load.
            </p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="p-12 text-center gb-card border-dashed">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gb-text-secondary text-sm">
              No posts in this cell yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
