import React from 'react'
import { Pie, PieChart, Cell } from 'recharts'
function CustomPie({ data, dataKey, nameKey }) {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
    const RADIAN = Math.PI / 180
    const renderCustomizedLabel = (obj) => {
        const {
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
            symbol,
        } = obj
        const radius = innerRadius + (outerRadius - innerRadius) * 0.7
        const farRadius = innerRadius + (outerRadius - innerRadius) * 1.25
        const x1 = cx + radius * Math.cos(-midAngle * RADIAN)
        const y1 = cy + radius * Math.sin(-midAngle * RADIAN)

        const x2 = cx + farRadius * Math.cos(-midAngle * RADIAN)
        const y2 = cy + farRadius * Math.sin(-midAngle * RADIAN)

        return (
            <>
                <text
                    x={x1}
                    y={y1}
                    fill="white"
                    textAnchor={x1 > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                >
                    {`${percent.toFixed(0)}%`}
                </text>
                <text
                    x={x2}
                    y={y2}
                    fill="black"
                    textAnchor={x2 > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                >
                    {`${symbol}`}
                </text>
            </>
        )
    }
    return (
        <PieChart width={730} height={250}>
            <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                label={renderCustomizedLabel}
            >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                    />
                ))}
            </Pie>
        </PieChart>
    )
}
export default CustomPie
