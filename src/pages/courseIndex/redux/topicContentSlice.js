import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { makeApiRequest } from '../../../shared/api';
import { Modal } from 'antd'; // Import Modal
import { Popconfirm } from 'antd';
import { toast } from 'react-hot-toast';

export const generateTopicContent = createAsyncThunk(
  'course/generateTopicContent',
  async (topicName, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'generate_course_video',
        ...topicName
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
const showModal = (message) => {
  Modal.error({
    title: 'Error',
    content: message
  });
};

export const updateTopicContent = createAsyncThunk(
  'course/updateTopicContent',
  async (topicData, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'update_video',
        ...topicData
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCourseContent = createAsyncThunk(
  'course/updateCourseContent',
  async (topicData, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'update_course',
        ...topicData
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const generateVideo = createAsyncThunk(
  'course/generateVideo',
  async (topicId, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'generate_video_bg',
        ...topicId
      });

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getVideoById = createAsyncThunk(
  'topic/getVideoById',
  async (videoData, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'get_video',
        ...videoData
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createVideo = createAsyncThunk(
  'topic/createVideo',
  async (videoData, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'generate_video',
        ...videoData
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteScenes = createAsyncThunk(
  'topic/deleteScenes',
  async (sceneData, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'delete_scene',
        ...sceneData
      });

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createScenes = createAsyncThunk(
  'topic/createScenes',
  async (sceneData, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'generate_scene',
        ...sceneData
      });

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const regenerateScene = createAsyncThunk(
  'topic/regenerateScene',
  async (sceneData, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'generate_scene',
        ...sceneData
      });

      return response; // The response should contain the updated scene
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const generateVideoByText = createAsyncThunk(
  'course/generateVideoByText',
  async (courseParam, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'generate_video_with_text',
        ...courseParam
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const generateVideoByUrl = createAsyncThunk(
  'course/generateVideoByUrl',
  async (courseParam, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'generate_video_with_url',
        ...courseParam
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
      toast.error(error.response.data);
    }
  }
);

export const generateVideoByPdf = createAsyncThunk(
  'course/generateVideoByPdf',
  async (courseParam, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'generate_video_with_pdf',
        ...courseParam
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
      toast.error(error.response.data);
    }
  }
);

const topicContentSlice = createSlice({
  name: 'topic',
  initialState: {
    topicData: null,
    status: 'idle',
    error: null,
    updateError: null,
    updatedTopicData: null,
    updateStatus: 'idle',

    generateVideoData: null,
    generateVideoStatus: 'idle',
    generateVideoError: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateTopicContent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generateTopicContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topicData = action.payload;
        toast.success('Topic content generated');
      })
      .addCase(generateTopicContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Failed to generate topic content: ${action.payload}`);
      })
      .addCase(generateVideo.pending, (state) => {
        state.generateVideoStatus = 'loading';
      })
      .addCase(generateVideo.fulfilled, (state, action) => {
        state.generateVideoStatus = 'succeeded';
        state.generateVideoData = action.payload;
        if (
          'Insufficient Quota: User does not have sufficient credits to generate video. Contact Admin.' ===
          state.generateVideoData.data
        ) {
          showModal(
            'Insufficient Quota: User does not have sufficient credits to generate video. Please buy a credits.'
          );
        }else {
          toast.success(
            <>
              Generating video is inprogress. please, <br />
              watch the video after few minutes later
            </>
          );
        }
      })
      .addCase(generateVideo.rejected, (state, action) => {
        state.generateVideoStatus = 'failed';
        state.generateVideoError = action.payload;
        toast.error(`Failed to generate video: ${action.payload}`);
      })
      .addCase(updateTopicContent.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateTopicContent.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.updatedTopicData = action.payload;
      })
      .addCase(updateTopicContent.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
        toast.error(`Failed to update topic content: ${action.payload}`);
      })
      .addCase(createVideo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topicData = action.payload;
      })
      .addCase(createVideo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Failed to create video: ${action.payload}`);
      })
      .addCase(getVideoById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topicData = action.payload;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Failed to fetch video: ${action.payload}`);
      })
      .addCase(updateCourseContent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCourseContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topicData = action.payload;
        toast.success('Course content updated successfully!');
      })
      .addCase(updateCourseContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Failed to update course content: ${action.payload}`);
      })
      .addCase(generateVideoByText.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generateVideoByText.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topicData = action.payload;
      })
      .addCase(generateVideoByText.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Failed to generate video by text: ${action.payload}`);
      })
      .addCase(generateVideoByUrl.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generateVideoByUrl.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topicData = action.payload;
      })
      .addCase(generateVideoByUrl.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        const errorMessage =
          action.error.message ||
          'Unable to generate video at this point. Try after sometime!';
        toast.error(errorMessage);
      })
      .addCase(generateVideoByPdf.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generateVideoByPdf.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topicData = action.payload;
      })
      .addCase(generateVideoByPdf.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        const errorMessage =
          action.error.message ||
          'Unable to generate video at this point. Try after sometime!';
        toast.error(errorMessage);
      });
  }
});

export default topicContentSlice.reducer;
