export interface KinaError {
  title: string;
  message: string;
}

export const KINA_ERROR_MAP: Record<string, KinaError> = {
  '-1': { title: 'Missing Information', message: 'A mandatory request field is not filled in.' },
  '-2': { title: 'Validation Failed', message: 'The gateway request validation failed.' },
  '-3': { title: 'Bank Connection Issue', message: 'The bank host did not respond or sent an invalid format.' },
  '-4': { title: 'No Connection', message: 'There is no connection to the acquirer host.' },
  '-5': { title: 'Connection Interrupted', message: 'The bank connection failed during transaction processing.' },
  '-6': { title: 'Configuration Error', message: 'E-Gateway configuration error. Please contact support.' },
  '-7': { title: 'Invalid Response', message: 'The bank response is invalid or missing mandatory fields.' },
  '-8': { title: 'Card Number Error', message: 'There is an error in the card number provided.' },
  '-9': { title: 'Expiry Date Error', message: 'The card expiration date is invalid or has an error.' },
  '-10': { title: 'Amount Error', message: 'There is an error with the transaction amount.' },
  '-11': { title: 'Currency Error', message: 'The currency code in the request is invalid.' },
  '-12': { title: 'Merchant Error', message: 'Invalid Merchant ID configured.' },
  '-13': { title: 'Security Restriction', message: 'The source IP address is not authorized for this transaction.' },
  '-14': { title: 'Hardware Issue', message: 'No connection to the payment terminal hardware.' },
  '-15': { title: 'Reference Error', message: 'Error in the transaction reference (RRN) field.' },
  '-16': { title: 'Terminal Busy', message: 'Another transaction is currently being performed on the terminal.' },
  '-17': { title: 'Access Denied', message: 'The payment terminal is denied access to the gateway.' },
  '-18': { title: 'CVC Error', message: 'There is an error in the CVC2/CVV field.' },
  '-19': { title: 'Verification Failed', message: 'Card authentication failed. Please check your verification code or OTP.' },
  '-20': { title: 'Session Expired', message: 'The permitted time interval for the transaction has been exceeded.' },
  '-21': { title: 'Already Executed', message: 'This transaction has already been successfully executed.' },
  '-22': { title: 'Authentication Error', message: 'The transaction contains invalid authentication information.' },
  '-23': { title: 'Invalid Context', message: 'The transaction context is invalid.' },
  '-24': { title: 'Context Mismatch', message: 'Transaction context data mismatch.' },
  '-25': { title: 'Payment Canceled', message: 'The transaction was canceled by the user.' },
  '-26': { title: 'Invalid BIN', message: 'The card bin (category) used is invalid for this action.' },
  '-27': { title: 'Invalid Merchant', message: 'The merchant name configured is invalid.' },
  '-28': { title: 'Data Error', message: 'Invalid incoming addendum data.' },
  '-29': { title: 'Duplicate Reference', message: 'Invalid or duplicate authentication reference detected.' },
  '-30': { title: 'Fraud Block', message: 'Transaction was declined because of a security or fraud alert.' },
  '-31': { title: 'Processing', message: 'Another transaction is already in progress for this card.' },
  '-32': { title: 'Duplicate Declined', message: 'A duplicate declined transaction was detected.' },
  '-33': { title: 'Verification Pending', message: 'Client authentication or one-time code verification is in progress.' },
  '-34': { title: 'Choice in Progress', message: 'MasterCard Installment client choice is in progress.' },
  '-35': { title: 'Auto Canceled', message: 'MasterCard Installments were automatically canceled.' },
  '-96': { title: 'Required Data Missing', message: 'Mandatory transaction fields are missing.' },
  '-97': { title: 'Session Timeout', message: 'Your session has timed out or you are not logged in.' },
  '-98': { title: 'Too Many Attempts', message: 'You have exceeded the limit for OTP attempts.' },
  '-99': { title: 'Page Refreshed', message: 'The transaction was aborted because the browser page was refreshed.' },
};

export const getKinaError = (rc: string | null): KinaError => {
  if (!rc) return { title: 'Payment Failed', message: 'An unknown error occurred during processing.' };
  return KINA_ERROR_MAP[rc] || { title: 'Transaction Error', message: `The bank returned error code: ${rc}. No funds were captured.` };
};
