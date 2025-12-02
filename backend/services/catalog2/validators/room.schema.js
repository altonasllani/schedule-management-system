const validateRoom = (data) => {
  const { name, capacity } = data; // ✅ VETËM 'name' dhe 'capacity' ekzistojnë
  const errors = [];

  // Validimi i name
  if (!name || name.trim() === '') {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (name.length > 100) {
    errors.push('Name cannot exceed 100 characters');
  }

  // Validimi i capacity
  if (!capacity) {
    errors.push('Capacity is required');
  } else if (isNaN(capacity) || capacity < 1 || capacity > 1000) {
    errors.push('Capacity must be a number between 1 and 1000');
  }

  return {
    error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null
  };
};

const validateRoomUpdate = (data) => {
  const { name, capacity } = data; // ✅ VETËM 'name' dhe 'capacity' ekzistojnë
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

  // Validimi i capacity (optional në update)
  if (capacity !== undefined && (isNaN(capacity) || capacity < 1 || capacity > 1000)) {
    errors.push('Capacity must be a number between 1 and 1000');
  }

  return {
    error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null
  };
};

module.exports = {
  validateRoom,
  validateRoomUpdate
};