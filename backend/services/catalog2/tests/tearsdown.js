// Cleanup pas testimeve

// Rivendos console.log
if (global.originalConsoleLog) {
    console.log = global.originalConsoleLog;
  }
  
  // Mbyll të gjitha lidhjet mock
  jest.clearAllMocks();