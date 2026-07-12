/**
 * server/middleware/validate.js
 * Request body validation middleware factory.
 * Usage:
 *   import { validate, body } from '../middleware/validate.js';
 *   router.post('/register', validate([body('email').isEmail(), body('password').min(6)]), handler);
 *
 * This is a lightweight implementation using simple rules.
 * For more complex validation, consider using express-validator or zod.
 */

// ─── Rule Builders ────────────────────────────────────────────────────────────

/**
 * Chain builder for validating a single body field.
 */
function body(field) {
  const checks = [];

  const chain = {
    _field: field,
    _checks: checks,

    /** Field is required (non-empty string after trim) */
    required() {
      checks.push((val) =>
        val === undefined || val === null || String(val).trim() === ''
          ? `${field} is required.`
          : null
      );
      return chain;
    },

    /** Must be a string with minimum length */
    minLength(min) {
      checks.push((val) =>
        typeof val === 'string' && val.trim().length >= min
          ? null
          : `${field} must be at least ${min} characters.`
      );
      return chain;
    },

    /** Must be a string with maximum length */
    maxLength(max) {
      checks.push((val) =>
        typeof val === 'string' && val.trim().length <= max
          ? null
          : `${field} cannot exceed ${max} characters.`
      );
      return chain;
    },

    /** Must be a valid email format */
    isEmail() {
      checks.push((val) =>
        typeof val === 'string' && /^\S+@\S+\.\S+$/.test(val.trim())
          ? null
          : `${field} must be a valid email address.`
      );
      return chain;
    },

    /** Must be one of a set of values */
    isIn(values) {
      checks.push((val) =>
        values.includes(val)
          ? null
          : `${field} must be one of: ${values.join(', ')}.`
      );
      return chain;
    },

    /** Must be a string */
    isString() {
      checks.push((val) =>
        typeof val === 'string'
          ? null
          : `${field} must be a string.`
      );
      return chain;
    },
  };

  return chain;
}

// ─── Middleware Factory ────────────────────────────────────────────────────────

/**
 * Creates a validation middleware from an array of field chains.
 * Collects all errors and returns 400 if any exist.
 *
 * @param {Array} chains - Array of chain objects from body()
 */
function validate(chains) {
  return (req, res, next) => {
    const errors = [];

    for (const chain of chains) {
      const val = req.body[chain._field];
      for (const check of chain._checks) {
        const err = check(val);
        if (err) {
          errors.push(err);
          break; // Stop checking this field after first error
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: errors.join(' '),
        details: errors,
      });
    }

    next();
  };
}

export { validate, body };
