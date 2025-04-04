import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state type
interface ThemeState {
    mode: "light" | "dark";
}

// Initial state with type
const initialState: ThemeState = { mode: "light" };

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setTheme: (state, action: PayloadAction<"light" | "dark">) => {
            state.mode = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

// Define RootState type
const store = configureStore({
    reducer: {
        theme: themeSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
