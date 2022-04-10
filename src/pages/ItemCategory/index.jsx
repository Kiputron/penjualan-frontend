import axios from "axios";
import React, { useEffect } from "react";

const ItemCategory = () => {
	const getData = async () => {
		try {
			const resp = await axios.get(
				process.env.REACT_APP_SERVER_URL + "/api/v1.0/item-category/"
			);
			console.log(resp);
		} catch (error) {
			console.log(error.message);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return <div>ItemCategory</div>;
};

export default ItemCategory;
