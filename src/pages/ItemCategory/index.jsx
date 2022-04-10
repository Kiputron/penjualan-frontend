import { message, Modal, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ModalEditor from "./ModalEditor";
import ModalError from "../../components/Sidebar/ModalError";

const ItemCategory = () => {
	const [data, setData] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState([]);
	const [modalError, setModalError] = useState(false);
	const [editor, setEditor] = useState({
		id: 0,
		category_name: "",
	});

	const getData = async () => {
		try {
			setLoading(true);
			const resp = await axios.get(
				process.env.REACT_APP_SERVER_URL + "/api/v1.0/item-category/"
			);
			setLoading(false);
			setData(resp.data.data.rows);
		} catch (error) {
			onError(error);
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		try {
			const resp = await axios.delete(
				process.env.REACT_APP_SERVER_URL + "/api/v1.0/item-category/" + id
			);
			if (resp) {
				getData();
				success(resp.data.meta.message);
			}
		} catch (error) {
			onError(error);
		}
	};

	useEffect(() => {
		getData();
	}, []);

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
		let errorArray = ["Error"];
		if (e.data.errors) {
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
				refresh={() => getData()}
				success={success}
				editor={editor}
				setEditor={setEditor}
			/>
			<ModalError visible={modalError} error={error} />
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

					<div className="mt-1 overflow-x-auto">
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
