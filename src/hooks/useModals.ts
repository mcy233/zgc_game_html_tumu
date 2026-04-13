import { useState } from 'react';

export type ModalEventPayload = {
  title: string;
  description: string;
  effect: Record<string, number>;
};

export function useModals() {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isAssetOfferModalOpen, setIsAssetOfferModalOpen] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isQuarterChoiceOpen, setIsQuarterChoiceOpen] = useState(false);
  const [isPaperReviewOpen, setIsPaperReviewOpen] = useState(false);
  const [showLLMSettings, setShowLLMSettings] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<ModalEventPayload | null>(null);

  // v2 new modals
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [isLifeChoiceModalOpen, setIsLifeChoiceModalOpen] = useState(false);
  const [isProjectScoreModalOpen, setIsProjectScoreModalOpen] = useState(false);

  return {
    isEventModalOpen,
    setIsEventModalOpen,
    isSummaryModalOpen,
    setIsSummaryModalOpen,
    isAssetOfferModalOpen,
    setIsAssetOfferModalOpen,
    isGameOver,
    setIsGameOver,
    isWarningModalOpen,
    setIsWarningModalOpen,
    isQuarterChoiceOpen,
    setIsQuarterChoiceOpen,
    isPaperReviewOpen,
    setIsPaperReviewOpen,
    showLLMSettings,
    setShowLLMSettings,
    currentEvent,
    setCurrentEvent,
    // v2 new
    isTransferModalOpen,
    setIsTransferModalOpen,
    isPromotionModalOpen,
    setIsPromotionModalOpen,
    isLifeChoiceModalOpen,
    setIsLifeChoiceModalOpen,
    isProjectScoreModalOpen,
    setIsProjectScoreModalOpen,
  };
}
