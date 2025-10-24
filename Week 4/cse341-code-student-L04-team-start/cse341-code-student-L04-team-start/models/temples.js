module.exports = (mongoose) => {
  const templeSchema = mongoose.Schema(
    {
      temple_id: {
        type: Number,
        required: [true, 'Temple ID is required'],
        unique: true,
        min: [1, 'Temple ID must be a positive number'],
        validate: {
          validator: function(v) {
            return Number.isInteger(v) && v > 0;
          },
          message: 'Temple ID must be a positive integer'
        }
      },
      name: {
        type: String,
        required: [true, 'Temple name is required'],
        trim: true,
        minlength: [2, 'Temple name must be at least 2 characters long'],
        maxlength: [100, 'Temple name cannot exceed 100 characters'],
        validate: {
          validator: function(v) {
            // Allow letters, spaces, hyphens, and apostrophes
            return /^[a-zA-Z\s\-']+$/.test(v);
          },
          message: 'Temple name can only contain letters, spaces, hyphens, and apostrophes'
        }
      },
      location: {
        type: String,
        required: [true, 'Temple location is required'],
        trim: true,
        minlength: [2, 'Location must be at least 2 characters long'],
        maxlength: [200, 'Location cannot exceed 200 characters'],
        validate: {
          validator: function(v) {
            // Allow letters, numbers, spaces, commas, periods, hyphens
            return /^[a-zA-Z0-9\s,.\-']+$/.test(v);
          },
          message: 'Location contains invalid characters'
        }
      },
      dedicated: {
        type: String,
        required: [true, 'Dedication date is required'],
        validate: {
          validator: function(v) {
            // Validate date format (YYYY-MM-DD or MM/DD/YYYY or Month DD, YYYY)
            const dateFormats = [
              /^\d{4}-\d{2}-\d{2}$/,                    // YYYY-MM-DD
              /^\d{2}\/\d{2}\/\d{4}$/,                  // MM/DD/YYYY
              /^[A-Za-z]+\s\d{1,2},\s\d{4}$/           // Month DD, YYYY
            ];
            return dateFormats.some(format => format.test(v)) || !isNaN(Date.parse(v));
          },
          message: 'Please provide a valid date format'
        }
      },
      additionalInfo: {
        type: Boolean,
        default: false
      }
    },
    { 
      timestamps: true,
      // Add toJSON transform to clean up the response
      toJSON: {
        transform: function(doc, ret) {
          delete ret.__v;
          return ret;
        }
      }
    }
  );

  // Index for better performance
  templeSchema.index({ temple_id: 1 });
  templeSchema.index({ name: 1 });

  const Temple = mongoose.model('temples', templeSchema);
  return Temple;
};
