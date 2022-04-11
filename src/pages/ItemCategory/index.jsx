import { Card, Col, Input, message, Modal, Row, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ModalEditor from "./ModalEditor";
import ModalError from "../../components/Sidebar/ModalError";

const initSearch = {
	category_name: "",
};

const ItemCategory = () => {
	const [data, setData] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState([]);
	const [modalError, setModalError] = useState(false);
	const [search, setSearch] = useState(initSearch);
	const [editor, setEditor] = useState({
		id: 0,
		category_name: "",
	});

	const getData = async (filter) => {
		try {
			setLoading(true);
			const resp = await axios.get(
				process.env.REACT_APP_SERVER_URL +
					`/api/v1.0/item-category?category_name=${filter.category_name}`
			);
			if (resp) {
				setLoading(false);
				setData(resp.data.data.rows);
			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
			onError(error.message);
		}
	};

	useEffect(() => {
		getData(initSearch);
	}, []);

	const handleDelete = async (id) => {
		try {
			const resp = await axios.delete(
				process.env.REACT_APP_SERVER_URL + "/api/v1.0/item-category/" + id
			);
			if (resp) {
				getData(initSearch);
				success(resp.data.meta.message);
			}
		} catch (error) {
			onError(error);
		}
	};

	const handleChangeSearch = (e) => {
		const key = e.target ? e.target.name : e.name;
		const value = e.target ? e.target.value : e.value;

		setSearch({
			...search,
			[key]: value,
		});
	};

	const handleSearch =
		(isSearch = false) =>
		() => {
			if (isSearch) {
				getData(search);
			} else {
				setSearch(initSearch);
				getData(initSearch);
			}
		};

	function showDeleteConfirm(id) {
		Modal.confirm({
			title: "Are you sure delete this task?",
			icon: <ExclamationCircleOutlined />,
			content: "Some descriptions",
			okText: "Yes",
			okType: "danger",
			cancelText: "No",
			onOk() {
				handleDelete(id);
			},
			onCancel() {},
		});
	}

	const success = (messages) => {
		message.success(messages);
	};

	const onError = (e, raw = false) => {
		let errorArray = [e];
		if (e?.data?.errors) {
			errorArray = e.data.errors;
		}
		setError(errorArray);
		setModalError(!modalError);
	};

	const columns = [
		{
			title: "Category Name",
			dataIndex: "category_name",
			key: "category_name",
		},
		{
			title: "Action",
			dataIndex: "id",
			key: "id",
			width: "20%",
			render: (c, r) => (
				<>
					<button
						className="btn btn-warning"
						onClick={() => {
							setEditor({
								id: c,
								category_name: r.category_name,
							});
							setOpenModal(true);
						}}
					>
						<FaEdit />
					</button>
					<button
						className="ml-1 btn btn-secondary"
						onClick={() => showDeleteConfirm(c)}
					>
						<FaTrash />
					</button>
				</>
			),
		},
	];

	return (
		<div className="container mx-auto">
			{/* Modal */}
			<ModalEditor
				isOpen={openModal}
				onClose={() => setOpenModal(false)}
				refresh={() => getData(initSearch)}
				success={success}
				editor={editor}
				setEditor={setEditor}
			/>
			<ModalError
				visible={modalError}
				error={error}
				handleClose={() => setModalError(!modalError)}
			/>
			{/* Content */}
			<div className="bg-white rounded-md shadow-md card">
				<div className="p-8">
					<div className="flex justify-between ">
						<h2 className="font-bold">Item Category</h2>
						<button
							className="btn btn-primary btn-md"
							onClick={() => setOpenModal(true)}
						>
							<FaPlus className="mr-2" /> Add
						</button>
					</div>
					<hr className="my-4" />
					<Card>
						<Row>
							<Col span={12} className="border-r">
								<Row className="items-center">
									<Col span="6">
										<span>Category Name</span>
									</Col>
									<Col span={17}>
										<Input
											placeholder="Search category name"
											name="category_name"
											onChange={handleChangeSearch}
											value={search.category_name}
										/>
									</Col>
								</Row>
							</Col>
							<Col span={12}>
								<Row className="flex justify-end">
									<Col>
										<div>
											<button
												className="btn btn-error btn-outline btn-sm"
												onClick={handleSearch(false)}
											>
												Reset
											</button>
											<button
												className="ml-2 btn btn-success btn-outline btn-sm"
												onClick={handleSearch(true)}
											>
												Search
											</button>
										</div>
									</Col>
								</Row>
							</Col>
						</Row>
					</Card>

					<div className="mt-4 overflow-x-auto">
						<Table
							dataSource={data || []}
							columns={columns}
							bordered
							loading={loading}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ItemCategory;
