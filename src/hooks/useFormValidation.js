// src/hooks/useFormValidation.js
import ***REMOVED*** useState, useCallback ***REMOVED*** from 'react';

export const useFormValidation = (validationRules = ***REMOVED******REMOVED***) => ***REMOVED***
  const [errors, setErrors] = useState(***REMOVED******REMOVED***);
  const [touched, setTouched] = useState(***REMOVED******REMOVED***);

  const validateField = useCallback((fieldName, value) => ***REMOVED***
    const rules = validationRules[fieldName];
    if (!rules) return '';

    for (const rule of rules) ***REMOVED***
      const error = rule(value);
      if (error) return error;
    ***REMOVED***

    return '';
  ***REMOVED***, [validationRules]);

  const validateForm = useCallback((values) => ***REMOVED***
    const newErrors = ***REMOVED******REMOVED***;
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => ***REMOVED***
      const error = validateField(fieldName, values[fieldName]);
      if (error) ***REMOVED***
        newErrors[fieldName] = error;
        isValid = false;
      ***REMOVED***
    ***REMOVED***);

    setErrors(newErrors);
    return isValid;
  ***REMOVED***, [validateField, validationRules]);

  const handleFieldChange = useCallback((fieldName, value) => ***REMOVED***
    setTouched(prev => (***REMOVED*** ...prev, [fieldName]: true ***REMOVED***));
    
    const error = validateField(fieldName, value);
    setErrors(prev => (***REMOVED***
      ...prev,
      [fieldName]: error
    ***REMOVED***));
  ***REMOVED***, [validateField]);

  const resetValidation = useCallback(() => ***REMOVED***
    setErrors(***REMOVED******REMOVED***);
    setTouched(***REMOVED******REMOVED***);
  ***REMOVED***, []);

  return ***REMOVED***
    errors,
    touched,
    validateForm,
    handleFieldChange,
    resetValidation,
    hasErrors: Object.keys(errors).some(key => errors[key])
  ***REMOVED***;
***REMOVED***;
