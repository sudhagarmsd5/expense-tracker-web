"use client";
import { useZustandStore } from "@/app/lib/state/zustand";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose, IoIosSearch } from "react-icons/io";
import useTransaction from "./useTransaction";
import DataTable, { Alignment } from "react-data-table-component";
import { useAppDispatch, useAppSelector } from "@/app/lib/state/redux/store";
import {
  deleteTransactions,
  fetchTransactions,
  selectTransactions,
} from "@/app/lib/state/redux/reducer/transactions";
import { ITransaction } from "@/app/lib/types";
import { useIsGtMd } from "@/app/lib/hooks/useMediaQuery";
import { MdEdit, MdOutlineAddBox } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { convertTo12HourTime } from "@/app/lib/utils/helpers";
import { categoryImages } from "@/app/lib/utils/data";

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

  const [dialogType, setDialogType] = React.useState<number>();
  const [selectedData, setSelectedData] = React.useState<ITransaction[]>([]);
  const [toggledClearRows, setToggleClearRows] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    onSubmit,
    categoryOptions,
    reset,
  } = useTransaction({ dialogType, selectedData, setToggleClearRows, setOpen });

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

  const TransactionForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="">
        {/* Radio buttons for transaction type */}
        <div className="h-5 mt-2">
          <div className="w-1/2 float-left">
            <input
              {...register("transaction_type", { required: true })}
              type="radio"
              value="income"
              className="mr-2 cursor-pointer"
            />
            <label> Income</label>
          </div>
          <div className="w-1/2 float-left">
            <input
              {...register("transaction_type", { required: true })}
              type="radio"
              value="expense"
              className="mr-2 cursor-pointer"
            />
            <label> Expense</label>
          </div>
        </div>

        {/* Date and time inputs */}
        <div className="h-12 mt-7">
          <div className="w-1/2 float-left">
            <p>Choose a Date</p>
            <input
              type="date"
              placeholder="Select Date"
              {...register("date", { required: true })}
              className="border border-gray-300 rounded-md p-1 w-[95%]"
            />
          </div>
          <div className="w-1/2 float-right">
            <p>Choose a Time</p>
            <input
              type="time"
              placeholder="Select Time"
              {...register("time", { required: true })}
              className="border border-gray-300 rounded-md p-1 w-[95%]"
            />
          </div>
        </div>

        {/* Category select and amount input */}
        <div className="h-16 mt-10">
          <div className="w-1/2 float-left">
            <p>Select a Category</p>
            <select
              className={" border border-gray-300 rounded-md p-1 w-[95%]"}
              {...register("transactionCategory", { required: true })}
            >
              {categoryOptions?.map((e: any, index: number) => (
                <option key={index} value={JSON.stringify(e)}>
                  {e.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2 float-right">
            <p>Enter an Amount</p>
            <input
              type="number"
              placeholder="Enter Amount"
              {...register("amount", { required: true })}
              className="border border-gray-300 rounded-md p-1 w-[95%]"
            />
          </div>
        </div>

        {/* Description input */}
        <div className="h-12 mt-3">
          <p>Description</p>
          <textarea
            className="w-full border border-gray-300 rounded-md p-1"
            placeholder="Enter Description"
            {...register("description", { required: true })}
          />
        </div>

        {/* Payment mode radio buttons */}
        <div className={"mt-10 h-auto "}>
          <p>Payment Mode</p>

          <div className="mt-1">
            <div className="w-[50%] float-left min-w-[80px]">
              <input
                {...register("payment_mode", { required: true })}
                type="radio"
                value="cash"
                className="mr-2 cursor-pointer"
              />
              <label> Cash</label>
              {/* Similarly style other radio buttons */}
            </div>
            <div className="w-[50%] float-left min-w-[80px]">
              <input
                {...register("payment_mode", { required: true })}
                type="radio"
                value="debitCard"
                id="debitCard"
                className="mr-2 cursor-pointer"
              />
              <label htmlFor="debitCard"> Debit Card</label>
            </div>
            <div className="w-[50%] float-left min-w-[80px]">
              <input
                {...register("payment_mode", { required: true })}
                type="radio"
                value="creditCard"
                id="creditCard"
                className="mr-2 cursor-pointer"
              />
              <label htmlFor="creditCard"> Credit Card</label>
            </div>
            <div className="w-[50%] float-left min-w-[80px]">
              <input
                {...register("payment_mode", { required: true })}
                type="radio"
                value="onlinePayment"
                id="onlinePayment"
                className="mr-2 cursor-pointer "
              />
              <label htmlFor="onlinePayment">Online Payment</label>
            </div>
          </div>

        </div>

        <div className="text-right ">
        <button type="submit" className="mt-2 border border-gray-300 rounded-sm py-1 px-3 blue-btn text-white">{dialogType === 0 ? "Add" : "Update"}</button>
        <button onClick={()=>{ setOpen(!open);closedialog()}} className="mt-2 ml-2 border border-[#4273f9] rounded-sm py-1 px-3 text-[#4273f9] hover:text-white blue-btn-hover">Cancel</button>
        </div>
      </form>
    );
  };


  const closedialog = () => {
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
              {dialogType === 0 ? "Add" : "Update"} {" "}
              Transaction
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className=" absolute top-[10px] right-[10px] inline-flex h-[30px] w-[30px] appearance-none items-center justify-center rounded-full"
                aria-label="Close"
              >
                <IoMdClose  className="w-5 h-5 text-gray-400"/>
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

  const filterCategoryImg = (row:any)=>{
    let data = categoryImages.find((obj)=> obj.category_id === row.category_id);    
    return <> 
    <div className="flex justify-center items-center">
    <img src={data?.category_img} className="h-5 w-5" /> <span className="ml-3">{row.category_name}</span> 
    </div>
    </> 
  }

  const columns = [
    {
      name: "Transaction Type",
      selector: (row: any) => row.transaction_type,
      sortable: true,
      width:"150px"
    },
    {
      name: "Date",
      selector: (row: any) => row.date,
      sortable: true,
      width:"130px"

    },
    {
      name: "Time",
      selector: (row: any) => convertTo12HourTime(row.time),
      sortable: true,
      width:"150px"
    },
    {
      name: "Category Name",
      selector: (row:any)=>filterCategoryImg(row),
      sortable: true,
      width:"200px"
    },
    {
      name: "Amount",
      selector: (row: any) => row.amount,
      sortable: true,
      width:"150px"
    },
    {
      name: "Description",
      selector: (row: any) => row.description,
      sortable: true,
      width:"220px"
    },
    {
      name: "Payment Mode",
      selector: (row: any) => row.payment_mode,
      sortable: true,
      width:"150px"

    },
  ];

  const isGtMd = useIsGtMd();

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const filteredItems = transactions.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
      -1
  );

  const subHeaderComponent = () => {

    return (
      <>
        <div className="flex flex-col w-full">
          <div className="space-x-5 flex justify-end">
            <button
              disabled={selectedData?.length === 0 || selectedData?.length > 1}
              onClick={openEditTransactionDialog}
              className="disabled:opacity-50"
            >
              <div className="flex justify-center items-center">
                <MdEdit className="mr-1" /> Edit
              </div>
            </button>
            <button
              disabled={selectedData?.length === 0}
              onClick={deleteTransaction}
              className="disabled:opacity-50"
            >
              <div className="flex justify-center items-center">
                <RiDeleteBin6Line className="mr-1" /> Delete
              </div>
            </button>
          </div>
        </div>
      </>
    )
  }

  const searchFilter = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <>
        <div className="mb-6">
          <div className="expense-head-padding">
            <div className="search-wrapper search-section flex items-center justify-between">
              <div id="search">
                <span className="e-input-group e-control-wrapper w-full">
                  <input
                    id="txt"
                    type="search"
                    placeholder="Search"
                    className="search e-input focus:outline-none w-full leading-7"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                  <span
                    className="e-clear-icon e-clear-icon-hide mr-2"
                    aria-label="close"
                    role="button"
                    onClick={handleClear}
                  ></span>
                </span>
                <span
                  id="searchbtn"
                  className="e-search-icon expense-search-icon e-icons "
                >
                  <IoIosSearch />
                </span>
              </div>
              <div className="button-section search-section">
                <button
                  id="addexpense"
                  className="e-btn small e-info custom-btn hidden sm:block"
                  onClick={openAddTransactionDialog}
                >
                  Add
                </button>

                <button
                  id="addexpensebtn"
                  className="e-btn small e-info block sm:hidden"
                  onClick={openAddTransactionDialog}
                >
                  <MdOutlineAddBox className="text-2xl" />
                </button>

                <div id="add-btn" className="e-btn">
                  <span className="e-icons add-icon add-head-item"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }, [filterText, resetPaginationToggle, selectedData]);



  return (
    <div className={isGtMd ? "ml-[200px] " : ""}>
      {open && dialog()}
      <div className="p-4 ">
      <p className="text-base mb-2 ml-1 text-gray-700 font-poppins font-semibold">
      All Transactions
            </p>
        {/* <div className="mt-2">{sectionOne()}</div> */}

        {searchFilter}

        <DataTable
          columns={columns}
          data={filteredItems}
          selectableRows
          onSelectedRowsChange={handleChange}
          clearSelectedRows={toggledClearRows}
          pagination
          subHeader
          subHeaderAlign={Alignment.LEFT}
          subHeaderComponent={subHeaderComponent()}
        />
      </div>
    </div>
  );
};

export default Transactions;

