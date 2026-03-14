/**
 * Utility to submit a hidden form to the Kina Bank IPG gateway.
 * Kina Bank requires a form POST with HMAC-signed fields.
 */
export function submitKinaPaymentForm(gatewayUrl: string, fields: Record<string, string>) {
  // Create a form element
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = gatewayUrl;

  // Append hidden inputs for all fields
  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  // Append form to body and submit
  document.body.appendChild(form);
  form.submit();
  
  // Cleanup (though navigation will occur)
  document.body.removeChild(form);
}
