#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

type ComponentSchema = {
  component: string;
  id?: string;
  props?: Record<string, unknown>;
  children?: ComponentSchema[];
};

type McpPayload = {
  pageType: string;
  generatedBy?: string;
  iqSource?: string;
  layout: ComponentSchema[];
};

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA DEFINITIONS (Microsoft Foundry IQ - Simulated Knowledge Base)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Landing Page Template: Hero-driven conversion-focused layout
 * Compliance: WCAG AA accessible, brand-approved tokens, 8px grid system
 */
const LANDING_PAGE_SCHEMA: McpPayload = {
  pageType: "landing-page",
  generatedBy: "DesignOps MCP Server v1.0.0",
  iqSource: "Microsoft Foundry IQ (Simulated Knowledge Layer)",
  layout: [
    {
      component: "NavBar",
      id: "nav-primary",
      props: {
        brand: "DesignOps",
        links: ["Docs", "Pricing", "GitHub"],
      },
    },
    {
      component: "Hero",
      id: "hero-primary",
      props: {
        headline: "Ship design systems at the speed of thought.",
        subtext:
          "Enterprise-grade design tokens, validated in real-time by Microsoft Foundry IQ. Copilot generates, we verify. No hallucinations. Zero rework.",
        cta: "Start Free Trial",
        ctaSecondary: "View GitHub",
        badge: "Powered by Microsoft Foundry IQ",
      },
    },
    {
      component: "FeatureGrid",
      id: "features-main",
      props: {
        features: [
          {
            icon: "⚡",
            title: "MCP-Native Integration",
            desc: "Seamlessly connects GitHub Copilot Chat with validated design tokens. No context switching.",
          },
          {
            icon: "🔒",
            title: "IQ-Grounded Output",
            desc: "Every generated layout passes 3-gate validation. Schema integrity, token compliance, governance approval.",
          },
          {
            icon: "🎨",
            title: "Live Canvas Preview",
            desc: "See rendered components instantly. Real-time compliance indicators and audit trails.",
          },
        ],
      },
    },
    {
      component: "Footer",
      id: "footer-main",
      props: {
        text: "© 2026 DesignOps. Built for Microsoft Agents League • Creative Apps Track.",
      },
    },
  ],
};

/**
 * Dynamic Form Template: Multi-step form with validation
 * Compliance: WCAG AA labels, accessible form fields, enterprise spacing tokens
 */
const DYNAMIC_FORM_SCHEMA: McpPayload = {
  pageType: "dynamic-form",
  generatedBy: "DesignOps MCP Server v1.0.0",
  iqSource: "Microsoft Foundry IQ (Simulated Knowledge Layer)",
  layout: [
    {
      component: "FormContainer",
      id: "form-primary",
      props: {
        title: "Create New Design System Project",
        subtitle: "All inputs validated against enterprise IQ rules.",
      },
      children: [
        {
          component: "FormField",
          id: "field-project-name",
          props: {
            label: "Project Name",
            type: "text",
            placeholder: "e.g. DesignOps Canvas v2",
          },
        },
        {
          component: "FormField",
          id: "field-track",
          props: {
            label: "Agents League Track",
            type: "select",
            options: [
              "Creative Apps",
              "Productivity Tools",
              "Developer Experience",
            ],
          },
        },
        {
          component: "FormField",
          id: "field-description",
          props: {
            label: "Project Description",
            type: "textarea",
            placeholder:
              "Describe your design system, token strategy, and governance goals...",
          },
        },
        {
          component: "FormField",
          id: "field-iq-enable",
          props: {
            label: "Enable Microsoft Foundry IQ Validation",
            type: "toggle",
            checked: true,
          },
        },
        {
          component: "FormActions",
          id: "form-actions",
          props: {
            submit: "Create Project",
            cancel: "Discard Changes",
          },
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION SCHEMAS (Zod)
// ─────────────────────────────────────────────────────────────────────────────

const PageTypeSchema = z.enum(["landing-page", "dynamic-form"]);

const GetBrandLayoutSchemaArgsSchema = z.object({
  pageType: PageTypeSchema.describe(
    "Page type to generate layout schema for: 'landing-page' or 'dynamic-form'"
  ),
});

// ─────────────────────────────────────────────────────────────────────────────
// MOCK VALIDATION GATES (3-Stage Pipeline Simulation)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Simulates Microsoft Foundry IQ validation gates
 * Gate 1: Schema Integrity (JSON structure validation)
 * Gate 2: Token Validation (design token compliance)
 * Gate 3: Governance Gate (policy & compliance checks)
 */
function simulateFoundryIQValidation(payload: McpPayload): {
  passed: boolean;
  gates: Array<{ name: string; status: "pass" | "warn" | "fail"; message: string }>;
  complianceScore: number;
  auditId: string;
} {
  const auditId = `2026-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const gates = [
    {
      name: "Schema Integrity",
      status: "pass" as const,
      message: "Component structure validated against registry",
    },
    {
      name: "Token Validation",
      status: "pass" as const,
      message: "All design tokens sourced from approved palette",
    },
    {
      name: "Governance Gate",
      status: "pass" as const,
      message: "WCAG AA compliance confirmed, brand rules satisfied",
    },
  ];

  return {
    passed: true,
    gates,
    complianceScore: 98.7,
    auditId,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MCP SERVER IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────

const server = new Server(
  {
    name: "designops-assistant",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// TOOL: get_brand_layout_schema
// Returns validated UI layout schemas grounded in Microsoft Foundry IQ
// ─────────────────────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "get_brand_layout_schema") {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
  }

  // Parse and validate arguments
  let args;
  try {
    args = GetBrandLayoutSchemaArgsSchema.parse(request.params.arguments);
  } catch (error) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Invalid arguments: ${error instanceof z.ZodError ? error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ") : String(error)}`
    );
  }

  // Simulate connection to Microsoft Foundry IQ knowledge base
  let schema: McpPayload;

  if (args.pageType === "landing-page") {
    schema = JSON.parse(JSON.stringify(LANDING_PAGE_SCHEMA));
  } else if (args.pageType === "dynamic-form") {
    schema = JSON.parse(JSON.stringify(DYNAMIC_FORM_SCHEMA));
  } else {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Unknown page type: ${args.pageType}`
    );
  }

  // Run Foundry IQ validation gates
  const validation = simulateFoundryIQValidation(schema);

  // Return result with validation metadata
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            schema,
            validation,
            metadata: {
              timestamp: new Date().toISOString(),
              version: "1.0.0",
              service: "Microsoft Foundry IQ (Simulated)",
            },
          },
          null,
          2
        ),
      },
    ],
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS LIST HANDLER
// ─────────────────────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_brand_layout_schema",
        description:
          "Retrieve a validated UI layout schema from Microsoft Foundry IQ knowledge base. Returns grounded, enterprise-approved component structures with design tokens and compliance metadata.",
        inputSchema: {
          type: "object" as const,
          properties: {
            pageType: {
              type: "string" as const,
              enum: ["landing-page", "dynamic-form"],
              description:
                "Type of page layout to generate. 'landing-page' returns hero-driven conversion layout. 'dynamic-form' returns multi-step form with validation.",
            },
          },
          required: ["pageType"],
        },
      },
    ],
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// SERVER INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error("[DesignOps MCP] Server initialized successfully");
  console.error(
    "[DesignOps MCP] Ready to receive requests from GitHub Copilot Chat"
  );
  console.error(
    "[DesignOps MCP] Tool available: get_brand_layout_schema(pageType: 'landing-page' | 'dynamic-form')"
  );
}

main().catch((error) => {
  console.error("[DesignOps MCP] Fatal error:", error);
  process.exit(1);
});
