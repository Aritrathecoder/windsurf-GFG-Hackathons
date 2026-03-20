import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

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

const SYSTEM_PROMPT = `You are a specialist YouTube Analytics expert. Your goal is to help creators and media executives analyze their content performance metrics.

You have access to a SQLite database (table: "youtube_stats") with columns: views, likes, comments, shares, sentiment_score, duration_sec, language, category, region, timestamp, ads_enabled.

FORMAT:
Respond with ONLY a flat JSON object:
{
  "sql": "SELECT ...",
  "metrics": [
    { "label": "Metric Name", "value": "1.2k", "change": "5%", "trend": "up" }
  ],
  "charts": [
    {
      "chartType": "bar|line|pie|area|scatter",
      "title": "Title",
      "description": "Short explanation",
      "xAxisKey": "Column for X",
      "yAxisKey": "Column for Y",
      "colors": ["#4318ff"]
    }
  ],
  "insights": ["...", "..."],
  "title": "Dashboard Title",
  "summary": "..."
}

CRITICAL RULES:
1. FOR CHARTS: NEVER use "LIMIT 1". Always return a series of data (e.g., LIMIT 10 or 20) so charts have points to connect.
2. AGGREGATES: Always use aliases (e.g., SUM(views) as views_total).
3. If the user asks for "highest", return the TOP 10 highest to show context in a chart.
4. For time-series, use DATE(timestamp) as column "date".`;

export async function generateDashboardConfigWithGroq(
  userQuery: string,
  schema: string
): Promise<DashboardResponse> {
  try {
    const prompt = SYSTEM_PROMPT.replace('{SCHEMA}', schema);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: `User Query: "${userQuery}"\n\nGenerate the dashboard configuration JSON:` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 1024,
      response_format: { type: 'json_object' }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) throw new Error('No response from Groq');

    const parsed: DashboardResponse = JSON.parse(responseContent);
    return parsed;
  } catch (error) {
    console.error('Groq API error:', error);
    return {
      sql: '',
      charts: [],
      insights: [],
      title: 'Error',
      summary: 'Failed to process your query using Groq. Please try rephrasing it.',
      error: (error as Error).message,
    };
  }
}
