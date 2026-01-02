import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchAdminStats } from "@/services/api/idiomService";
import {
  fetchCommentStats,
  type CommentStats,
} from "@/services/api/commentService";

interface Stats {
  totalIdioms: number;
  levelStats: Array<{ name: string; count: number }>;
  typeStats: Array<{ name: string; count: number }>;
  recentIdioms: any[];
  contentHealth: {
    missingExamples: number;
    missingImages: number;
    missingOrigin: number;
  };
  hotKeywords: Array<{ query: string; count: number }>;
  [key: string]: any;
}

interface AdminState {
  stats: Stats | null;
  commentStats: CommentStats | null;
  loading: boolean;
  commentLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  commentsLastUpdated: number | null;
}

const initialState: AdminState = {
  stats: null,
  commentStats: null,
  loading: false,
  commentLoading: false,
  error: null,
  lastUpdated: null,
  commentsLastUpdated: null,
};

// Async thunk to fetch admin stats with caching logic
export const getAdminStats = createAsyncThunk(
  "admin/getStats",
  async (force: boolean | undefined, { getState, rejectWithValue }) => {
    const state = getState() as { admin: AdminState };
    const { lastUpdated, stats } = state.admin;

    // Cache logic: avoid fetching if data exists and is less than 2 minutes old,
    // unless 'force' is true.
    const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
    const isFresh = lastUpdated && Date.now() - lastUpdated < CACHE_DURATION;

    if (!force && stats && isFresh) {
      return stats; // Return existing stats if fresh
    }

    try {
      const data = await fetchAdminStats();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Không thể tải thống kê");
    }
  }
);

// Async thunk to fetch comment stats with caching logic
export const getCommentStats = createAsyncThunk(
  "admin/getCommentStats",
  async (force: boolean | undefined, { getState, rejectWithValue }) => {
    const state = getState() as { admin: AdminState };
    const { commentsLastUpdated, commentStats } = state.admin;

    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for comments
    const isFresh =
      commentsLastUpdated && Date.now() - commentsLastUpdated < CACHE_DURATION;

    if (!force && commentStats && isFresh) {
      return commentStats;
    }

    try {
      const data = await fetchCommentStats();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Không thể tải thống kê bình luận"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminStats: (state) => {
      state.stats = null;
      state.commentStats = null;
      state.lastUpdated = null;
      state.commentsLastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(getAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Comment Stats
      .addCase(getCommentStats.pending, (state) => {
        state.commentLoading = true;
      })
      .addCase(getCommentStats.fulfilled, (state, action) => {
        state.commentLoading = false;
        state.commentStats = action.payload;
        state.commentsLastUpdated = Date.now();
      })
      .addCase(getCommentStats.rejected, (state) => {
        state.commentLoading = false;
      });
  },
});

export const { clearAdminStats } = adminSlice.actions;
export default adminSlice.reducer;
