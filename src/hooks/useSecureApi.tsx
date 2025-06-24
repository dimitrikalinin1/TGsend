
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSecureApi = () => {
  const { session } = useAuth();
  const { toast } = useToast();

  const makeSecureRequest = async (
    functionName: string, 
    data: any,
    options: { showErrorToast?: boolean } = { showErrorToast: true }
  ) => {
    try {
      console.log(`Making request to ${functionName} with data:`, data);
      
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke(functionName, {
        body: data,
        headers: {
          authorization: `Bearer ${session.access_token}`
        }
      });

      console.log(`Response from ${functionName}:`, response);

      if (response.error) {
        console.error(`Error from ${functionName}:`, response.error);
        throw new Error(response.error.message || 'Request failed');
      }

      return response.data;
    } catch (error) {
      console.error(`Error in ${functionName}:`, error);
      
      if (options.showErrorToast) {
        let errorMessage = 'Произошла неожиданная ошибка';
        
        if (error instanceof Error) {
          if (error.message.includes('OPENROUTER_API_KEY')) {
            errorMessage = 'Не настроен API ключ OpenRouter. Обратитесь к администратору.';
          } else if (error.message.includes('Edge Function returned a non-2xx status code')) {
            errorMessage = 'Ошибка на сервере. Проверьте логи Edge Function.';
          } else {
            errorMessage = error.message;
          }
        }
        
        toast({
          title: "Ошибка",
          description: errorMessage,
          variant: "destructive"
        });
      }
      
      throw error;
    }
  };

  return { makeSecureRequest };
};
