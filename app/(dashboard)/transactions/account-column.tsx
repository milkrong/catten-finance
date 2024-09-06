import { useEditAccountStore } from "@/features/accounts/hooks/use-edit-account";

export const AccountColumn = ({ account, accountId }: { account: string; accountId: string }) => {
  const { onOpen: editAccount } = useEditAccountStore();
  const handleClick = () => {
    editAccount(accountId);
  };
  return (
    <div className="flex items-center cursor-pointer hover:underline" onClick={handleClick}>
      {account}
    </div>
  );
};
