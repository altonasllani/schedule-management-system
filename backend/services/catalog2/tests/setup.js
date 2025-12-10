// Setup për të gjitha testet e catalog2
jest.mock('../models/index.js', () => ({
  pool: {
    connect: jest.fn(() => Promise.resolve({
      query: jest.fn(() => Promise.resolve({ rows: [] })),
      release: jest.fn()
    })),
    end: jest.fn()
  },
  testConnection: jest.fn().mockResolvedValue(true)
}));

// Supress vetëm database logs
const originalLog = console.log;
console.log = jest.fn((...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Database test')) {
    return;
  }
  originalLog(...args);
});
