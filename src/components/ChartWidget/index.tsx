import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { sampleData } from "../../mocks";
import { CustomLegend } from "./CustomLegend";
import { CustomTooltip } from "./CustomTooltip";

export default function ChartWidget() {
  const [chartType, setChartType] = useState("Bar");
  const [startDate, setStartDate] = useState("2025-09-01");
  const [endDate, setEndDate] = useState("2025-09-30");

  const filteredData = useMemo(() => {
    return sampleData.filter((item) => {
      return item.date >= startDate && item.date <= endDate;
    });
  }, [startDate, endDate]);

  const colors = ["#2563EB", "#16A34A", "#EAB308", "#DC2626"];

  const pieData = useMemo(() => {
    const grouped: { [key: string]: number } = {};
    filteredData.forEach((item) => {
      grouped[item.category] = (grouped[item.category] || 0) + item.value;
    });
    return Object.entries(grouped).map(([category, value]) => ({
      category,
      value,
    }));
  }, [filteredData]);

  return (
    <div className="p-6 bg-white h-full rounded-2xl shadow-md space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Chart Type:</label>
          <select
            className="border rounded-md px-3 py-1 text-sm"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="Bar">Bar</option>
            <option value="Line">Line</option>
            <option value="Pie">Pie</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Start Date:</label>
          <input
            type="date"
            className="border rounded-md px-3 py-1 text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">End Date:</label>
          <input
            type="date"
            className="border rounded-md px-3 py-1 text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="h-96 w-full">
        {chartType === "Bar" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3" />
              <XAxis dataKey="item" />
              <YAxis domain={[0, 600]} tickCount={6} />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Bar barSize={50} dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === "Line" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="item" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#4F46E5" />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === "Pie" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart className="p-8">
              <Tooltip />
              <Legend content={<CustomLegend />} />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="category"
                outerRadius={100}
                fill="#4F46E5"
                label
              >
                {filteredData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
