import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import RouteList from "../../routes";

const Sidebar = () => {
	const [open, setOpen] = useState(true);
	const location = useLocation(); // once ready it returns the 'window.location' object
	const [url, setUrl] = useState(null);

	useEffect(() => {
		setUrl(location.pathname);
	}, [location]);
	console.log("url", url);

	return (
		<div
			className={`${
				open ? "w-72" : "w-20"
			} duration-300 h-screen bg-dark-purple relative p-5 pt-8`}
		>
			<img
				src="/assets/control.png"
				alt=""
				className={`absolute border-2 rounded-full cursor-pointer -right-3 top-9 w-7 border-dark-purple ${
					!open && "rotate-180"
				}`}
				onClick={() => setOpen(!open)}
			/>
			<div className="flex items-center gap-x-4">
				<img
					src="/assets/logo.png"
					alt=""
					className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
				/>
				<h1
					className={`text-white origin-left font-medium text-xl duration-300 ${
						!open && "scale-0"
					}`}
				>
					Penjualan
				</h1>
			</div>
			<ul className="pt-6">
				{RouteList.map((menu, index) => (
					<Link to={`${menu.path}`} key={index}>
						<li
							className={`flex items-center p-2 text-sm text-gray-300 rounded-md cursor-pointer gap-x-4 hover:bg-light-white ${
								menu.gap ? "mt-9" : "mt-2"
							} ${menu.path === url && "bg-light-white"}`}
						>
							<img src={`/assets/${menu.src}.png`} alt="" />
							<span className={`${!open && "hidden"} duration-300 origin-left`}>
								{menu.title}
							</span>
						</li>
					</Link>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
