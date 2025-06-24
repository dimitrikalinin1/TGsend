
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Security utility functions
const validateCampaignInput = (data: any): string | null => {
  if (!data.campaignId || typeof data.campaignId !== 'string') {
    return 'Invalid campaign ID';
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
        table_name: 'campaigns',
        new_data: details,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
};

// Имитация человеческого поведения - случайные задержки
const getRandomDelay = (): number => {
  // Задержка от 30 секунд до 5 минут между сообщениями
  return Math.floor(Math.random() * (300000 - 30000) + 30000);
};

// Более короткие случайные задержки для имитации набора текста
const getTypingDelay = (): number => {
  // От 3 до 15 секунд имитация набора
  return Math.floor(Math.random() * (15000 - 3000) + 3000);
};

// Интеллектуальное распределение с учетом лимитов аккаунтов
const distributeContactsIntelligently = (contacts: any[], accounts: any[]) => {
  const distribution: { [accountId: string]: any[] } = {};
  const accountLimits: { [accountId: string]: number } = {};
  
  // Инициализируем распределение и лимиты
  accounts.forEach(account => {
    distribution[account.id] = [];
    // Для новых аккаунтов лимит 10 сообщений, для старых - больше
    const isNewAccount = !account.last_activity || 
      new Date(account.last_activity) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    accountLimits[account.id] = isNewAccount ? 10 : 50;
  });
  
  // Распределяем контакты с учетом лимитов
  let accountIndex = 0;
  for (const contact of contacts) {
    let assigned = false;
    let attempts = 0;
    
    while (!assigned && attempts < accounts.length) {
      const account = accounts[accountIndex];
      if (distribution[account.id].length < accountLimits[account.id]) {
        distribution[account.id].push(contact);
        assigned = true;
      }
      accountIndex = (accountIndex + 1) % accounts.length;
      attempts++;
    }
    
    // Если не удалось назначить (все аккаунты на лимите), прерываем
    if (!assigned) {
      console.log(`Не удалось назначить контакт ${contact.id} - все аккаунты достигли лимита`);
      break;
    }
  }
  
  return { distribution, accountLimits };
};

// Отправка сообщений с имитацией человеческого поведения
const sendMessagesWithHumanBehavior = async (
  supabaseClient: any,
  authHeader: string,
  campaignId: string,
  messageContent: string,
  distribution: { [accountId: string]: any[] },
  accounts: any[],
  accountLimits: { [accountId: string]: number }
) => {
  let totalSent = 0;
  let totalDelivered = 0;
  let totalFailed = 0;
  
  // Создаем задачи для каждого аккаунта
  const sendingPromises = accounts.map(async (account) => {
    const contactsForAccount = distribution[account.id] || [];
    const accountLimit = accountLimits[account.id];
    let accountSent = 0;
    let accountDelivered = 0;
    let accountFailed = 0;
    
    console.log(`Аккаунт ${account.name}: ${contactsForAccount.length} контактов (лимит: ${accountLimit})`);
    
    if (contactsForAccount.length === 0) {
      return { sent: 0, delivered: 0, failed: 0 };
    }
    
    // Обрабатываем контакты для этого аккаунта с человеческими задержками
    for (let i = 0; i < Math.min(contactsForAccount.length, accountLimit); i++) {
      const contact = contactsForAccount[i];
      
      try {
        // Имитируем время набора сообщения
        await new Promise(resolve => setTimeout(resolve, getTypingDelay()));
        
        const response = await supabaseClient.functions.invoke('send-telegram-message', {
          body: {
            campaignId,
            contactId: contact.id,
            telegramAccountId: account.id,
            message: messageContent
          },
          headers: {
            authorization: authHeader
          }
        });

        if (response.data?.success) {
          accountSent++;
          accountDelivered++;
          console.log(`✅ Сообщение отправлено с аккаунта ${account.name} контакту ${contact.id}`);
        } else {
          accountFailed++;
          console.error(`❌ Ошибка отправки с аккаунта ${account.name}:`, response.error);
        }

        // Человеческая задержка между сообщениями (кроме последнего)
        if (i < Math.min(contactsForAccount.length, accountLimit) - 1) {
          const delay = getRandomDelay();
          console.log(`⏱️ Аккаунт ${account.name} ожидает ${Math.round(delay/1000)} секунд до следующего сообщения`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

      } catch (error) {
        console.error(`❌ Критическая ошибка для аккаунта ${account.name}, контакт ${contact.id}:`, error);
        accountFailed++;
        
        // При ошибке делаем большую паузу
        await new Promise(resolve => setTimeout(resolve, 60000)); // 1 минута
      }
    }
    
    console.log(`Аккаунт ${account.name} завершил работу: ${accountDelivered} доставлено, ${accountFailed} ошибок`);
    return { sent: accountSent, delivered: accountDelivered, failed: accountFailed };
  });
  
  // Ждем завершения всех аккаунтов
  const results = await Promise.all(sendingPromises);
  
  // Агрегируем результаты
  results.forEach(result => {
    totalSent += result.sent;
    totalDelivered += result.delivered;
    totalFailed += result.failed;
  });
  
  return { totalSent, totalDelivered, totalFailed };
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
    const validationError = validateCampaignInput(requestData);
    if (validationError) {
      throw new Error(validationError);
    }

    const { campaignId } = requestData;

    // Check rate limiting for campaign processing
    const rateLimitCheck = await supabaseClient.rpc('check_rate_limit', {
      p_user_id: user.id,
      p_action: 'process_campaign',
      p_max_requests: 3, // Уменьшаем до 3 кампаний в час
      p_window_minutes: 60
    });

    if (!rateLimitCheck.data) {
      throw new Error('Rate limit exceeded. Максимум 3 кампании в час для безопасности.');
    }

    // Verify user owns the campaign and get campaign details
    const { data: campaign, error: campaignError } = await supabaseClient
      .from('campaigns')
      .select(`
        *,
        message_templates!inner(*)
      `)
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      throw new Error('Campaign not found or access denied');
    }

    // Check if campaign is in valid state for processing
    if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
      throw new Error('Campaign cannot be processed in current state');
    }

    // Get user's active contacts
    const { data: contacts, error: contactsError } = await supabaseClient
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (contactsError || !contacts || contacts.length === 0) {
      throw new Error('No active contacts found');
    }

    // Get user's active Telegram accounts
    const { data: telegramAccounts, error: accountsError } = await supabaseClient
      .from('telegram_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('last_activity', { ascending: true });

    if (accountsError || !telegramAccounts || telegramAccounts.length === 0) {
      throw new Error('No active Telegram accounts found');
    }

    console.log(`🚀 Запуск кампании: ${contacts.length} контактов, ${telegramAccounts.length} аккаунтов`);

    // Update campaign status to running
    await supabaseClient
      .from('campaigns')
      .update({
        status: 'running',
        started_at: new Date().toISOString(),
        total_recipients: contacts.length
      })
      .eq('id', campaignId)
      .eq('user_id', user.id);

    // Интеллектуальное распределение с учетом лимитов
    const { distribution, accountLimits } = distributeContactsIntelligently(contacts, telegramAccounts);
    
    // Логируем план распределения
    let totalPlanned = 0;
    telegramAccounts.forEach(account => {
      const contactCount = distribution[account.id]?.length || 0;
      const limit = accountLimits[account.id];
      totalPlanned += Math.min(contactCount, limit);
      console.log(`📋 План для ${account.name}: ${contactCount} контактов (лимит: ${limit})`);
    });
    
    console.log(`📊 Всего запланировано к отправке: ${totalPlanned} из ${contacts.length} контактов`);

    // Create message log entries for tracking
    const messageLogEntries = contacts.slice(0, totalPlanned).map((contact, index) => {
      // Find which account will handle this contact
      const assignedAccount = telegramAccounts.find(account => 
        distribution[account.id]?.includes(contact)
      );
      
      return {
        campaign_id: campaignId,
        telegram_account_id: assignedAccount?.id || telegramAccounts[0].id,
        contact_id: contact.id,
        status: 'pending'
      };
    });

    await supabaseClient
      .from('message_logs')
      .insert(messageLogEntries);

    // Отправляем сообщения с имитацией человеческого поведения
    const { totalSent, totalDelivered, totalFailed } = await sendMessagesWithHumanBehavior(
      supabaseClient,
      authHeader,
      campaignId,
      campaign.message_templates.content,
      distribution,
      telegramAccounts,
      accountLimits
    );

    // Update account activity timestamps
    const updatePromises = telegramAccounts.map(account => 
      supabaseClient
        .from('telegram_accounts')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', account.id)
    );
    await Promise.all(updatePromises);

    // Update final campaign statistics
    await supabaseClient
      .from('campaigns')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        sent_count: totalSent,
        delivered_count: totalDelivered,
        failed_count: totalFailed
      })
      .eq('id', campaignId)
      .eq('user_id', user.id);

    // Log audit event
    await logAuditEvent(supabaseClient, user.id, 'campaign_processed', {
      campaign_id: campaignId,
      total_recipients: contacts.length,
      planned_to_send: totalPlanned,
      sent_count: totalSent,
      delivered_count: totalDelivered,
      failed_count: totalFailed,
      accounts_used: telegramAccounts.length,
      distribution: Object.fromEntries(
        telegramAccounts.map(acc => [
          acc.name, 
          `${distribution[acc.id]?.length || 0}/${accountLimits[acc.id]}`
        ])
      )
    });

    console.log(`🎉 Кампания завершена: ${totalDelivered}/${totalPlanned} доставлено, ${totalFailed} ошибок`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        stats: { 
          totalPlanned,
          totalSent, 
          totalDelivered, 
          totalFailed,
          accountsUsed: telegramAccounts.length,
          distribution: Object.fromEntries(
            telegramAccounts.map(acc => [
              acc.name, 
              {
                assigned: distribution[acc.id]?.length || 0,
                limit: accountLimits[acc.id],
                sent: Math.min(distribution[acc.id]?.length || 0, accountLimits[acc.id])
              }
            ])
          )
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in process-campaign:', error);
    
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing the campaign' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
