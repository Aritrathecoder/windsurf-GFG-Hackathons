import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, getSchemaInfo } from '@/lib/database';
import { generateDashboardConfig, DashboardResponse, ChartConfig } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid query.' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.' },
        { status: 500 }
      );
    }

    // Step 1: Get database schema for context
    const schema = getSchemaInfo();

    // Step 2: Send to Gemini to get SQL + chart config
    const dashboardConfig: DashboardResponse = await generateDashboardConfig(query, schema);

    if (dashboardConfig.error) {
      return NextResponse.json(
        { 
          error: dashboardConfig.error,
          title: dashboardConfig.title,
          summary: dashboardConfig.summary,
        },
        { status: 422 }
      );
    }

    // Step 3: Execute the SQL query
    let data;
    try {
      data = executeQuery(dashboardConfig.sql);
    } catch (sqlError) {
      // If primary SQL fails, try to give useful feedback
      return NextResponse.json(
        {
          error: `SQL Error: ${(sqlError as Error).message}`,
          title: 'Query Error',
          summary: 'The generated SQL query had an error. Please try rephrasing your question.',
          sql: dashboardConfig.sql,
          charts: [],
          data: { columns: [], rows: [] },
          insights: ['The AI-generated query encountered an error. This might be due to ambiguous column references or complex aggregation. Try simplifying your question.'],
        },
        { status: 422 }
      );
    }

    // Step 4: If we need multiple queries for different charts, handle that
    const chartsWithData: Array<ChartConfig & { data: Record<string, unknown>[] }> = [];
    
    for (const chart of dashboardConfig.charts) {
      // For now, all charts use the same data from the primary query
      // In a production system, you'd generate separate queries per chart
      chartsWithData.push({
        ...chart,
        data: data.rows,
      });
    }

    // Step 5: Return the complete dashboard
    return NextResponse.json({
      title: dashboardConfig.title,
      summary: dashboardConfig.summary,
      sql: dashboardConfig.sql,
      charts: chartsWithData,
      data: data,
      insights: dashboardConfig.insights,
      query: query,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: `Server error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// GET endpoint to check database health and return schema
export async function GET() {
  try {
    const schema = getSchemaInfo();
    return NextResponse.json({
      status: 'healthy',
      schema: schema,
      message: 'InsightAI is ready to answer your business questions!',
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
