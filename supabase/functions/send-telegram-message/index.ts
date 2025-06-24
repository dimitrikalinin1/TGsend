
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Security utility functions
const sanitizeMessage = (message: string): string => {
  // Remove potential HTML/script tags and limit length
  return message
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .substring(0, 4096); // Telegram message limit
};

const validateInput = (data: any): string | null => {
  if (!data.campaignId || typeof data.campaignId !== 'string') {
    return 'Invalid campaign ID';
  }
  if (!data.contactId || typeof data.contactId !== 'string') {
    return 'Invalid contact ID';
  }
  if (!data.telegramAccountId || typeof data.telegramAccountId !== 'string') {
    return 'Invalid telegram account ID';
  }
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    return 'Invalid message content';
  }
  return null;
};

const logAuditEvent = async (supabaseClient: any, userId: string, action: string, details: any) => {
  try {
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: userId,
        action,
        table_name: 'telegram_message',
        new_data: details,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the user is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid or expired token');
    }

    const requestData = await req.json();
    
    // Validate input
    const validationError = validateInput(requestData);
    if (validationError) {
      throw new Error(validationError);
    }

    const { campaignId, contactId, telegramAccountId, message } = requestData;

    // Check rate limiting
    const rateLimitCheck = await supabaseClient.rpc('check_rate_limit', {
      p_user_id: user.id,
      p_action: 'send_telegram_message',
      p_max_requests: 100, // 100 messages per hour
      p_window_minutes: 60
    });

    if (!rateLimitCheck.data) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Verify user owns the campaign
    const { data: campaign, error: campaignError } = await supabaseClient
      .from('campaigns')
      .select('user_id, message_templates!inner(*)')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      throw new Error('Campaign not found or access denied');
    }

    // Verify user owns the telegram account
    const { data: account, error: accountError } = await supabaseClient
      .from('telegram_accounts')
      .select('api_token, status')
      .eq('id', telegramAccountId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (accountError || !account) {
      throw new Error('Telegram account not found or inactive');
    }

    // Verify user owns the contact
    const { data: contact, error: contactError } = await supabaseClient
      .from('contacts')
      .select('telegram_id, username, is_active')
      .eq('id', contactId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (contactError || !contact) {
      throw new Error('Contact not found or inactive');
    }

    // Sanitize message content
    const sanitizedMessage = sanitizeMessage(message);

    // Send message through Telegram Bot API
    const telegramResponse = await fetch(`https://api.telegram.org/bot${account.api_token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: contact.telegram_id || `@${contact.username}`,
        text: sanitizedMessage,
        parse_mode: 'HTML'
      }),
    });

    const telegramResult = await telegramResponse.json();

    // Update message log status
    const logStatus = telegramResult.ok ? 'sent' : 'failed';
    const updateData: any = {
      status: logStatus,
      ...(telegramResult.ok 
        ? { sent_at: new Date().toISOString() }
        : { error_message: telegramResult.description || 'Unknown error' }
      )
    };

    await supabaseClient
      .from('message_logs')
      .update(updateData)
      .eq('campaign_id', campaignId)
      .eq('contact_id', contactId)
      .eq('telegram_account_id', telegramAccountId);

    // Log audit event
    await logAuditEvent(supabaseClient, user.id, 'telegram_message_sent', {
      campaign_id: campaignId,
      contact_id: contactId,
      telegram_account_id: telegramAccountId,
      success: telegramResult.ok
    });

    return new Response(
      JSON.stringify({ success: telegramResult.ok, result: telegramResult }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-telegram-message:', error);
    
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
