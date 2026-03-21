#!/usr/bin/env node

/**
 * DIGSAC Zoom Scheduler MCP Server
 *
 * Integrates with Zoom API to schedule meetings,
 * create registration links, and manage zoom calendar.
 *
 * Tools:
 * - create_meeting: Create new Zoom meeting
 * - get_meeting_link: Retrieve meeting link and details
 * - add_registrant: Add lead as meeting registrant
 * - update_meeting: Update meeting details (time, title, etc)
 *
 * Phase 1 Status: STUB (ready for implementation)
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'digsac-zoom-scheduler-mcp',
  version: '1.0.0'
});

// Tool schemas
const MeetingDetailsSchema = z.object({
  lead_id: z.string(),
  lead_name: z.string(),
  lead_email: z.string().email(),
  duration_minutes: z.number().min(15).max(480).default(30),
  scheduled_date: z.string().date(),
  scheduled_time: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string().default('America/Sao_Paulo'),
  title: z.string().optional(),
  description: z.string().optional(),
  meeting_type: z.enum(['sales', 'demo', 'consultation']).default('sales')
});

// Tool 1: Create Meeting
server.registerTool(
  'create_meeting',
  {
    description: 'Create a new Zoom meeting for a qualified lead',
    inputSchema: z.object({
      meeting_details: MeetingDetailsSchema,
      enable_recording: z.boolean().optional().default(false),
      auto_start: z.boolean().optional().default(true)
    }),
    annotations: {
      title: 'Create Zoom Meeting',
      readOnlyHint: false,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const { meeting_details, enable_recording, auto_start } = params;

      // Phase 1: Mock meeting creation
      // Phase 2: Implement real Zoom API call
      const meeting = {
        meeting_id: `zoom_${Date.now()}`,
        lead_id: meeting_details.lead_id,
        host_id: 'zoom_host_mock',
        topic: meeting_details.title || `Meeting with ${meeting_details.lead_name}`,
        duration: meeting_details.duration_minutes,
        schedule_date: meeting_details.scheduled_date,
        schedule_time: meeting_details.scheduled_time,
        timezone: meeting_details.timezone,
        start_url: `https://zoom.us/wc/webinars/mock-start-${Date.now()}`,
        join_url: `https://zoom.us/wc/webinars/mock-join-${Date.now()}`,
        status: 'scheduled',
        recording_enabled: enable_recording,
        created_at: new Date().toISOString()
      };

      console.log(`[zoom-scheduler-mcp] Meeting created: ${meeting.meeting_id}`);

      return {
        success: true,
        meeting_id: meeting.meeting_id,
        join_url: meeting.join_url,
        start_url: meeting.start_url,
        topic: meeting.topic,
        scheduled: `${meeting.schedule_date} ${meeting.schedule_time}`,
        duration_minutes: meeting.duration,
        message: 'Zoom meeting created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to create Zoom meeting'
      };
    }
  }
);

// Tool 2: Get Meeting Link
server.registerTool(
  'get_meeting_link',
  {
    description: 'Retrieve Zoom meeting link with optional personalization (UTM params, etc)',
    inputSchema: z.object({
      meeting_id: z.string(),
      personalization: z.record(z.string()).optional()
    }),
    annotations: {
      title: 'Get Zoom Meeting Link',
      readOnlyHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const { meeting_id, personalization } = params;

      // Phase 1: Mock link with personalization
      // Phase 2: Generate real personalized links for tracking
      let link = `https://zoom.us/wc/webinars/${meeting_id}`;

      if (personalization) {
        const params_str = new URLSearchParams(personalization).toString();
        link += `?${params_str}`;
      }

      return {
        success: true,
        meeting_id: meeting_id,
        join_link: link,
        short_link: `https://zoomlink.co/${meeting_id.slice(-6)}`,
        personalized: !!personalization,
        message: 'Meeting link retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
);

// Tool 3: Add Registrant
server.registerTool(
  'add_registrant',
  {
    description: 'Add a lead as registrant to Zoom meeting',
    inputSchema: z.object({
      meeting_id: z.string(),
      lead_email: z.string().email(),
      lead_name: z.string(),
      phone: z.string().optional()
    }),
    annotations: {
      title: 'Add Registrant to Meeting',
      readOnlyHint: false,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const { meeting_id, lead_email, lead_name, phone } = params;

      // Phase 1: Mock registrant addition
      // Phase 2: Implement real Zoom API call
      const registrant = {
        registrant_id: `reg_${Date.now()}`,
        meeting_id: meeting_id,
        email: lead_email,
        name: lead_name,
        phone: phone || null,
        registered_at: new Date().toISOString(),
        status: 'pending'
      };

      console.log(`[zoom-scheduler-mcp] Registrant added: ${registrant.registrant_id}`);

      return {
        success: true,
        registrant_id: registrant.registrant_id,
        email: lead_email,
        name: lead_name,
        status: 'pending',
        confirmation_link: `https://zoom.us/webinar/register/confirm/${registrant.registrant_id}`,
        message: 'Registrant added to meeting successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
);

// Tool 4: Update Meeting
server.registerTool(
  'update_meeting',
  {
    description: 'Update Zoom meeting details (time, title, description, etc)',
    inputSchema: z.object({
      meeting_id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      scheduled_date: z.string().date().optional(),
      scheduled_time: z.string().optional(),
      duration_minutes: z.number().optional()
    }),
    annotations: {
      title: 'Update Zoom Meeting',
      readOnlyHint: false,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const { meeting_id, title, description, scheduled_date, scheduled_time, duration_minutes } = params;

      // Phase 1: Mock update
      // Phase 2: Implement real Zoom API update call
      console.log(`[zoom-scheduler-mcp] Updating meeting ${meeting_id}`);

      return {
        success: true,
        meeting_id: meeting_id,
        updated_fields: {
          title: title ? 'updated' : null,
          description: description ? 'updated' : null,
          scheduled_date: scheduled_date ? 'updated' : null,
          scheduled_time: scheduled_time ? 'updated' : null,
          duration_minutes: duration_minutes ? 'updated' : null
        },
        updated_at: new Date().toISOString(),
        message: 'Meeting updated successfully'
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
console.error('[zoom-scheduler-mcp] Server started successfully');
