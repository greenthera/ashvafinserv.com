const FORMS = {
  sipSwp: {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLScoWsNhHsVdF9ZqmJ3O_vdmjnliPduC5N4bpeOBTet8mv1DZA/formResponse',
    entryIds: {
      clientName: 'entry.2126094627',
      clientPhone: 'entry.1461444504',
      clientEmail: 'entry.864366134',
    },
  },
  amortization: {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSdnnJIozKWjbohv-t0JcMcgR3edT9YulqQ7pTdJk6Spb3hU6A/formResponse',
    entryIds: {
      clientName: 'entry.1290345776',
      clientPhone: 'entry.53753952',
      clientEmail: 'entry.558781933',
    },
  },
};

/**
 * Silently logs the "Your details" fields as a Google Forms response, so a
 * lead is captured as soon as valid details are entered — no submit button,
 * no visible form. Google Forms doesn't allow reading the response
 * cross-origin, so this is fire-and-forget (mode: 'no-cors').
 */
function submitLeadToGoogleForm(formKey, { clientName, clientPhone, clientEmail }) {
  const { action, entryIds } = FORMS[formKey];
  const body = new URLSearchParams({
    [entryIds.clientName]: clientName,
    [entryIds.clientPhone]: clientPhone,
    [entryIds.clientEmail]: clientEmail,
  });

  return fetch(action, { method: 'POST', mode: 'no-cors', body }).catch(() => {});
}

export const submitSipSwpLead = (details) => submitLeadToGoogleForm('sipSwp', details);
export const submitAmortizationLead = (details) => submitLeadToGoogleForm('amortization', details);
