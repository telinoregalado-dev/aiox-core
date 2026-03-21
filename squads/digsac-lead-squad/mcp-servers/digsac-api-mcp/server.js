#!/usr/bin/env node

/**
 * DIGSAC API MCP Server
 *
 * Integrates with DIGSAC backend to store leads,
 * update status, log interactions.
 *
 * Tools:
 * - create_lead_record: Create new lead record in DIGSAC
 * - update_lead_status: Update lead's status and metadata
 * - log_interaction: Log interaction (webhook, email, meeting, etc)
 * - get_lead_info: Retrieve lead info from DIGSAC
 *
 * Phase 1 Status: STUB (ready for implementation)
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'digsac-api-mcp',
  version: '1.0.0'
});

// Tool schemas
const LeadRecordSchema = z.object({
  lead_id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  campaign_id: z.string(),
  campaign_name: z.string(),
  source: z.enum(['instagram', 'facebook', 'manual']),
  qualification_score: z.number().min(0).max(100).optional(),
  status: z.enum(['received', 'validated', 'qualified', 'scheduled', 'confirmed', 'rejected']),
  notes: z.string().optional()
});

// Tool 1: Create Lead Record
server.registerTool(
  'create_lead_record',
  {
    description: 'Create a new lead record in DIGSAC database',
    inputSchema: z.object({
      lead_data: LeadRecordSchema,
      auto_index: z.boolean().optional().default(true)
    }),
    annotations: {
      title: 'Create Lead Record in DIGSAC',
      readOnlyHint: false,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const { lead_data, auto_index } = params;

      // Phase 1: Mock record creation
      // Phase 2: Implement real DIGSAC API call
      const record = {
        digsac_id: `digsac_${Date.now()}`,
        ...lead_data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        indexed: auto_index
      };

      console.log(`[digsac-api-mcp] Lead record created: ${record.digsac_id}`);

      return {
        success: true,
        digsac_id: record.digsac_id,
        lead_id: lead_data.lead_id,
        name: lead_data.name,
        status: 'created',
        created_at: record.created_at,
        message: 'Lead record created in DIGSAC successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to create lead record'
      };
    }
  }
);

// Tool 2: Update Lead Status
server.registerTool(
  'update_lead_status',
  {
    description: 'Update lead status and metadata in DIGSAC',
    inputSchema: z.object({
      lead_id: z.string(),
      status: z.enum(['received', 'validated', 'qualified', 'scheduled', 'confirmed', 'rejected']),
      qualification_score: z.number().min(0).max(100).optional(),
      meeting_id: z.string().optional(),
      notes: z.string().optional()
    }),
    annotations: {
      title: 'Update Lead Status',
      readOnlyHint: false,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const { lead_id, status, qualification_score, meeting_id, notes } = params;

      // Phase 1: Mock update
      // Phase 2: Implement real DIGSAC API update call
      const update = {
        lead_id: lead_id,
        status: status,
        qualification_score: qualification_score,
        meeting_id: meeting_id,
        notes: notes,
        updated_at: new Date().toISOString()
      };

      console.log(`[digsac-api-mcp] Lead status updated: ${lead_id} → ${status}`);

      return {
        success: true,
        lead_id: lead_id,
        status: status,
        updated_at: update.updated_at,
        message: `Lead status updated to ${status} in DIGSAC`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
);

// Tool 3: Log Interaction
server.registerTool(
  'log_interaction',
  {
    description: 'Log an interaction (webhook, email, meeting, etc) for audit trail',
    inputSchema: z.object({
      lead_id: z.string(),
      interaction_type: z.enum([
        'webhook_received',
        'data_validated',
        'lead_qualified',
        'meeting_scheduled',
        'email_sent',
        'reminder_sent',
        'confirmation_received',
        'escalated',
        'rejected'
      ]),
      details: z.string(),
      agent: z.string().optional(),
      timestamp: z.string().datetime().optional()
    }),
    annotations: {
      title: 'Log Lead Interaction',
      readOnlyHint: false,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const { lead_id, interaction_type, details, agent, timestamp } = params;

      // Phase 1: Mock logging
      // Phase 2: Implement real DIGSAC audit logging
      const log = {
        log_id: `log_${Date.now()}`,
        lead_id: lead_id,
        interaction_type: interaction_type,
        details: details,
        agent: agent || 'system',
        timestamp: timestamp || new Date().toISOString()
      };

      console.log(`[digsac-api-mcp] Interaction logged: ${log.log_id}`);

      return {
        success: true,
        log_id: log.log_id,
        lead_id: lead_id,
        interaction_type: interaction_type,
        logged_at: log.timestamp,
        message: 'Interaction logged successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
);

// Tool 4: Get Lead Info
server.registerTool(
  'get_lead_info',
  {
    description: 'Retrieve lead information and history from DIGSAC',
    inputSchema: z.object({
      lead_id: z.string(),
      include_history: z.boolean().optional().default(false),
      include_interactions: z.boolean().optional().default(false)
    }),
    annotations: {
      title: 'Get Lead Info from DIGSAC',
      readOnlyHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const { lead_id, include_history, include_interactions } = params;

      // Phase 1: Mock retrieval
      // Phase 2: Implement real DIGSAC query
      const lead = {
        lead_id: lead_id,
        digsac_id: `digsac_${lead_id}`,
        name: 'Mock Lead Name',
        email: 'mock@example.com',
        phone: '+55-11-99999-9999',
        campaign_id: 'campaign_123',
        source: 'instagram',
        status: 'scheduled',
        qualification_score: 85,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString()
      };

      if (include_history) {
        lead.history = [
          { timestamp: new Date(Date.now() - 86400000).toISOString(), event: 'created' },
          { timestamp: new Date(Date.now() - 43200000).toISOString(), event: 'validated' },
          { timestamp: new Date(Date.now() - 3600000).toISOString(), event: 'scheduled' }
        ];
      }

      if (include_interactions) {
        lead.interactions = [
          { type: 'webhook_received', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { type: 'email_sent', timestamp: new Date(Date.now() - 43200000).toISOString() },
          { type: 'reminder_sent', timestamp: new Date(Date.now() - 1800000).toISOString() }
        ];
      }

      return {
        success: true,
        lead: lead
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[digsac-api-mcp] Server started successfully');
