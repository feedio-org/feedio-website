import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeApiRequest } from "../../../shared/api";
import { toast } from "react-hot-toast";
import { setCookie } from "cookies-next";

export const createCourse = createAsyncThunk(
  "course/createCourse",
  async(courseData, thunkAPI) => {
    try {
      const response = await makeApiRequest("POST", {
        action: "generate_course",
        ...courseData
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCourseById = createAsyncThunk(
  "course/getCourseById",
  async(courseData, thunkAPI) => {

    try {
      const response = await makeApiRequest("POST", {
        action: "get_course",
        ...courseData
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteVideoById = createAsyncThunk(
  "course/deleteVideoById",
  async(videoId, thunkAPI) => {
    try {
      const response = await makeApiRequest("POST", {
        action: "delete_course_video",
        ...videoId
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteShortVideoById = createAsyncThunk(
  "course/deleteShortVideoById",
  async(videoId, thunkAPI) => {
    try {
      const response = await makeApiRequest("POST", {
        action: "delete_video",
        ...videoId
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const generatePptById = createAsyncThunk(
  "course/generatePptById",
  async(videoId, thunkAPI) => {
    try {
      const response = await makeApiRequest("POST", {
        action: "generate_powerpoint",
        ...videoId
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCoursesList = createAsyncThunk(
  "course/getCoursesList",
  async(thunkAPI) => {
    try {
      const response = await makeApiRequest("POST", { action: "get_courses" });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getVideosList = createAsyncThunk(
  "course/getVideosList",
  async(thunkAPI) => {
    try {
      const response = await makeApiRequest("POST", { action: "get_videos" });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getFileUrl = createAsyncThunk(
  "course/getFileUrl",
  async(params, thunkAPI) => {
    try {
      const response = await makeApiRequest("POST", {
        action: "get_upload_url",
        ...params
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState: {
    course: null,
    status: "idle",
    error: null,
    coursesList: null,
    coursesListStatus: "idle",
    coursesListError: null,
    videosList: null,
    videosListStatus: "idle",
    videosListError: null,
    unFilteredCourseData: [],
    unFilteredVideoData: [],
    dataToSearch: "",
    isSearching: false,
    pdfFileUrlStatus: "idle",
    pdfFileUrlError: null,
    pdfFileUrlData: null,
    reloadVideosFlag: true,
    reloadCoursesFlag: true
  },
  reducers: {
    clearCourseState: (state) => {
      state.course = null;
      state.status = "idle";
      state.error = null;
    },
    searchCourseVideoList: (state, action) => {
      state.dataToSearch = action.payload;
      // Perform filtering
      const filteredCourses = state.unFilteredCourseData.data.courses?.filter(
        (item) =>
          item?.title?.toLowerCase().includes(action.payload.toLowerCase())
      );
      // Perform filtering
      const filteredVideos = state.unFilteredVideoData.data.videos?.filter(
        (item) =>
          item?.title?.toLowerCase().includes(action.payload.toLowerCase())
      );

      if (action.payload.toLowerCase() !== "") {
        state.isSearching = true;
      } else {
        state.isSearching = false;
      }
      // Wrap the filtered results in the desired structure
      state.coursesList = { data: { courses: filteredCourses } };
      state.videosList = { data: { videos: filteredVideos } };
    }
  },
  extraReducers: (builder) => {
    builder
      // createCourse cases
      .addCase(createCourse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.course = action.payload;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(`Failed to create course: ${action.payload}`);
      })

      // getCourseById cases
      .addCase(getCourseById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCourseById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.course = action.payload;
      })
      .addCase(getCourseById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(`Failed to fetch course details: ${action.payload}`);
      })

      // getCoursesList cases
      .addCase(getCoursesList.pending, (state) => {
        state.coursesListStatus = "loading";
        toast.dismiss();
      })
      .addCase(getCoursesList.fulfilled, (state, action) => {
        state.coursesListStatus = "succeeded";

        const allUploaded = action.payload.data.courses.every(
          (video) => video.video_status === "VIDEO_UPLOADED"
        );

        if (allUploaded) {
          setCookie("reloadCoursesFlag", false);
          state.reloadCoursesFlag = false;
        } else {
          setCookie("reloadCoursesFlag", true);
          state.reloadCoursesFlag = true;
        }
        const filteredCourses = action.payload.data.courses?.filter((item) =>
          item?.title?.toLowerCase().includes(state.dataToSearch.toLowerCase())
        );
        state.coursesList = { data: { courses: filteredCourses } };
        state.unFilteredCourseData = action.payload;
      })
      .addCase(getCoursesList.rejected, (state, action) => {
        state.coursesListStatus = "failed";
        state.coursesListError = action.payload;
        toast.error(`Failed to load courses list: ${action.payload}`);
      })

      // getVideosList cases
      .addCase(getVideosList.pending, (state) => {
        state.videosListStatus = "succeeded";
      })
      .addCase(getVideosList.fulfilled, (state, action) => {
        state.videosListStatus = "succeeded";

        const allUploaded = action.payload.data.videos.every(
          (video) => video.video_status === "VIDEO_UPLOADED"
        );

        if (allUploaded) {
          setCookie("reloadVideosFlag", false);
          state.reloadVideosFlag = false;
        } else {
          setCookie("reloadVideosFlag", true);
          state.reloadVideosFlag = true;
        }
        // const filteredVideos = action.payload.data.videos?.filter((item) =>            || temporary fix for the issue
        //   item?.title?.toLowerCase().includes(state.dataToSearch?.toLowerCase())
        // );
        const filteredVideos = action.payload.data.videos?.filter(
          (item) =>
            typeof item?.title === "string" &&
            item.title.toLowerCase().includes(state.dataToSearch?.toLowerCase())
        );

        state.videosList = { data: { videos: filteredVideos } };
        state.unFilteredVideoData = action.payload;
      })
      .addCase(getVideosList.rejected, (state, action) => {
        state.videosListStatus = "failed";
        state.videosListError = action.payload;
        toast.error(`Failed to load videos list: ${action.payload}`);
      })
      .addCase(getFileUrl.pending, (state) => {
        state.pdfFileUrlStatus = "loading";
      })
      .addCase(getFileUrl.fulfilled, (state, action) => {
        state.pdfFileUrlStatus = "succeeded";
        state.pdfFileUrlData = action.payload;
      })
      .addCase(getFileUrl.rejected, (state, action) => {
        state.pdfFileUrlStatus = "failed";
        state.pdfFileUrlError = action.payload;
      });
  }
});

export const { clearCourseState, searchCourseVideoList } = courseSlice.actions;

export default courseSlice.reducer;
