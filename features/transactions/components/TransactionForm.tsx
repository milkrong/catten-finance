import { insertTransactionSchema } from "@/db/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Select } from "@/components/Select";
import { DatePicker } from "@/components/DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { AmountInput } from "@/components/AmountInput";
import { convertAmountToMillion } from "@/lib/utils";

const formSchema = z.object({
  date: z.date(),
  amount: z.string(),
  payee: z.string(),
  accountId: z.string(),
  categoryId: z.string().optional(),
  notes: z.string().nullable().optional(),
});

const apiSchema = insertTransactionSchema.omit({
  id: true,
});

export type FormValues = z.infer<typeof formSchema>;
export type ApiFormValues = z.infer<typeof apiSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    const amount = convertAmountToMillion(parseFloat(values.amount));
    onSubmit({ ...values, amount });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  onCreate={onCreateAccount}
                  options={accountOptions}
                  value={field.value}
                  placeholder="Select an account"
                  disabled={disabled}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onCreate={onCreateCategory}
                  onChange={field.onChange}
                  value={field.value}
                  options={categoryOptions}
                  placeholder="Select a category"
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder="Select a date"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input {...field} disabled={disabled} placeholder="Payee" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput {...field} placeholder="0.00" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ""} disabled={disabled} placeholder="Add a note" />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full mt-4" type="submit" disabled={disabled}>
          {id ? "Save Changes" : "Create Transaction"}
        </Button>
        {!!id && (
          <Button className="mt-4 w-full" variant="outline" type="button" disabled={disabled} onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Transaction
          </Button>
        )}
      </form>
    </Form>
  );
};
