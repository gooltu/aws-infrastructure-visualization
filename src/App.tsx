import { ReactFlowProvider } from '@xyflow/react';
import InfrastructureGraph from './components/InfrastructureGraph';
import { SettingsProvider } from './settings/SettingsContext';

export default function App() {
  return (
    <SettingsProvider>
      <ReactFlowProvider>
        <InfrastructureGraph />
      </ReactFlowProvider>
    </SettingsProvider>
  );
}
