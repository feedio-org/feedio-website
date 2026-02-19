import RemotionTextSlide from './RemotionTextSlide';
import RemotionTextImageSlide from './RemotionTextImageSlide';
import RemotionImageSlide from './RemotionImageSlide';
import RemotionCodeSlide from './RemotionCodeSlide';
import RemotionTitleSlide from './RemotionTitleSlide';
import RemotionDischargeSummaryCard from './RemotionDischargeSummaryCard';
import RemotionDischargeSummaryCards from './RemotionDischargeSummaryCards';
import RemotionDischargeSummaryTable from './RemotionDischargeSummaryTable';

export const sceneTypeToComponent9x16 = {
  CODE_SLIDE: RemotionCodeSlide,
  CONTENT_SLIDE: RemotionTextSlide,
  CONTENT_SLIDE_WITH_IMAGE: RemotionTextImageSlide,
  IMAGE_ONLY_SLIDE: RemotionImageSlide,
  TITLE_SLIDE: RemotionTitleSlide,
  DISCHARGE_SUMMARY_TABLE: RemotionDischargeSummaryTable,
  DISCHARGE_SUMMARY_CARD: RemotionDischargeSummaryCard,
  DISCHARGE_SUMMARY_CARDS: RemotionDischargeSummaryCards,
};
