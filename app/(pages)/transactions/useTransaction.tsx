import {
  addTransactions,
  updateTransactions,
} from "@/app/lib/state/redux/reducer/transactions";
import { useAppDispatch } from "@/app/lib/state/redux/store";
import { useZustandStore } from "@/app/lib/state/zustand";
import { categories } from "@/app/lib/utils/data";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const useTransaction = ({
  dialogType,
  selectedData,
  setToggleClearRows,
  setOpen
}: any) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const { userSession } = useZustandStore();

  useEffect(() => {
    // setValue("transaction_type", "expense");
  }, []);

  let [categoryOptions, setCategoryOptions] = useState<any>();
  const transactionTypeWatch = watch("transaction_type");

  useEffect(() => {
    console.log(transactionTypeWatch);
    if (transactionTypeWatch === "income") {
      console.log(categories().income);
      setCategoryOptions(categories().income);
      // categoryOptions = categories().income;
    } else if (transactionTypeWatch === "expense") {
      console.log(categories().expense);
      setCategoryOptions(categories().expense);
      // categoryOptions = categories().expense;
    }
    // setValue('transactionType', 'expense');
  }, [transactionTypeWatch]);
  const dispatch = useAppDispatch();

  const onSubmit = (data: any) => {
    // console.log(data);

    let param = {
      transaction_type: data.transaction_type,
      date: data.date,
      time: data.time,
      category_id: JSON.parse(data.transactionCategory)?.category_id,
      category_name: JSON.parse(data.transactionCategory)?.category_name,
      amount: data.amount,
      description: data.description,
      payment_mode: data.payment_mode,
      user_id: userSession?.user.id,
    };
    console.log(param, "post");

    if (dialogType === 0) {
      dispatch(addTransactions(param));
      setOpen(false)
    } else if (dialogType === 1) {
      let params = { ...param, id: selectedData[0].id };
      dispatch(updateTransactions(params));
      setToggleClearRows(true);
      setOpen(false)
    }

    reset();
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    onSubmit,
    categoryOptions,
    setCategoryOptions,
    getValues,
    reset,
  };
};

export default useTransaction;
