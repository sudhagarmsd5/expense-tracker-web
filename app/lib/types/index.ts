export interface ITransaction {
  id?: number;
  created_at?: Date | string;
  transaction_type?: string;
  date?: Date | string;
  time?: string;
  category_id?: number;
  category_name?: string;
  amount?: string;
  description?: string;
  payment_mode?: string;
  user_id?: string;
}
