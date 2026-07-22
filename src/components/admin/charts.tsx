import { useState } from 'react';

// Categorical palette — validated for CVD separation and lightness band against
// a white chart surface. Slots are assigned in this fixed order, never cycled.
export const SERIES = {
  primary: '#225AE3',
  accent: '#F59E0B',
  green: '#0E9F6E',
  purple: '#9333EA',
} as const;

const AXIS = '#9CA3AF';
const GRID = '#F1F3F7';
const INK = '#374151';

// ---------------------------------------------------------------------------
// Grouped bar chart — change over time, 1–2 series
// ---------------------------------------------------------------------------

export interface BarDatum {
  label: string;
  fullLabel?: string;
  values: number[];
}

export const GroupedBarChart = ({
  data,
  series,
  height = 240,
  valueFormatter = (n: number) => n.toLocaleString(),
}: {
  data: BarDatum[];
  series: { name: string; color: string }[];
  height?: number;
  valueFormatter?: (value: number) => string;
}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const width = 720;
  const padding = { top: 16, right: 12, bottom: 30, left: 44 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(1, ...data.flatMap((d) => d.values));
  // Round the axis top up to something readable
  const step = Math.pow(10, Math.max(0, Math.floor(Math.log10(maxValue)) - 1));
  const axisTop = Math.ceil(maxValue / (step * 2)) * step * 2 || 1;

  const groupWidth = plotWidth / Math.max(1, data.length);
  const barGap = 2; // 2px surface gap between adjacent bars
  const barWidth = Math.max(
    3,
    (groupWidth * 0.62 - barGap * (series.length - 1)) / series.length
  );

  const yFor = (value: number) => padding.top + plotHeight - (value / axisTop) * plotHeight;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => Math.round(axisTop * fraction));

  return (
    <div>
      {/* Legend — identity is never colour-alone */}
      <div className="flex flex-wrap items-center gap-4 mb-3">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-2 text-xs font-medium text-gray-600">
            <span className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
        <button
          onClick={() => setShowTable((v) => !v)}
          className="ml-auto text-xs font-semibold text-[#225AE3] hover:underline"
        >
          {showTable ? 'Show chart' : 'Show data table'}
        </button>
      </div>

      {showTable ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-xs font-bold uppercase tracking-wide text-gray-500 px-3 py-2 border-b border-gray-200">
                  Month
                </th>
                {series.map((s) => (
                  <th
                    key={s.name}
                    className="text-right text-xs font-bold uppercase tracking-wide text-gray-500 px-3 py-2 border-b border-gray-200"
                  >
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((datum) => (
                <tr key={datum.fullLabel ?? datum.label}>
                  <td className="px-3 py-2 border-b border-gray-100 text-gray-700">
                    {datum.fullLabel ?? datum.label}
                  </td>
                  {datum.values.map((value, index) => (
                    <td
                      key={index}
                      className="px-3 py-2 border-b border-gray-100 text-right tabular-nums text-gray-900"
                    >
                      {valueFormatter(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full"
            style={{ height }}
            role="img"
            aria-label="Chart"
          >
            {/* Recessive grid */}
            {ticks.map((tick) => (
              <g key={tick}>
                <line
                  x1={padding.left}
                  x2={width - padding.right}
                  y1={yFor(tick)}
                  y2={yFor(tick)}
                  stroke={GRID}
                  strokeWidth={1}
                />
                <text
                  x={padding.left - 8}
                  y={yFor(tick) + 4}
                  textAnchor="end"
                  fontSize={10}
                  fill={AXIS}
                >
                  {tick}
                </text>
              </g>
            ))}

            {data.map((datum, groupIndex) => {
              const groupX = padding.left + groupIndex * groupWidth;
              const groupCentre = groupX + groupWidth / 2;
              const totalWidth = barWidth * series.length + barGap * (series.length - 1);
              const startX = groupCentre - totalWidth / 2;

              return (
                <g
                  key={datum.label + groupIndex}
                  onMouseEnter={() => setHovered(groupIndex)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Generous hover target, wider than the marks */}
                  <rect
                    x={groupX}
                    y={padding.top}
                    width={groupWidth}
                    height={plotHeight}
                    fill={hovered === groupIndex ? 'rgba(34,90,227,0.05)' : 'transparent'}
                  />
                  {datum.values.map((value, seriesIndex) => {
                    const barHeight = Math.max(
                      value > 0 ? 3 : 0,
                      (value / axisTop) * plotHeight
                    );
                    return (
                      <rect
                        key={seriesIndex}
                        x={startX + seriesIndex * (barWidth + barGap)}
                        y={padding.top + plotHeight - barHeight}
                        width={barWidth}
                        height={barHeight}
                        rx={4}
                        fill={series[seriesIndex].color}
                        opacity={hovered === null || hovered === groupIndex ? 1 : 0.45}
                      />
                    );
                  })}
                  <text
                    x={groupCentre}
                    y={height - 10}
                    textAnchor="middle"
                    fontSize={10}
                    fill={hovered === groupIndex ? INK : AXIS}
                    fontWeight={hovered === groupIndex ? 700 : 400}
                  >
                    {datum.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {hovered !== null && (
            <div
              className="pointer-events-none absolute top-2 bg-gray-900 text-white rounded-lg px-3 py-2 shadow-lg text-xs"
              style={{
                left: `${((hovered + 0.5) / data.length) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <p className="font-bold mb-1">{data[hovered].fullLabel ?? data[hovered].label}</p>
              {series.map((s, index) => (
                <p key={s.name} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />
                  <span className="text-gray-300">{s.name}</span>
                  <span className="ml-auto font-semibold tabular-nums">
                    {valueFormatter(data[hovered].values[index])}
                  </span>
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Horizontal bars — ranked magnitude, one hue
// ---------------------------------------------------------------------------

export const HorizontalBars = ({
  items,
  color = SERIES.primary,
  valueFormatter = (n: number) => n.toLocaleString(),
  emptyLabel = 'No data yet',
}: {
  items: Array<{ key: string; label: string; value: number; sublabel?: string }>;
  color?: string;
  valueFormatter?: (value: number) => string;
  emptyLabel?: string;
}) => {
  const max = Math.max(1, ...items.map((item) => item.value));

  if (items.length === 0) {
    return <p className="text-sm text-gray-500 py-6 text-center">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.key}>
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <span className="text-sm text-gray-700 truncate capitalize">{item.label}</span>
            <span className="text-sm font-bold text-gray-900 tabular-nums flex-shrink-0">
              {valueFormatter(item.value)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, (item.value / max) * 100)}%`, background: color }}
            />
          </div>
          {item.sublabel && <p className="text-xs text-gray-500 mt-1">{item.sublabel}</p>}
        </li>
      ))}
    </ul>
  );
};

// ---------------------------------------------------------------------------
// Stacked proportion bar — one row, parts of a whole
// ---------------------------------------------------------------------------

export const ProportionBar = ({
  segments,
  formatter = (n: number) => n.toLocaleString(),
}: {
  segments: Array<{ key: string; label: string; value: number; color: string }>;
  formatter?: (value: number) => string;
}) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  if (total === 0) {
    return <p className="text-sm text-gray-500 py-4">Nothing to show yet.</p>;
  }

  return (
    <div>
      <div className="flex gap-[2px] h-3 rounded-full overflow-hidden bg-gray-100">
        {segments
          .filter((segment) => segment.value > 0)
          .map((segment) => (
            <div
              key={segment.key}
              style={{
                width: `${(segment.value / total) * 100}%`,
                background: segment.color,
              }}
              title={`${segment.label}: ${formatter(segment.value)}`}
            />
          ))}
      </div>
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: segment.color }} />
            <span className="text-gray-600 truncate">{segment.label}</span>
            <span className="ml-auto font-semibold text-gray-900 tabular-nums">
              {formatter(segment.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
