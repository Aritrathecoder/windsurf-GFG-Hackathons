import { NextResponse } from 'next/server';

export async function GET() {
  const suggestions = [
    {
      category: "Revenue Analysis",
      queries: [
        "Show me the monthly revenue trend for 2024",
        "What are the total sales broken down by region?",
        "Compare revenue vs profit across all product categories",
      ]
    },
    {
      category: "Product Performance",
      queries: [
        "Which are the top 10 best-selling products by revenue?",
        "Show me the sales distribution across product categories as a pie chart",
        "What is the average unit price by product category?",
      ]
    },
    {
      category: "Regional Insights",
      queries: [
        "Compare Q3 vs Q4 sales performance by region",
        "Which region has the highest profit margin?",
        "Show monthly revenue for Q3 broken down by region and highlight top product category",
      ]
    },
    {
      category: "Sales Channel & Team",
      queries: [
        "How do sales channels (Online, Retail, Direct) compare in revenue?",
        "Who are the top 5 salespeople by total revenue?",
        "Show customer segment distribution (Enterprise vs Consumer) by channel",
      ]
    },
    {
      category: "Advanced Analysis",
      queries: [
        "Show me the quarterly profit growth trend with average order value",
        "What are the seasonal trends in electronics sales throughout the year?",
        "Compare the performance of Enterprise vs Consumer segments across all regions with profit margins",
      ]
    }
  ];

  return NextResponse.json({ suggestions });
}
