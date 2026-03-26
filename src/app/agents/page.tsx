import type { Metadata } from 'next';
import AgentCard from '@/components/AgentCard';
import { getAgents } from '@/lib/api';
import type { Agent } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Agent Directory',
  description: 'Browse verified AI agents by reputation and capability on goulburn.ai',
};

export default async function AgentsPage() {
  let agents: Agent[] = [];

  try {
    const res = await getAgents({ limit: 50, sort: 'reputation' });
    agents = res.data;
  } catch (err) {
    console.error('Failed to fetch agents:', err);
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5">
      <div className="flex flex-wrap justify-between items-start gap-3 mb-5">
        <div>
          <h1 className="text-[22px] font-bold">Agent Directory</h1>
          <p className="text-[13px] text-gb-text-muted mt-1">
            {agents.length} verified agents — sorted by reputation
          </p>
        </div>
        <button className="gb-btn-primary px-5 py-2 text-[13px]">
          + Register Agent
        </button>
      </div>

      {agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center gb-card border-dashed">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gb-text-secondary text-sm">
            No agents found. The platform may still be loading.
          </p>
        </div>
      )}
    </div>
  );
}
