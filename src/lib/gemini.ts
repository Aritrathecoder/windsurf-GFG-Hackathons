import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ChartConfig {
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'composed' | 'radar' | 'treemap';
  title: string;
  description: string;
  xAxisKey?: string;
  yAxisKey?: string;
  dataKeys?: string[];
  colors?: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  stacked?: boolean;
}

export interface DashboardResponse {
  sql: string;
  charts: ChartConfig[];
  insights: string[];
  title: string;
  summary: string;
  error?: string;
}

const SYSTEM_PROMPT = `You are an expert Business Intelligence analyst and SQL developer. Your job is to help non-technical business users generate data dashboards from natural language queries.

You have access to a SQLite database with the following schema:

{SCHEMA}

IMPORTANT RULES:
1. Generate ONLY valid SQLite SELECT queries. Never use INSERT, UPDATE, DELETE, DROP, or any modifying statements.
2. Always use proper date functions. For SQLite, use strftime() for date manipulation:
   - Month: strftime('%m', date) or strftime('%Y-%m', date)
   - Quarter: Use CASE statements with strftime('%m', date) for quarters
   - Year: strftime('%Y', date)
3. For Q1: months 01-03, Q2: months 04-06, Q3: months 07-09, Q4: months 10-12
4. When the user asks for "monthly" data, group by strftime('%Y-%m', date)
5. When grouping and using aggregates, always include the GROUP BY column in SELECT
6. Use proper column aliases to make results readable
7. Round monetary values to 2 decimal places using ROUND()

For chart selection, follow these rules:
- Time-series trends → Line chart or Area chart
- Comparing categories → Bar chart (use horizontal for many categories)
- Parts of a whole / proportions → Pie chart
- Two variable relationships → Scatter chart
- Multiple metrics comparison → Composed chart (bar + line)
- Multi-dimensional comparison → Radar chart
- Hierarchical proportions → Treemap

You MUST respond with ONLY a valid JSON object (no markdown, no code blocks, no explanation) in this exact format:
{
  "sql": "SELECT ...",
  "charts": [
    {
      "chartType": "bar|line|pie|area|scatter|composed|radar|treemap",
      "title": "Chart Title",
      "description": "What this chart shows",
      "xAxisKey": "column_name_for_x_axis",
      "yAxisKey": "column_name_for_primary_y_axis",
      "dataKeys": ["column1", "column2"],
      "colors": ["#hex1", "#hex2"],
      "xAxisLabel": "X Axis Label",
      "yAxisLabel": "Y Axis Label",
      "showLegend": true,
      "stacked": false
    }
  ],
  "insights": [
    "Key insight 1 about the data, inferred from the query intent",
    "Key insight 2"
  ],
  "title": "Dashboard Title",
  "summary": "Brief description of what this dashboard shows"
}

IMPORTANT GUIDELINES FOR RESPONSE:
- Generate 1-4 charts depending on the complexity of the query
- For simple queries, 1-2 charts suffice
- For complex queries asking about breakdowns, trends AND comparisons, generate up to 4 charts with different SQL queries if needed
- If you think the data needs multiple SQL queries for different charts, include the charts but note in each chart that the SQL may need to be different. In such cases, you can use the SQL field for the primary query and use the chart description to note what additional query would be needed.
- Use modern, vibrant color palette. Preferred colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7"]
- Always provide at least 2 actionable business insights
- If the user's query is vague or ambiguous, still try to provide a reasonable interpretation but mention your assumptions in the insights
- If the query asks for something that cannot be answered from the available data, say so clearly in the summary and provide the closest available analysis

REMEMBER: Return ONLY the JSON object, nothing else. No markdown formatting, no code fences.`;

export async function generateDashboardConfig(
  userQuery: string,
  schema: string
): Promise<DashboardResponse> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
      }
    });

    const prompt = SYSTEM_PROMPT.replace('{SCHEMA}', schema);
    
    const result = await model.generateContent([
      { text: prompt },
      { text: `User Query: "${userQuery}"\n\nGenerate the dashboard configuration JSON:` }
    ]);

    const responseText = result.response.text();
    
    // Clean up the response - remove markdown code blocks if present
    let cleaned = responseText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    const parsed: DashboardResponse = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      sql: '',
      charts: [],
      insights: [],
      title: 'Error',
      summary: 'Failed to process your query. Please try rephrasing it.',
      error: (error as Error).message,
    };
  }
}
