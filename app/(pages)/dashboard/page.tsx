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
import DataTable, { Alignment } from "react-data-table-component";
import { useIsGtMd } from "@/app/lib/hooks/useMediaQuery";
import { numberWithCommas } from "@/app/lib/utils/helpers";
import { categoryImages } from "@/app/lib/utils/data";
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
        data: expense_summary?.map((item) => item.percentage.toFixed(0)),
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
        display: false,
      },

      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };

  const filterCategoryImg = (row:any)=>{
    let data = categoryImages.find((obj)=> obj.category_id === row.category_id);    
    return <> 
    <div className="flex justify-center items-center">
    <img src={data?.category_img} className="mr-2 h-5 w-5" /> {row.category_name} 
    </div>
    </> 
  }

  const columns = [
    {
      name: "Date",
      selector: (row: any) => row.date,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row:any)=>filterCategoryImg(row),
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

  const subHeaderComponent = () => {

    return (
      <>
        <div className="text-base text-gray-700 font-poppins font-semibold">
          Recent Transactions
        </div>
      </>
    )
  }

  const recentTransactions = () => {
    return <DataTable className="shadow-custom rounded-md" columns={columns} data={recent_transactions} subHeader
      subHeaderComponent={subHeaderComponent()}     subHeaderAlign={Alignment.LEFT} />;
  };
  const isGtMd = useIsGtMd();

  const sectionOne = () => {
    return (
      <>
        <div className="cards">
          <div className="px-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className="py-5 px-5 rounded-md bg-white"
              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px 0.5px" }}
            >
              <div className="text-[#4d80f3] text-center text-xl font-medium">
                ₹{numberWithCommas(analytics[0].total_income)}
              </div>

              <div className="py-1 text-gray-600 text-center">Income</div>
            </div>
            <div
              className="py-5 rounded-md bg-white"
              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px 0.5px" }}
            >
              <div className="text-[#fb6d9d] text-center text-xl font-medium">
                ₹{numberWithCommas(analytics[0].total_expenses)}
              </div>

              <div className="py-1 text-gray-600 text-center">Expenses</div>
            </div>
            <div
              className="py-5 rounded-md bg-white"
              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px 0.5px" }}
            >
              <div className="text-[#81c868] text-center text-xl font-medium">
                ₹{numberWithCommas(analytics[0].balance)}
              </div>

              <div className="py-1 text-gray-600 text-center">Balance</div>
            </div>
            <div
              className="py-5 rounded-md bg-white"
              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px 0.5px" }}
            >
              <div className="text-[#34d3eb] text-center text-xl font-medium">
                {numberWithCommas(analytics[0].total_transactions)}
              </div>

              <div className="py-1 text-gray-600 text-center">Transactions</div>
            </div>
          </div>
        </div>
      </>
    );
  };


  const sectionTwo = () => {
    return (
      <div className="expenses-analysis shadow-custom rounded-md bg-white pt-2">
        <div className="flex flex-col md:flex-row p-1">
          <div className="doughnut">
            <p className="text-base ml-4 text-gray-700 font-poppins font-semibold">
              Total Expenses
            </p>

            <div className="flex flex-col md:flex-row px-2 md:px-5 items-center">
              <div className=" flex justify-center mt-2 h-[200px] md:h-[300px] w-full">
                {chartData.datasets[0].data.every(
                  (element) => element === "0"
                ) ? (
                  <>
                    <div className="text-gray-700 flex justify-center items-center">No data available</div>
                  </>
                ) : (
                  <Doughnut data={chartData} options={options} />
                )}
              </div>
              <div className="w-full doughnut-details px-2 md:px-5 flex justify-center items-center">
                <table className="e-table m" cellSpacing="0.25px">
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
                          <td> ₹ {total_amount} </td>
                          <td style={{ textAlign: "right" }}>
                            {Math.round(percentage).toFixed(0)} %{" "}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={isGtMd ? "ml-[200px] bg-gray-200" : "bg-gray-200"}>
      <div className="p-2">
       <div className="pt-5 md:pt-1">
        {sectionOne()}
       </div>
       <div className="py-5">
        {sectionTwo()}
        </div>
        {recentTransactions()}
      </div>
    </div>
  );
};

export default Dashboard;
