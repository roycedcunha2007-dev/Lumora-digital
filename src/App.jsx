import React from 'react';
import { EditorProvider, useEditor } from './context/EditorContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { TopBar } from './components/TopBar/TopBar';
import { CanvaLeftSidebar } from './components/LeftSidebar/CanvaLeftSidebar';
import { ContextualTopBar } from './components/Canvas/ContextualTopBar';
import { Canvas } from './components/Canvas/Canvas';
import { RightInspector } from './components/RightInspector/RightInspector';
import { BottomBar } from './components/BottomBar/BottomBar';
import { HomeDashboard } from './components/HomeDashboard/HomeDashboard';
import { PresenterNotesDrawer } from './components/Presentation/PresenterNotesDrawer';
import { PresentationCreatorModal } from './components/Modals/PresentationCreatorModal';
import { OnboardingModal } from './components/Modals/OnboardingModal';
import { CommandPalette } from './components/Modals/CommandPalette';
import { ExportModal } from './components/Modals/ExportModal';
import { ProjectManagerModal } from './components/Modals/ProjectManagerModal';
import { ShortcutsModal } from './components/Modals/ShortcutsModal';
import { ContextMenu } from './components/Modals/ContextMenu';
import { PresentMode } from './components/PresentMode/PresentMode';
import { DesignDoctorModal } from './components/Modals/DesignDoctorModal';
import { ComponentLabModal } from './components/Modals/ComponentLabModal';
import { TimeMachineModal } from './components/Modals/TimeMachineModal';
import { StyleExtractorModal } from './components/Modals/StyleExtractorModal';
import { MagicResizeModal } from './components/Modals/MagicResizeModal';
import { VariationsModal } from './components/Modals/VariationsModal';
import { TemplateLibraryModal } from './components/Modals/TemplateLibraryModal';
import { MissionsModal } from './components/Modals/MissionsModal';
import { AccessibilityModal } from './components/Modals/AccessibilityModal';
import { PerformanceModal } from './components/Modals/PerformanceModal';
import { CrashRecoveryModal } from './components/Modals/CrashRecoveryModal';
import { DeviceMockupModal } from './components/Modals/DeviceMockupModal';
import { DesignPackageModal } from './components/Modals/DesignPackageModal';
import { OfflineDashboardModal } from './components/Modals/OfflineDashboardModal';
import { ToastSystem } from './components/Common/ToastSystem';

function MainWorkspace() {
  const { currentView, theme } = useEditor();
  useKeyboardShortcuts();

  if (currentView === 'home') {
    return (
      <>
        <HomeDashboard />
        <PresentationCreatorModal />
        <TemplateLibraryModal />
        <OnboardingModal />
        <ToastSystem />
      </>
    );
  }

  return (
    <div
      className={`w-screen h-screen flex flex-col overflow-hidden ${
        theme === 'light' ? 'light bg-slate-100 text-slate-900' : 'dark bg-neutral-950 text-neutral-100'
      } antialiased select-none font-sans`}
    >
      <TopBar />
      <ContextualTopBar />

      <div className="flex-1 flex flex-row overflow-hidden relative">
        <CanvaLeftSidebar />
        <Canvas />
        <RightInspector />
      </div>

      <PresenterNotesDrawer />
      <BottomBar />

      <OnboardingModal />
      <PresentationCreatorModal />
      <CommandPalette />
      <ExportModal />
      <ProjectManagerModal />
      <ShortcutsModal />
      <ContextMenu />
      <PresentMode />
      <DesignDoctorModal />
      <ComponentLabModal />
      <TimeMachineModal />
      <StyleExtractorModal />
      <MagicResizeModal />
      <VariationsModal />
      <TemplateLibraryModal />
      <MissionsModal />
      <AccessibilityModal />
      <PerformanceModal />
      <CrashRecoveryModal />
      <DeviceMockupModal />
      <DesignPackageModal />
      <OfflineDashboardModal />
      <ToastSystem />
    </div>
  );
}

export default function App() {
  return (
    <EditorProvider>
      <MainWorkspace />
    </EditorProvider>
  );
}