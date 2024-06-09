import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface ICategoryBlogState {
  cateBlogData: {
    _id: string
    name: string
  }
}

const initialState: ICategoryBlogState = {
  cateBlogData: {
    _id: '',
    name: ''
  }
}

const categoryBlogSlice = createSlice({
  name: 'categoryBlog',
  initialState,
  reducers: {
    setCategoryBlog: (state, action: PayloadAction<{ _id: string; name: string }>) => {
      state.cateBlogData = action.payload
    }
  }
})

export const { setCategoryBlog } = categoryBlogSlice.actions
export const categoryBlogReducer = categoryBlogSlice.reducer
