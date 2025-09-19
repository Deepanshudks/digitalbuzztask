export const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex justify-end pt-3">
      <ul className="flex flex-wrap gap-4 bg-zinc-100 p-2 rounded justify-end mt-2 text-xs">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
