/* React Redux Toolkit  */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { supabase } from "@/app/lib/supabase";

/* Initial State */
const initialState = {
  overall_summary: [
    {
      total_income: 0,
      total_expenses: 0,
      total_transactions: 0,
      balance: 0,
    },
  ],
  expense_summary: [
    {
      category_name: "Bills",
      total_amount: 0,
      percentage: 0,
    },
    {
      category_name: "Clothing",
      total_amount: 0,
      percentage: 0,
    },
    {
      category_name: "Food",
      total_amount: 0,
      percentage: 0,
    },
    {
      category_name: "Health Care",
      total_amount: 0,
      percentage: 0,
    },
    {
      category_name: "Insurance",
      total_amount: 0,
      percentage: 0,
    },
    {
      category_name: "Mortgage / Rent",
      total_amount: 0,
      percentage: 0,
    },
    {
      category_name: "Shopping",
      total_amount: 0,
      percentage: 0,
    },
    {
      category_name: "Transportation",
      total_amount: 0,
      percentage: 0,
    },
    {
      category_name: "Utilities",
      total_amount: 0,
      percentage: 0,
    },
    {
      category_name: "Others",
      total_amount: 0,
      percentage: 0,
    },
  ],
  recent_transactions: [],
};

export const analyticsSlice = createSlice({
  name: "analyticsData",
  initialState,
  reducers: {
    start: (state) => {
      return {
        ...state,
        isError: false,
      };
    },
    success: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        ...action.payload,
        isError: false,
      };
    },
    error: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        isError: true,
      };
    },
  },
});

export const fetchOverallSummary =
  (user_id: string) => async (dispatch: any) => {
    try {
      await supabase
        .rpc("get_all_summary", {
          _user_id: user_id,
        })
        .then((res) => {
          dispatch(success({ overall_summary: res.data }));
        });
    } catch (err: any) {
      dispatch(error(err));
    }
  };

export const fetchExpenseSummary =
  (user_id: string) => async (dispatch: any) => {
    try {
        // sql query fix to get based on user_id
      await supabase
        .rpc("get_expense_summary", {
          _user_id: user_id,
        })
        .then((res) => {
          dispatch(success({ expense_summary: res.data }));
        });
    } catch (err: any) {
      dispatch(error(err));
    }
  };

export const fetchRecentTransactions =
  (user_id: string) => async (dispatch: any) => {
    try {
      // sql query fix to get based on user_id
      await supabase
        .rpc("get_recent_transactions", {
          _user_id: user_id,
        })
        .then((res) => {
          dispatch(success({ recent_transactions: res.data }));
        });
    } catch (err: any) {
      dispatch(error(err));
    }
  };

/* Selector */
export const selectAnalyticsData = (state: RootState) => state.analytics;

/* Actions */
export const { start, success, error } = analyticsSlice.actions;

/* Reducer */
export const analyticsReducer = analyticsSlice.reducer;
