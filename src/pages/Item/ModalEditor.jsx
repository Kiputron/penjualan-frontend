import { Button, Col, Input, InputNumber, Modal, Row } from "antd";
import Select from "react-select";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ModalError from "../../components/Sidebar/ModalError";

const ModalEditor = ({
	isOpen,
	onClose,
	refresh,
	success,
	editor,
	setEditor,
}) => {
	const [loadingInsert, setLoadingInsert] = useState(false);
	const [categoryOption, setCategoryOption] = useState([]);
	const [error, setError] = useState([]);
	const [modalError, setModalError] = useState(false);

	const getCategory = async () => {
		try {
			const resp = await axios.get(
				process.env.REACT_APP_SERVER_URL + "/api/v1.0/item-category/"
			);

			if (resp) {
				const option = resp.data.data.rows.map((it, ix) => ({
					value: it.id,
					label: it.category_name,
					name: "category_id",
				}));

				setCategoryOption(option);
			}
		} catch (error) {
			onError(error);
		}
	};

	useEffect(() => {
		getCategory();
	}, [isOpen]);

	const handleChange = (e) => {
		const key = e.target ? e.target.name : e.name;
		const value = e.target ? e.target.value : e.value;

		setEditor({
			...editor,
			[key]: value,
		});
	};

	const handleSave = async () => {
		try {
			setLoadingInsert(true);
			if (editor?.id === 0) {
				const resp = await axios.post(
					process.env.REACT_APP_SERVER_URL + "/api/v1.0/item/",
					editor
				);

				if (resp) {
					refresh();
					onClose();
					setEditor({ id: 0, item_name: "", qty: null, category_id: 0 });
					success(resp.data.meta.message);
				}
			} else {
				const resp = await axios.put(
					process.env.REACT_APP_SERVER_URL + "/api/v1.0/item/" + editor.id,
					editor
				);

				if (resp) {
					refresh();
					onClose();
					setEditor({ id: 0, item_name: "", qty: null, category_id: 0 });
					success(resp.data.meta.message);
				}
			}
		} catch (error) {
			onError(error.response);
		} finally {
			setLoadingInsert(false);
		}
	};

	const onError = (e, raw = false) => {
		let errorArray = ["Error"];
		if (e.data.errors) {
			errorArray = e.data.errors;
		}
		setError(errorArray);
		setModalError(!modalError);
	};

	return (
		<>
			<ModalError
				visible={modalError}
				error={error}
				handleClose={() => setModalError(false)}
			/>
			<Modal
				title="Item Category Editor"
				visible={isOpen}
				onOk={handleSave}
				onCancel={() => {
					onClose();
					setEditor({ id: 0, item_name: "", qty: null, category_id: 0 });
				}}
				footer={[
					<Button disabled={loadingInsert} onClick={handleSave} type="primary">
						Save
					</Button>,
				]}
			>
				<Row className="mb-4">
					<Col span={6}>
						<span className="font-semibold ">Item Name</span>
					</Col>
					<Col span={18}>
						<Input
							value={editor.item_name}
							onChange={handleChange}
							name="item_name"
							autoComplete="false"
						/>
					</Col>
				</Row>

				<Row className="mb-4">
					<Col span={6}>
						<span className="font-semibold ">Category</span>
					</Col>
					<Col span={18}>
						<Select
							options={categoryOption}
							onChange={handleChange}
							value={categoryOption.filter(
								(ix) => ix.value === editor.category_id
							)}
						/>
					</Col>
				</Row>
				<Row className="mb-4">
					<Col span={6}>
						<span className="font-semibold ">Qty</span>
					</Col>
					<Col span={18}>
						<InputNumber
							style={{ width: "100%" }}
							value={editor.qty}
							onChange={(val) => {
								setEditor({ ...editor, qty: val });
							}}
							name="qty"
						/>
					</Col>
				</Row>
			</Modal>
		</>
	);
};

export default ModalEditor;
