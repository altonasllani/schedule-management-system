const validateRoom = (data) => {
    const { name, capacity, location, equipment } = data;
    const errors = [];
  
    // Validimi i name
    if (!name || name.trim() === '') {
      errors.push('Name is required');
    } else if (name.length > 100) {
      errors.push('Name cannot exceed 100 characters');
    }
  
    // Validimi i capacity
    if (!capacity) {
      errors.push('Capacity is required');
    } else if (isNaN(capacity) || capacity < 1 || capacity > 1000) {
      errors.push('Capacity must be a number between 1 and 1000');
    }
  
    // Validimi i location
    if (!location || location.trim() === '') {
      errors.push('Location is required');
    } else if (location.length > 200) {
      errors.push('Location cannot exceed 200 characters');
    }
  
    // Validimi i equipment
    if (equipment && equipment.length > 500) {
      errors.push('Equipment description cannot exceed 500 characters');
    }
  
    return {
      error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null
    };
  };
  
  const validateRoomUpdate = (data) => {
    const { name, capacity, location, equipment } = data;
    const errors = [];
  
    // Validimi i name (optional në update)
    if (name !== undefined) {
      if (name.trim() === '') {
        errors.push('Name cannot be empty');
      } else if (name.length > 100) {
        errors.push('Name cannot exceed 100 characters');
      }
    }
  
    // Validimi i capacity (optional në update)
    if (capacity !== undefined && (isNaN(capacity) || capacity < 1 || capacity > 1000)) {
      errors.push('Capacity must be a number between 1 and 1000');
    }
  
    // Validimi i location (optional në update)
    if (location !== undefined) {
      if (location.trim() === '') {
        errors.push('Location cannot be empty');
      } else if (location.length > 200) {
        errors.push('Location cannot exceed 200 characters');
      }
    }
  
    // Validimi i equipment
    if (equipment && equipment.length > 500) {
      errors.push('Equipment description cannot exceed 500 characters');
    }
  
    return {
      error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null
    };
  };
  
  module.exports = {
    validateRoom,
    validateRoomUpdate
  };