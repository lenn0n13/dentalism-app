import { configureStore } from "@reduxjs/toolkit";
import systemSlice from "./features/system/systemSlice"
const store = configureStore({
  reducer: {
    system: systemSlice,
  },
});

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
