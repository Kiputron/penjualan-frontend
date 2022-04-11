import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import drilldown from "highcharts/modules/drilldown.js";
import axios from "axios";
import moment from "moment";
import { DatePicker } from "antd";
drilldown(Highcharts);

const { RangePicker } = DatePicker;

const initSearch = {
	start_date: moment().startOf("month"),
	end_date: moment(),
};

const TransactionReport = () => {
	const [optionCategory, setOptionCategory] = useState([]);
	const [drilldownOption, setDrilldownOption] = useState([]);
	const [search, setSearch] = useState(initSearch);

	const chartOption = {
		chart: {
			type: "column",
		},
		title: {
			text: `${moment(search.start_date).format("DD MMM, YYYY")} - ${moment(
				search.end_date
			).format("DD MMM, YYYY")} `,
		},

		accessibility: {
			announceNewData: {
				enabled: true,
			},
		},
		xAxis: {
			type: "category",
		},
		yAxis: {
			title: {
				text: "Total amount sold",
			},
		},
		legend: {
			enabled: false,
		},
		plotOptions: {
			series: {
				borderWidth: 0,

				dataLabels: {
					enabled: true,
					format: "{point.y}",
				},
			},
		},

		tooltip: {
			headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			pointFormat:
				'<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>',
		},

		series: [
			{
				name: "Category",
				colorByPoint: true,
				data: optionCategory,
			},
		],
		drilldown: {
			activeAxisLabelStyle: {
				textDecoration: "none",
				color: "#fffff",
			},
			activeDataLabelStyle: {
				textDecoration: "none",
				color: "#fffff",
			},
			breadcrumbs: {
				position: {
					align: "right",
				},
			},
			series: drilldownOption,
		},
	};

	const getData = async () => {
		try {
			const resp = await axios.get(
				process.env.REACT_APP_SERVER_URL +
					`/api/v1.0/transaction/report?start_date=${search.start_date}&end_date=${search.end_date}`
			);
			if (resp) {
				let tempOption = resp.data.data.map((it, ix) => ({
					name: it.category_name,
					drilldown: it.category_name,
					y: it.subtotal,
				}));
				let tempDrilldown = resp.data.data.map((it, ix) => ({
					name: it.category_name,
					id: it.category_name,
					data: it.items.map((itx) => [itx.item_name, itx.total]),
				}));
				setOptionCategory(tempOption);
				setDrilldownOption(tempDrilldown);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getData();
	}, [0, search]);

	return (
		<div className="bg-white rounded-md shadow-md card">
			<div className="p-8">
				<div className="flex justify-between ">
					<h2 className="font-bold">Transaction Report</h2>
					<RangePicker
						onChange={(e) => {
							if (e !== null) {
								setSearch({
									...search,
									start_date: e[0],
									end_date: e[1],
								});
							}
						}}
						format={"DD-MM-YYYY"}
						value={[
							moment(moment(search.start_date), "YYYY/MM/DD"),
							moment(moment(search.end_date), "YYYY/MM/DD"),
						]}
					/>
				</div>
				<hr className="my-4" />
				<HighchartsReact highcharts={Highcharts} options={chartOption} />
			</div>
		</div>
	);
};

export default TransactionReport;
