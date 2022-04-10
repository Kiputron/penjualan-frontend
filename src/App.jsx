import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Sidebar from "./components/Sidebar";
import RouteList from "./routes";
function App() {
	return (
		<Router>
			<div className="flex">
				<Sidebar />
				<div className="flex-1 h-screen text-2xl font-semibold bg-white p-7">
					<Routes>
						{RouteList.map((el, index) => (
							<Route
								path={el.path}
								exact={el.exact ? true : false}
								key={index}
								element={<el.component />}
							/>
						))}
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
