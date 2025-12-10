// Global setup për të gjitha testet

// Mock database connections for catalog2 - KJO EKZISTON
jest.mock('./services/catalog2/models/index.js', () => {
  const mockPool = {
    connect: jest.fn(() => Promise.resolve({
      query: jest.fn(() => Promise.resolve({ rows: [] })),
      release: jest.fn()
    })),
    end: jest.fn(),
    on: jest.fn()
  };

  return {
    pool: mockPool,
    testConnection: jest.fn(() => Promise.resolve(true)),
    query: jest.fn(() => Promise.resolve({ rows: [] }))
  };
});

// NUK MOCK-O catalog1/models/index.js nëse nuk ekziston
// jest.mock('./services/catalog1/models/index.js', () => ({ ... }));

// Mock shared/db për schedule service - KËTU MUND TË KETË PROBLEM
jest.mock('./shared/db', () => {
  const mockPool = {
    connect: jest.fn(() => Promise.resolve({
      query: jest.fn(() => Promise.resolve({ rows: [] })),
      release: jest.fn()
    })),
    end: jest.fn(),
    on: jest.fn()
  };

  return {
    pool: mockPool,
    query: jest.fn(() => Promise.resolve({ rows: [] }))
  };
});

// Supress vetëm database logs
const originalLog = console.log;
console.log = (...args) => {
  if (typeof args[0] === 'string') {
    // Mos shfaq log-et që fillojnë me ��� ose përmbajnë "Database"
    if (args[0].startsWith('���') || args[0].includes('Database')) {
      return;
    }
  }
  originalLog(...args);
};

// Global cleanup
afterAll(() => {
  // Rivendos console
  console.log = originalLog;
  
  // Clear all mocks
  jest.clearAllMocks();
});

// Timeout
jest.setTimeout(10000);
