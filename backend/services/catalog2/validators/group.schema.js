const validateGroup = (data) => {
    const { name, description, semester_id } = data;
    const errors = [];
  
    // Validimi i name
    if (!name || name.trim() === '') {
      errors.push('Name is required');
    } else if (name.length > 100) {
      errors.push('Name cannot exceed 100 characters');
    }
  
    // Validimi i description
    if (description && description.length > 500) {
      errors.push('Description cannot exceed 500 characters');
    }
  
    // Validimi i semester_id
    if (!semester_id) {
      errors.push('Semester ID is required');
    } else if (isNaN(semester_id) || semester_id <= 0) {
      errors.push('Semester ID must be a positive number');
    }
  
    return {
      error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null
    };
  };
  
  const validateGroupUpdate = (data) => {
    const { name, description, semester_id } = data;
    const errors = [];
  
    // Validimi i name (optional në update)
    if (name !== undefined) {
      if (name.trim() === '') {
        errors.push('Name cannot be empty');
      } else if (name.length > 100) {
        errors.push('Name cannot exceed 100 characters');
      }
    }
  
    // Validimi i description
    if (description && description.length > 500) {
      errors.push('Description cannot exceed 500 characters');
    }
  
    // Validimi i semester_id (optional në update)
    if (semester_id !== undefined && (isNaN(semester_id) || semester_id <= 0)) {
      errors.push('Semester ID must be a positive number');
    }
  
    return {
      error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null
    };
  };
  
  module.exports = {
    validateGroup,
    validateGroupUpdate
  };