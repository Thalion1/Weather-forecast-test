import React from "react";
import { Chart, Title, Legend } from "@highcharts/react";
import { SplineSeries } from "@highcharts/react/series/Spline";
import { ColumnSeries } from "@highcharts/react/series/Column";
export function SplineChart(props) {
    const series = props.data || [];

    return (
        <Chart>
            <Title>{props.title}</Title>
            {series.map((s, i) => (
                <SplineSeries key={s.name ?? i} data={s.data} name={s.name} />
            ))}
        </Chart>
    );
}

export function ColumnChart(props) {
    return (
        <Chart>
          <Title>{props.title}</Title>
          {/* <Legend>{"{index}: {name}"}</Legend> */}
          <ColumnSeries data={props.data} name="Column series" color="red" />
        </Chart>
    );
}