import https from 'https';

export default async function handler(req, res) {
  console.log('🔵 PAYMENT API ENDPOINT CALLED:', req.method, req.url);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      opaqueDataDescriptor,
      opaqueDataValue,
      amount,
      customerInfo,
      orderDetails
    } = req.body;

    console.log('🔍 Payment request received:', {
      amount,
      customer: customerInfo?.email,
      hasToken: !!opaqueDataValue
    });

    // Validate required fields
    if (!opaqueDataDescriptor || !opaqueDataValue || !amount || !customerInfo) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['opaqueDataDescriptor', 'opaqueDataValue', 'amount', 'customerInfo']
      });
    }

    // Authorize.Net API credentials from environment variables
    const apiLoginId = process.env.AUTHNET_API_LOGIN_ID;
    const transactionKey = process.env.AUTHNET_TRANSACTION_KEY;
    const environment = process.env.AUTHNET_ENVIRONMENT || 'production';
    
    console.log('🔍 Environment check:', {
      hasApiLoginId: !!apiLoginId,
      hasTransactionKey: !!transactionKey,
      environment
    });
    
    if (!apiLoginId || !transactionKey) {
      return res.status(500).json({
        error: 'Server configuration error: Missing Authorize.Net credentials'
      });
    }
    
    // Set API endpoint based on environment
    const apiEndpoint = environment === 'sandbox' 
      ? 'apitest.authorize.net' 
      : 'api.authorize.net';

    // Create transaction request
    const transactionRequest = {
      createTransactionRequest: {
        merchantAuthentication: {
          name: apiLoginId,
          transactionKey: transactionKey
        },
        transactionRequest: {
          transactionType: 'authCaptureTransaction',
          amount: parseFloat(amount).toFixed(2),
          payment: {
            opaqueData: {
              dataDescriptor: opaqueDataDescriptor,
              dataValue: opaqueDataValue
            }
          },
          billTo: {
            firstName: customerInfo.firstName || customerInfo.name?.split(' ')[0] || '',
            lastName: customerInfo.lastName || customerInfo.name?.split(' ').slice(1).join(' ') || '',
            company: 'Cuban Soul Order',
            address: customerInfo.address || '',
            city: customerInfo.city || '',
            state: customerInfo.state || 'TX',
            zip: customerInfo.zip || '',
            country: 'US',
            phoneNumber: customerInfo.phone || '',
            email: customerInfo.email || ''
          },
          order: {
            invoiceNumber: `CS-${Date.now()}`,
            description: `Cuban Soul Order - ${orderDetails?.packageType || 'Catering Package'}`
          },
          customerIP: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
          transactionSettings: {
            setting: [
              {
                settingName: 'emailCustomer',
                settingValue: 'true'
              }
            ]
          }
        }
      }
    };

    console.log('💳 Processing payment:', {
      amount: transactionRequest.createTransactionRequest.transactionRequest.amount,
      customer: customerInfo.email,
      environment: environment,
      endpoint: apiEndpoint
    });

    // Make request to Authorize.Net API
    const response = await makeAuthNetRequest(apiEndpoint, transactionRequest);

    if (response.messages.resultCode === 'Ok' && 
        response.transactionResponse &&
        response.transactionResponse.responseCode === '1') {
      
      // Transaction successful
      console.log('✅ Payment successful:', response.transactionResponse.transId);
      
      return res.status(200).json({
        success: true,
        transactionId: response.transactionResponse.transId,
        authCode: response.transactionResponse.authCode,
        amount: amount,
        message: 'Payment processed successfully',
        customerInfo: customerInfo
      });

    } else {
      // Transaction failed
      const errorMessage = response.transactionResponse?.errors?.[0]?.errorText ||
                          response.messages?.message?.[0]?.text ||
                          'Transaction failed';
      
      console.error('❌ Payment failed:', errorMessage);
      
      return res.status(400).json({
        success: false,
        error: errorMessage,
        code: response.transactionResponse?.errors?.[0]?.errorCode ||
              response.messages?.message?.[0]?.code
      });
    }

  } catch (error) {
    console.error('💥 Payment processing error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during payment processing',
      details: error.message
    });
  }
}

// Helper function to make HTTPS request to Authorize.Net
function makeAuthNetRequest(hostname, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: hostname,
      port: 443,
      path: '/xml/v1/request.api',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(responseData);
          resolve(jsonResponse);
        } catch (parseError) {
          reject(new Error(`Failed to parse response: ${parseError.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}