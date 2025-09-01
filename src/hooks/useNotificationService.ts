import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useNotificationService = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const sendFeatureErrorNotification = async (featureName: string, errorMessage?: string) => {
    if (!user?.email) {
      console.warn('Cannot send notification: user email not available');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: {
          userEmail: user.email,
          featureName,
          errorMessage,
        },
      });

      if (error) {
        console.error('Failed to send notification:', error);
        toast({
          title: "Notification Error",
          description: "Failed to send error notification email",
          variant: "destructive",
        });
        return;
      }

      console.log('Notification sent successfully:', data);
      toast({
        title: "Notification Sent",
        description: `We've sent you an email about the ${featureName} issue`,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Notification Error", 
        description: "Failed to send error notification email",
        variant: "destructive",
      });
    }
  };

  return {
    sendFeatureErrorNotification,
  };
};