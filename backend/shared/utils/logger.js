// backend/shared/utils/logger.js

const levels = ['debug', 'info', 'warn', 'error'];

function format(level, message, meta) {
  const time = new Date().toISOString();
  const base = `[${time}] [${level.toUpperCase()}] ${message}`;

  if (!meta) return base;
  try {
    return `${base} | ${JSON.stringify(meta)}`;
  } catch {
    return base;
  }
}

const logger = {
  debug(message, meta) {
    if (process.env.NODE_ENV === 'production') return;
    console.debug(format('debug', message, meta));
  },

  info(message, meta) {
    console.info(format('info', message, meta));
  },

  warn(message, meta) {
    console.warn(format('warn', message, meta));
  },

  error(message, meta) {
    console.error(format('error', message, meta));
  },
};

module.exports = {
  logger,
  levels,
};
