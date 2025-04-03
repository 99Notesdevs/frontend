import { env } from '@/config/env';

interface ValidationError {
  field: string;
  message: string;
}

interface TemplateContentSchema {
  type: string;
  required?: string[];
  properties: Record<string, any>;
}

interface TemplateMetadataSchema {
  type: string;
  required?: string[];
  properties: Record<string, any>;
}

interface TemplateRequirement {
  content: TemplateContentSchema;
  metadata: TemplateMetadataSchema;
}

export class ValidationService {
  static async validatePageData(data: any, templateId: string): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    // Fetch template
    const res = await fetch(`${env.API}/template/${templateId}`);
    const response = await res.json();
    const template = response.data;

    if (!template) {
      errors.push({ field: 'templateId', message: 'Template not found' });
      return errors;
    }

    // Parse content if it's a string (JSON)
    let contentObj = data.content;
    if (typeof data.content === 'string') {
      try {
        contentObj = JSON.parse(data.content);
      } catch (e) {
        errors.push({ field: 'content', message: 'Invalid JSON content format' });
        return errors;
      }
    }

    // Parse metadata if it's a string (JSON)
    let metadataObj = data.metadata;
    if (typeof data.metadata === 'string') {
      try {
        metadataObj = JSON.parse(data.metadata);
      } catch (e) {
        errors.push({ field: 'metadata', message: 'Invalid JSON metadata format' });
        return errors;
      }
    }

    // Get template requirements using template ID
    const requirements = templateRequirements[template.id];
    if (!requirements) {
      errors.push({ field: 'templateId', message: `Invalid template type: ${template.id}` });
      return errors;
    }

    // Validate content
    if (requirements.content.required) {
      for (const field of requirements.content.required) {
        if (!contentObj?.[field]) {
          errors.push({
            field: `content.${field}`,
            message: `${field} is required`
          });
        } else if (requirements.content.properties[field].minLength && 
                  contentObj[field].length < requirements.content.properties[field].minLength) {
          errors.push({
            field: `content.${field}`,
            message: `${field} must be at least ${requirements.content.properties[field].minLength} characters`
          });
        }
      }
    }

    // Validate metadata
    if (requirements.metadata.required) {
      for (const field of requirements.metadata.required) {
        if (!metadataObj?.[field]) {
          errors.push({
            field: `metadata.${field}`,
            message: `${field} is required in metadata`
          });
        }
      }
    }

    return errors;
  }
}

// Template requirements based on our templates
const templateRequirements: Record<string, TemplateRequirement> = {
  'current-affairs': {
    content: {
      type: 'object',
      required: ['title', 'content'],
      properties: {
        title: { type: 'string', minLength: 2 },
        content: { type: 'string', minLength: 10 }
      }
    },
    metadata: {
      type: 'object',
      required: ['lastUpdated'],
      properties: {
        lastUpdated: { type: 'string' }
      }
    }
  },
  'article': {
    content: {
      type: 'object',
      required: ['title', 'content'],
      properties: {
        title: { type: 'string', minLength: 2 },
        content: { type: 'string', minLength: 10 },
        image: { type: 'string' }
      }
    },
    metadata: {
      type: 'object',
      required: ['lastUpdated'],
      properties: {
        lastUpdated: { type: 'string' }
      }
    }
  },
  'general-studies': {
    content: {
      type: 'object',
      required: ['title', 'content'],
      properties: {
        title: { type: 'string', minLength: 2 },
        content: { type: 'string', minLength: 10 },
        image: { type: 'string' }
      }
    },
    metadata: {
      type: 'object',
      required: ['lastUpdated'],
      properties: {
        lastUpdated: { type: 'string' }
      }
    }
  },
  'upsc-notes': {
    content: {
      type: 'object',
      required: ['title', 'content'],
      properties: {
        title: { type: 'string', minLength: 2 },
        content: { type: 'string', minLength: 10 }
      }
    },
    metadata: {
      type: 'object',
      required: ['lastUpdated'],
      properties: {
        lastUpdated: { type: 'string' }
      }
    }
  },
  'study-material': {
    content: {
      type: 'object',
      required: ['title', 'subject', 'content'],
      properties: {
        title: { type: 'string', minLength: 2 },
        subject: { type: 'string', minLength: 2 },
        content: { type: 'string', minLength: 10 }
      }
    },
    metadata: {
      type: 'object',
      required: ['lastUpdated'],
      properties: {
        lastUpdated: { type: 'string' }
      }
    }
  },
  'about': {
    content: {
      type: 'object',
      required: ['hero', 'mission'],
      properties: {
        hero: {
          type: 'object',
          required: ['title', 'subtitle'],
          properties: {
            title: { type: 'string', minLength: 2 },
            subtitle: { type: 'string', minLength: 2 }
          }
        },
        mission: { type: 'string', minLength: 10 },
        veterans: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'role'],
            properties: {
              name: { type: 'string' },
              role: { type: 'string' },
              bio: { type: 'string' }
            }
          }
        },
        coreMembers: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'role'],
            properties: {
              name: { type: 'string' },
              role: { type: 'string' },
              bio: { type: 'string' }
            }
          }
        }
      }
    },
    metadata: {
      type: 'object',
      required: ['lastUpdated'],
      properties: {
        lastUpdated: { type: 'string' },
        teamSize: { type: 'number' }
      }
    }
  }
};
