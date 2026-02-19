import { combineReducers } from '@reduxjs/toolkit';
import courseReducer from './dashboard/redux/courseSlice';
import topicContentReducer from './courseIndex/redux/topicContentSlice';
import previewVideoReducer from './courseIndex/redux/previewVideoSlice';
import billingReducer from './billing/redux/billingSlice';
import lovReducer from './dashboard/redux/lovSlice';

const rootReducer = combineReducers({
  course: courseReducer,
  topic: topicContentReducer,
  preview: previewVideoReducer,
  billing: billingReducer,
  lov: lovReducer
});

export default rootReducer;
