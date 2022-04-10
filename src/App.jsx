import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Sidebar from "./components/Sidebar";
import RouteList from "./routes";
function App() {
	const [openSidebar, setOpenSidebar] = useState(false);
	return (
		<Router>
			<div
				className={`grid ${
					!openSidebar ? "grid-cols-[1fr,4fr]" : "grid-cols-[0.2fr,4fr]"
				} transition duration-200 `}
			>
				<Sidebar
					isOpen={(val) => {
						if (val) {
							setTimeout(() => {
								setOpenSidebar(val);
							}, 100);
						} else {
							setTimeout(() => {
								setOpenSidebar(val);
							}, 30);
						}
					}}
				/>

				<span className="bg-gray-200"></span>
				<div className="flex-1 min-h-screen text-2xl font-semibold bg-gray-200 p-7">
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
