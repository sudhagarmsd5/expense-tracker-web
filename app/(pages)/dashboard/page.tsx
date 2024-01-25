"use client";
import {
  fetchExpenseSummary,
  fetchOverallSummary,
  fetchRecentTransactions,
  selectAnalyticsData,
} from "@/app/lib/state/redux/reducer/analytics";
import { useAppDispatch, useAppSelector } from "@/app/lib/state/redux/store";
import { useZustandStore } from "@/app/lib/state/zustand";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DataTable from "react-data-table-component";
import { useIsGtMd } from "@/app/lib/hooks/useMediaQuery";
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { userSession, setUserUserSession } = useZustandStore();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const analytics = useAppSelector(selectAnalyticsData).overall_summary;
  const expense_summary = useAppSelector(selectAnalyticsData).expense_summary;
  const recent_transactions =
    useAppSelector(selectAnalyticsData).recent_transactions;

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      if (res.data.session === null) {
        router.push("/auth");
      } else {
        setUserUserSession(res.data.session);
        dispatch(fetchOverallSummary(res.data.session?.user.id));
        dispatch(fetchExpenseSummary(res.data.session.user.id));
        dispatch(fetchRecentTransactions(res.data.session.user.id));
      }
    });
  }, [supabase]);

  const colors = [
    "RGB(97, 239, 205)",
    "RGB(205, 222, 31)",
    "RGB(254, 194, 0)",
    "RGB(202, 118, 90)",
    "RGB(36, 133, 250)",
    "RGB(245, 125, 125)",
    "RGB(193, 82, 210)",
    "RGB(136, 84, 217)",
    "RGB(61, 78, 184)",
    "RGB(0, 188, 215)",
  ];

  const chartData = {
    labels: [
      "Mortgage / Rent",
      "Food",
      "Utilities",
      "Bills",
      "Shopping",
      "Transportation",
      "Insurance",
      "Health Care",
      "Clothing",
      "Others",
    ],
    datasets: [
      {
        axis: "x",
        label: "Total Expenses",
        data: expense_summary.map((item) => item.percentage.toFixed(0)),
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    elements: {
      bar: {
        borderWidth: 2,
        innerWidth: 5,
      },
    },
    indexAxis: "x" as const,

    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 10,
          boxWidth: 15,
          boxHeight: 15,
        },
      },

      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };

  const doughnutChart = () => {
    return (
      <>
        <div className="bg-white flex flex-row   rounded-lg shadow-custom p-5">
          <div className="">
            <p className="text-base text-gray-700 font-poppins font-semibold">
              Total Expenses
            </p>
            <div className="flex mt-5 h-[calc(100vh/2)] w-[calc(100vw/2)]">
              <Doughnut data={chartData} options={options} />
            </div>
          </div>
          <table className="e-table" cellSpacing="0.25px">
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "50%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <tbody>
              {expense_summary.map(
                ({ category_name, total_amount, percentage }, index) => (
                  <tr key={index} style={{ height: "30px" }}>
                    <td>
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          marginLeft: "1px",
                          borderRadius: "16px",
                          backgroundColor: colors[index],
                        }}
                      ></div>
                    </td>
                    <td> {category_name} </td>
                    <td> ${total_amount} </td>
                    <td style={{ textAlign: "right" }}>
                      {" "}
                      {Math.round(percentage).toFixed(0)} %{" "}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const columns = [
    {
      name: "Date",
      selector: (row: any) => row.date,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row: any) => row.category_name,
      sortable: true,
    },
    {
      name: "Payment Mode",
      selector: (row: any) => row.payment_mode,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row: any) => row.amount,
      sortable: true,
    },
  ];

  const recentTransactions = () => {
    return (
      <DataTable
        columns={columns}
        data={recent_transactions}
      />
    )
  };
  const isGtMd = useIsGtMd();

  return (
    <div className={isGtMd ? "ml-[200px]" : ""}>
      <div>
        <div>Logged in!</div>
        <div>Total Income: {analytics[0].total_income}</div>
        <div>Total Expenses: {analytics[0].total_expenses}</div>
        <div>Total Transactions: {analytics[0].total_transactions}</div>
        <div>Balance: {analytics[0].balance}</div>
        {doughnutChart()}
        {recentTransactions()}
      </div>
    </div>
  );
};

export default Dashboard;
