const validateGroup = (data) => {
  const { name } = data; // ✅ VETËM 'name' ekziston
  const errors = [];

  // Validimi i name
  if (!name || name.trim() === '') {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (name.length > 100) {
    errors.push('Name cannot exceed 100 characters');
  }

  return {
    error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null
  };
};

const validateGroupUpdate = (data) => {
  const { name } = data; // ✅ VETËM 'name' ekziston
  const errors = [];

  // Validimi i name (optional në update)
  if (name !== undefined) {
    if (name.trim() === '') {
      errors.push('Name cannot be empty');
    } else if (name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    } else if (name.length > 100) {
      errors.push('Name cannot exceed 100 characters');
    }
  }

  return {
    error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null
  };
};

module.exports = {
  validateGroup,
  validateGroupUpdate
};