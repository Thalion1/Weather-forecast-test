import { useRef } from "react";
import { Chart, Title, Legend, XAxis, YAxis } from "@highcharts/react";
import { SplineSeries } from "@highcharts/react/series/Spline";
import { ColumnSeries } from "@highcharts/react/series/Column";
export function SplineChart({ title, data = [], color, chartRef, time }) {
	const series = data || [];

	return (
		<Chart ref={chartRef} backgroundColor={color.background}>
			<Title>{`<span style="color:${color.text}">${title}</span>`}</Title>
			<XAxis labels={{ style: { color: color.text } }} title={{ style: { color: color.text } }} categories={time} />
			<YAxis labels={{ style: { color: color.text } }} title={{ style: { color: color.text } }} />
			{data.map((s, i) => (
				<SplineSeries key={s.name ?? i} data={s.data} name={`<span style="color:${s.color ?? color.text}">${s.name}</span>`} />
			))}
		</Chart>
	);
}

export function ColumnChart({ title, data = [], color, chartRef, time }) {
	return (
		<Chart backgroundColor={color.background}>
			<Title>{`<span style="color:${color.text}">${title}</span>`}</Title>
			<XAxis labels={{ style: { color: color.text } }} title={{ style: { color: color.text } }} categories={time} />
			<YAxis labels={{ style: { color: color.text } }} title={{ style: { color: color.text } }} />
			{data.map((s, i) => (
				<ColumnSeries key={s.name ?? i} data={s.data} name={`<span style="color:${s.color ?? color.text}">${s.name}</span>`} />
			))}
		</Chart>
	);
}