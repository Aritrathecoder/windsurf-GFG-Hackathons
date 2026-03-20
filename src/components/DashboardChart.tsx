'use client';

import React from 'react';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  AreaChart, Area,
  ScatterChart, Scatter,
  ComposedChart,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Treemap,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartConfig {
  chartType: string;
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
  data: Record<string, unknown>[];
}

const DEFAULT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7',
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div style={{
      background: 'rgba(17, 24, 39, 0.95)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '12px',
      padding: '12px 16px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5)',
    }}>
      {label && (
        <p style={{ 
          color: '#f1f5f9', 
          fontWeight: 600, 
          fontSize: '13px',
          marginBottom: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '6px'
        }}>
          {label}
        </p>
      )}
      {payload.map((entry, index) => (
        <p key={index} style={{ 
          color: entry.color || '#94a3b8', 
          fontSize: '12px',
          margin: '4px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: entry.color,
            display: 'inline-block',
          }} />
          <span style={{ color: '#94a3b8' }}>{entry.name}:</span>{' '}
          <span style={{ fontWeight: 600, color: '#f1f5f9', fontFamily: "'JetBrains Mono', monospace" }}>
            {typeof entry.value === 'number' ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
};

function formatTickValue(value: unknown): string {
  if (typeof value === 'number') {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(value % 1 === 0 ? 0 : 2);
  }
  const str = String(value);
  return str.length > 15 ? str.substring(0, 12) + '...' : str;
}

export default function DashboardChart({ config }: { config: ChartConfig }) {
  const { chartType, data, xAxisKey, yAxisKey, dataKeys, colors, showLegend, stacked, xAxisLabel, yAxisLabel } = config;
  const chartColors = colors?.length ? colors : DEFAULT_COLORS;

  if (!data || data.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#64748b',
        fontSize: '14px',
      }}>
        No data available for this chart
      </div>
    );
  }

  const commonAxisProps = {
    tick: { fill: '#64748b', fontSize: 11, fontFamily: "'Inter', sans-serif" },
    axisLine: { stroke: 'rgba(255,255,255,0.06)' },
    tickLine: { stroke: 'rgba(255,255,255,0.06)' },
  };

  const gridProps = {
    strokeDasharray: '3 3',
    stroke: 'rgba(255,255,255,0.06)',
  };

  const keysToPlot = dataKeys?.length ? dataKeys : (yAxisKey ? [yAxisKey] : Object.keys(data[0]).filter(k => k !== xAxisKey && typeof data[0][k] === 'number'));

  switch (chartType) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid {...gridProps} />
            <XAxis 
              dataKey={xAxisKey} 
              {...commonAxisProps}
              label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 } : undefined}
              tickFormatter={formatTickValue}
            />
            <YAxis 
              {...commonAxisProps} 
              tickFormatter={formatTickValue}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12, offset: -5 } : undefined}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend !== false && <Legend />}
            {keysToPlot.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartColors[i % chartColors.length]}
                radius={[4, 4, 0, 0]}
                stackId={stacked ? 'stack' : undefined}
                animationDuration={800}
                animationBegin={i * 100}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );

    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid {...gridProps} />
            <XAxis 
              dataKey={xAxisKey} 
              {...commonAxisProps}
              label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 } : undefined}
              tickFormatter={formatTickValue}
            />
            <YAxis 
              {...commonAxisProps} 
              tickFormatter={formatTickValue}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12, offset: -5 } : undefined}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend !== false && <Legend />}
            {keysToPlot.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={chartColors[i % chartColors.length]}
                strokeWidth={2.5}
                dot={{ fill: chartColors[i % chartColors.length], r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: chartColors[i % chartColors.length], strokeWidth: 2, fill: '#0a0e1a' }}
                animationDuration={1200}
                animationBegin={i * 150}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );

    case 'area':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <defs>
              {keysToPlot.map((key, i) => (
                <linearGradient key={key} id={`gradient-${key}-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis 
              dataKey={xAxisKey} 
              {...commonAxisProps}
              tickFormatter={formatTickValue}
            />
            <YAxis {...commonAxisProps} tickFormatter={formatTickValue} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend !== false && <Legend />}
            {keysToPlot.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={chartColors[i % chartColors.length]}
                strokeWidth={2}
                fill={`url(#gradient-${key}-${i})`}
                stackId={stacked ? 'stack' : undefined}
                animationDuration={1200}
                animationBegin={i * 150}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'pie':
      const pieKey = yAxisKey || keysToPlot[0];
      const nameKey = xAxisKey || Object.keys(data[0]).find(k => k !== pieKey) || '';
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey={pieKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius="75%"
              innerRadius="45%"
              strokeWidth={2}
              stroke="rgba(10, 14, 26, 0.8)"
              paddingAngle={3}
              animationDuration={1000}
              label={({ name, percent }: { name?: string; percent?: number }) => 
                `${name || ''}: ${((percent || 0) * 100).toFixed(1)}%`
              }
              labelLine={{ stroke: '#64748b', strokeWidth: 1 }}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend !== false && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      );

    case 'scatter':
      const scatterXKey = xAxisKey || keysToPlot[0];
      const scatterYKey = yAxisKey || keysToPlot[1] || keysToPlot[0];
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid {...gridProps} />
            <XAxis 
              dataKey={scatterXKey} 
              {...commonAxisProps} 
              name={scatterXKey}
              tickFormatter={formatTickValue}
            />
            <YAxis 
              dataKey={scatterYKey} 
              {...commonAxisProps} 
              name={scatterYKey}
              tickFormatter={formatTickValue}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter 
              data={data} 
              fill={chartColors[0]}
              animationDuration={1000}
            />
          </ScatterChart>
        </ResponsiveContainer>
      );

    case 'composed':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid {...gridProps} />
            <XAxis 
              dataKey={xAxisKey} 
              {...commonAxisProps}
              tickFormatter={formatTickValue}
            />
            <YAxis {...commonAxisProps} tickFormatter={formatTickValue} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend !== false && <Legend />}
            {keysToPlot.map((key, i) => {
              if (i === 0) {
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={chartColors[i % chartColors.length]}
                    radius={[4, 4, 0, 0]}
                    animationDuration={800}
                  />
                );
              }
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={chartColors[i % chartColors.length]}
                  strokeWidth={2.5}
                  dot={{ fill: chartColors[i % chartColors.length], r: 4 }}
                  animationDuration={1200}
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      );

    case 'radar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis dataKey={xAxisKey} tick={{ fill: '#64748b', fontSize: 11 }} />
            <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend !== false && <Legend />}
            {keysToPlot.map((key, i) => (
              <Radar
                key={key}
                dataKey={key}
                stroke={chartColors[i % chartColors.length]}
                fill={chartColors[i % chartColors.length]}
                fillOpacity={0.15}
                strokeWidth={2}
                animationDuration={1000}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      );

    case 'treemap':
      const treemapKey = yAxisKey || keysToPlot[0];
      const treemapData = data.map((item, i) => ({
        ...item,
        fill: chartColors[i % chartColors.length],
      }));
      return (
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData as any[]}
            dataKey={treemapKey}
            nameKey={xAxisKey}
            stroke="rgba(10, 14, 26, 0.8)"
            animationDuration={1000}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      );

    default:
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey={xAxisKey} {...commonAxisProps} tickFormatter={formatTickValue} />
            <YAxis {...commonAxisProps} tickFormatter={formatTickValue} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend !== false && <Legend />}
            {keysToPlot.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartColors[i % chartColors.length]}
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
  }
}
