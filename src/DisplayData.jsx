import React from "react";
import { Chart, Title, Legend, XAxis, YAxis } from "@highcharts/react";
import { SplineSeries } from "@highcharts/react/series/Spline";
import { ColumnSeries } from "@highcharts/react/series/Column";
export function SplineChart(props) {
    const series = props.data || [];

    return (
        <Chart backgroundColor={props.color.background}>
            <Title>{`<span style="color:${props.color.text}">${props.title}</span>`}</Title>
            <XAxis labels={{ style: { color: props.color.text } }} title={{ style: { color: props.color.text } }}/>
            <YAxis labels={{ style: { color: props.color.text } }} title={{ style: { color: props.color.text } }}/>
            {series.map((s, i) => (
                <SplineSeries key={s.name ?? i} data={s.data} name={`<span style="color:${s.color ?? props.color.text}">${s.name}</span>`} />
            ))}
        </Chart>
    );
}

export function ColumnChart(props) {
    return (
        <Chart backgroundColor={props.color.background}>
            <Title>{`<span style="color:${props.color.text}">${props.title}</span>`}</Title>
            <XAxis labels={{ style: { color: props.color.text } }} title={{ style: { color: props.color.text } }}/>
            <YAxis labels={{ style: { color: props.color.text } }} title={{ style: { color: props.color.text } }}/>
            <ColumnSeries data={props.data} name={`<span style="color:${props.color.text}">column chart</span>`} color="red" />
        </Chart>
    );
}