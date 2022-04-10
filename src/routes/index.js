import Dashboard from "../pages/Dashboard";
import Item from "../pages/Item";
import TransactionReport from "../pages/TransactionReport";
import Transaction from "../pages/Transaction";
import ItemCategory from "../pages/ItemCategory";

const routeList = [
	{
		title: "Dashboard",
		src: "Chart_fill",
		path: "/",
		component: Dashboard,
	},
	{
		title: "Transaction",
		src: "Calendar",
		path: "/transaction",
		component: Transaction,
	},
	{
		title: "Analytics",
		src: "Chart",
		path: "/transaction-report",
		component: TransactionReport,
	},
	{
		title: "Item",
		src: "Chat",
		gap: true,
		path: "/item",
		component: Item,
	},
	{
		title: "Item Category",
		src: "Chat",
		path: "/item-category",
		component: ItemCategory,
	},
];
export default routeList;
