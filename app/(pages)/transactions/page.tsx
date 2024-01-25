"use client";
import { useZustandStore } from "@/app/lib/state/zustand";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";
import useTransaction from "./useTransaction";
import DataTable from "react-data-table-component";
import { useAppDispatch, useAppSelector } from "@/app/lib/state/redux/store";
import {
  deleteTransactions,
  fetchTransactions,
  selectTransactions,
} from "@/app/lib/state/redux/reducer/transactions";
import { ITransaction } from "@/app/lib/types";
import { useIsGtMd } from "@/app/lib/hooks/useMediaQuery";

const Transactions = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectTransactions).transactions;

  const { userSession, setUserUserSession } = useZustandStore();
  const router = useRouter();
  useEffect(() => {
    if (userSession) {
      dispatch(fetchTransactions(userSession.user.id));
    }
  }, [userSession]);

  useEffect(() => {
    console.log(transactions);
  }, [transactions]);
  const [dialogType, setDialogType] = React.useState<number>();
  const [selectedData, setSelectedData] = React.useState<ITransaction[]>([]);
  const [toggledClearRows, setToggleClearRows] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    onSubmit,
    categoryOptions,
    setCategoryOptions,
    getValues,
    reset,
  } = useTransaction({ dialogType, selectedData,setToggleClearRows,setOpen });

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      if (res.data.session === null) {
        router.push("/auth");
      } else {
        setUserUserSession(res.data.session);
      }
    });
  }, [supabase]);

  function openAddTransactionDialog() {
    reset();
    setDialogType(0);
    setValue("transaction_type", "income");
    setOpen(!open);
  }

  function openEditTransactionDialog() {
    setDialogType(1);
    Object.entries(selectedData[0]).forEach(([name, value]: any) =>
      setValue(name, value)
    );
    let transactionCategory = {
      category_id: selectedData[0].category_id,
      category_name: selectedData[0].category_name,
    };
    setTimeout(() => {
      setValue("transactionCategory", JSON.stringify(transactionCategory));
    }, 50);
    setOpen(!open);
  }


  const handleChange = (state: any) => {
    setSelectedData(state.selectedRows);
  };

  const deleteTransaction = () => {
    let ids = selectedData.map((transaction) => transaction.id);
    let params = { id: ids, user_id: userSession?.user.id };
    dispatch(deleteTransactions(params));
  };

  useEffect(() => {
    console.log(selectedData);
  }, [selectedData]);

  const TransactionForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="py-2 space-y-5">
        <div className="flex space-x-15">
          <div>
            <input
              {...register("transaction_type", {
                required: true,
              })}
              type="radio"
              value="income"
            />
            <label> Income</label>
          </div>
          <div>
            <input
              {...register("transaction_type", {
                required: true,
              })}
              type="radio"
              value="expense"
            />
            <label> Expense</label>
          </div>
        </div>

        <div className="flex flex-wrap lg:space-x-5">
          <div>
            <p>Choose a Date</p>
            <input
              type="date"
              placeholder="transactionDate"
              {...register("date", { required: true })}
            />
          </div>
          <div>
            <p>Choose a Time</p>
            <input
              type="time"
              placeholder="transactionTime"
              {...register("time", { required: true })}
            />
          </div>
        </div>

        <div className="flex flex-wrap lg:space-x-5">
          <div className="w-40">
            <p>Select a Category</p>
            <select
              className={"w-full"}
              {...register("transactionCategory", {
                required: true,
              })}
            >
              {categoryOptions?.map((e: any, index: number) => (
                <option key={index} value={JSON.stringify(e)}>
                  {e.category_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p>Enter a Amount</p>
            <input
              type="number"
              placeholder="transactionAmount"
              {...register("amount", { required: true })}
            />
          </div>
        </div>

        <div>
          <p>Descriptions</p>
          <input
            className="w-full"
            type="text"
            placeholder="description"
            {...register("description", { required: true })}
          />
        </div>

        <div className={"w-[300px] "}>
          <p>Payment Mode</p>
          <div>
            <input
              {...register("payment_mode", { required: true })}
              type="radio"
              value="cash"
            />
            <label> Cash</label>

            <input
              className={"ml-2"}
              {...register("payment_mode", { required: true })}
              type="radio"
              value="debitCard"
            />
            <label> Debit Card</label>
          </div>

          <div>
            <input
              {...register("payment_mode", { required: true })}
              type="radio"
              value="creditCard"
            />
            <label> Credit Card</label>

            <input
              className={"ml-2"}
              {...register("payment_mode", { required: true })}
              type="radio"
              value="onlinePayment"
            />
            <label>Online Payment</label>
          </div>
        </div>
        <button type="submit">{dialogType === 0 ? "Add" : "Update"}</button>
      </form>
    );
  };

  const closedialog = () => {
    console.log("dialog");
    if (open) {
      reset();
    }
  };

  const dialog = () => {
    return (
      <Dialog.Root
        open={open}
        onOpenChange={() => {
          setOpen(!open);
          closedialog();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              {dialogType === 0 ? "Add" : "Update"}
              Transaction
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <IoMdClose />
              </button>
            </Dialog.Close>
            {TransactionForm()}
            {/* <div className="mt-[25px] flex justify-end">
              <Dialog.Close asChild>
                <button className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                  Save changes
                </button>
              </Dialog.Close>
            </div> */}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  };

  const columns = [
    {
      name: "Transaction Type",
      selector: (row: any) => row.transaction_type,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: any) => row.date,
      sortable: true,
    },
    {
      name: "Time",
      selector: (row: any) => row.time,
      sortable: true,
    },
    {
      name: "Category ID",
      selector: (row: any) => row.category_id,
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row: any) => row.category_name,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row: any) => row.amount,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row: any) => row.description,
      sortable: true,
    },
    {
      name: "Payment Mode",
      selector: (row: any) => row.payment_mode,
      sortable: true,
    },
    {
      name: "User ID",
      selector: (row: any) => row.user_id,
      sortable: true,
    },
  ];
  const isGtMd = useIsGtMd();

  return (
    <div className={isGtMd ? "ml-[200px]" : ""}>
      {open && dialog()}
      <div className="space-x-5">
        <button onClick={openAddTransactionDialog}>add transaction</button>
        <button
          disabled={selectedData?.length === 0 || selectedData?.length > 1}
          onClick={openEditTransactionDialog}
        >
          edit transaction
        </button>
        <button
          disabled={selectedData?.length === 0}
          onClick={deleteTransaction}
        >
          delete transaction
        </button>
      </div>
      <DataTable
        columns={columns}
        data={transactions}
        selectableRows
        onSelectedRowsChange={handleChange}
        clearSelectedRows={toggledClearRows}
        pagination
      />
    </div>
  );
};

export default Transactions;
