export const validateField = (name, maxLen = 60) => {
    const errors = [];
    if (!/^\p{L}/u.test(name)) {
      errors.push(" يجب أن يبدأ الحقل بحرف");
    }
    if (name.length > maxLen) {
      errors.push(`يجب ألا يتجاوز الحقل ${maxLen} حرفًا`);
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  };