import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Image {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  author?: {
    name: string;
  };
}

interface GalleryState {
  images: Image[];
  likedImageIds: string[];
  loading: boolean;
  error: string | null;
}

const initialState: GalleryState = {
  images: [],
  likedImageIds: [],
  loading: false,
  error: null,
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<Image[]>) => {
      state.images = action.payload;
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.likedImageIds.includes(id)) {
        state.likedImageIds = state.likedImageIds.filter(item => item !== id);
      } else {
        state.likedImageIds.push(id);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setImages, toggleLike, setLoading, setError } = gallerySlice.actions;
export default gallerySlice.reducer;
