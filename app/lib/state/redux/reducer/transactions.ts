/* React Redux Toolkit  */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { supabase } from "@/app/lib/supabase";

/* Initial State */
const initialState = { isLoadingTransactions: false, transactions: [] };

export const transactionsSlice = createSlice({
  name: "CartProduct",
  initialState,
  reducers: {
    start: (state) => {
      return {
        ...state,
        isLoadingTransactions: true,
        isError: false,
      };
    },
    success: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        ...action.payload,
        isLoadingTransactions: false,
        isError: false,
      };
    },
    error: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        isLoadingTransactions: false,
        isError: true,
      };
    },
  },
});

export const fetchTransactions = (user_id: string) => async (dispatch: any) => {
  try {
    await supabase
      .from("expense_table_master")
      .select()
      .eq("user_id", user_id)
      .then((res) => {
        dispatch(success({ transactions: res.data }));
      });
  } catch (err: any) {
    dispatch(error(err));
  }
};

export const addTransactions = (params: any) => async (dispatch: any) => {
  try {
    await supabase
      .from("expense_table_master")
      .insert(params)
      .then((res) => {
        dispatch(fetchTransactions(params.user_id));
      });
  } catch (err: any) {
    dispatch(error(err));
  }
};

/* Selector */
export const selectTransactions = (state: RootState) => state.transactions;

/* Actions */
export const { start, success, error } = transactionsSlice.actions;

/* Reducer */
export const transactionsReducer = transactionsSlice.reducer;
