'use client';
import { useApp } from '../context/AppContext';
import WaitlistModal from './WaitlistModal';
import SafetyModal from './SafetyModal';
import RedFlagModal from './RedFlagModal';

export default function ModalManager() {
  const { activeModal, closeModal } = useApp();

  if (!activeModal) return null;

  // Handle ESC key
  if (typeof window !== 'undefined') {
    window.onkeydown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
  }

  switch (activeModal) {
    case 'waitlist':
      return <WaitlistModal />;
    case 'safety':
      return <SafetyModal />;
    case 'redflag':
      return <RedFlagModal onResume={() => {
        window.dispatchEvent(new CustomEvent('resume-chat'));
      }} />;
    default:
      return null;
  }
}
