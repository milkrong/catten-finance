import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.accounts)[':id']['$patch']
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)[':id']['$patch']
>['json'];

export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.accounts[':id'].$patch({
        json,
        param: { id },
      });
      return await res.json();
    },
    onSuccess: (data) => {
      toast.success('Account updated successfully');
      queryClient.invalidateQueries({ queryKey: ['account', { id }] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update account');
    },
  });
  return mutation;
};
