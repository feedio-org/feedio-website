import RemotionTextSlide from "./RemotionTextSlide";
import RemotionTextImageSlide from "./RemotionTextImageSlide";
import RemotionImageSlide from "./RemotionImageSlide";
import RemotionCodeSlide from "./RemotionCodeSlide";
import RemotionTitleSlide from "./RemotionTitleSlide";
import RemotionWidgetSlide from "./RemotionWidgetSlide";
import RemotionDischargeSummaryTable from "./RemotionDischargeSummaryTable";
import RemotionDischargeSummaryCards from "./RemotionDischargeSummaryCards";
import RemotionDischargeSummaryCard from "./RemotionDischargeSummaryCard";

export const sceneTypeToComponent16x9 = {
  CODE_SLIDE: RemotionCodeSlide,
  CONTENT_SLIDE: RemotionTextSlide,
  CONTENT_SLIDE_WITH_IMAGE: RemotionTextImageSlide,
  IMAGE_ONLY_SLIDE: RemotionImageSlide,
  TITLE_SLIDE: RemotionTitleSlide,
  WIDGET_SLIDE: RemotionWidgetSlide,
  DISCHARGE_SUMMARY_TABLE: RemotionDischargeSummaryTable,
  DISCHARGE_SUMMARY_CARDS: RemotionDischargeSummaryCards,
  DISCHARGE_SUMMARY_CARD: RemotionDischargeSummaryCard,
};
