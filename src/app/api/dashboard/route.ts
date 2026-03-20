import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, getSchemaInfo } from '@/lib/database';
import { generateDashboardConfigWithGroq, DashboardResponse, ChartConfig } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const { query, checkOnly } = await request.json();

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid query.' },
        { status: 400 }
      );
    }

    if (checkOnly) {
      return NextResponse.json({ status: 'ok', message: 'Ready to analyze' });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key is not configured.' },
        { status: 500 }
      );
    }

    // Step 1: Get database schema for context
    const schema = getSchemaInfo();

    // Step 2: Send to Groq to get SQL + chart config
    const dashboardConfig: DashboardResponse = await generateDashboardConfigWithGroq(query, schema);

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
    console.log('Gemini generated SQL:', dashboardConfig.sql);
    let data;
    try {
      data = executeQuery(dashboardConfig.sql);
    } catch (sqlError) {
      console.error('SQL Execution Error:', sqlError);
      // If primary SQL fails, try to give useful feedback
      return NextResponse.json(
        {
          error: `SQL Error: ${(sqlError as Error).message}`,
          title: 'Query Error',
          summary: 'The generated SQL query had an error. Please try rephrasing your question.',
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
      metrics: (dashboardConfig as any).metrics || [],
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
