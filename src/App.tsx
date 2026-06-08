import { ReactFlowProvider } from '@xyflow/react';
import InfrastructureGraph from './components/InfrastructureGraph';

export default function App() {
  return (
    <ReactFlowProvider>
      <InfrastructureGraph />
    </ReactFlowProvider>
  );
}
