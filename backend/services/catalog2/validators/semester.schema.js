const validateSemester = (data) => {
  const { name, start_date, end_date } = data;
  const errors = [];

  // Validimi i name
  if (!name || name.trim() === '') {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
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
  if (start_date && end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    
    if (end <= start) {
      errors.push('End date must be after start date');
    }
  }

  return {
    error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null
  };
};

const validateSemesterUpdate = (data) => {
  const { name, start_date, end_date } = data;
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

  // Validimi i start_date (optional në update)
  if (start_date !== undefined && isNaN(new Date(start_date).getTime())) {
    errors.push('Start date must be a valid date');
  }

  // Validimi i end_date (optional në update)
  if (end_date !== undefined && isNaN(new Date(end_date).getTime())) {
    errors.push('End date must be a valid date');
  }

  // Validimi i dates comparison
  if (start_date && end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    
    if (end <= start) {
      errors.push('End date must be after start date');
    }
  }

  return {
    error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null
  };
};

module.exports = {
  validateSemester,
  validateSemesterUpdate
};