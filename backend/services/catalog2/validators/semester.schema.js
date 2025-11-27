const validateSemester = (data) => {
    const { name, start_date, end_date, is_active } = data;
    const errors = [];
  
    // Validimi i name
    if (!name || name.trim() === '') {
      errors.push('Name is required');
    } else if (name.length > 100) {
      errors.push('Name cannot exceed 100 characters');
    }
  
    // Validimi i start_date
    if (!start_date) {
      errors.push('Start date is required');
    } else if (isNaN(new Date(start_date).getTime())) {
      errors.push('Start date must be a valid date');
    }
  
    // Validimi i end_date
    if (!end_date) {
      errors.push('End date is required');
    } else if (isNaN(new Date(end_date).getTime())) {
      errors.push('End date must be a valid date');
    }
  
    // Validimi i dates comparison
    if (start_date && end_date && new Date(end_date) <= new Date(start_date)) {
      errors.push('End date must be after start date');
    }
  
    // Validimi i is_active
    if (is_active !== undefined && typeof is_active !== 'boolean') {
      errors.push('is_active must be a boolean value');
    }
  
    return {
      error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null
    };
  };
  
  const validateSemesterUpdate = (data) => {
    const { name, start_date, end_date, is_active } = data;
    const errors = [];
  
    // Validimi i name (optional në update)
    if (name !== undefined) {
      if (name.trim() === '') {
        errors.push('Name cannot be empty');
      } else if (name.length > 100) {
        errors.push('Name cannot exceed 100 characters');
      }
    }
  
    // Validimi i start_date (optional në update)
    if (start_date !== undefined && isNaN(new Date(start_date).getTime())) {
      errors.push('Start date must be a valid date');
    }
  
    // Validimi i end_date (optional në update)
    if (end_date !== undefined && isNaN(new Date(end_date).getTime())) {
      errors.push('End date must be a valid date');
    }
  
    // Validimi i dates comparison
    if (start_date && end_date && new Date(end_date) <= new Date(start_date)) {
      errors.push('End date must be after start date');
    }
  
    // Validimi i is_active
    if (is_active !== undefined && typeof is_active !== 'boolean') {
      errors.push('is_active must be a boolean value');
    }
  
    return {
      error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null
    };
  };
  
  module.exports = {
    validateSemester,
    validateSemesterUpdate
  };