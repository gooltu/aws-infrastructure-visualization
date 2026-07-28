import ELK from 'elkjs/lib/elk.bundled.js';
import type { ElkNode } from 'elkjs';

const elk = new ELK();

export async function runLayout(elkGraph: ElkNode): Promise<ElkNode> {
  return elk.layout(elkGraph);
}
