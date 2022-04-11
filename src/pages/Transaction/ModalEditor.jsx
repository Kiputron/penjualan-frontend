import { Button, Col, DatePicker, Input, InputNumber, Modal, Row } from "antd";
import Select from "react-select";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ModalError from "../../components/Sidebar/ModalError";
import moment from "moment";

const ModalEditor = ({
	isOpen,
	onClose,
	refresh,
	success,
	editor,
	setEditor,
}) => {
	const [loadingInsert, setLoadingInsert] = useState(false);
	const [itemOption, setItemOption] = useState([]);
	const [error, setError] = useState([]);
	const [modalError, setModalError] = useState(false);

	const getItem = async () => {
		try {
			const resp = await axios.get(
				process.env.REACT_APP_SERVER_URL + "/api/v1.0/item/"
			);

			if (resp) {
				const option = resp.data.data.rows.map((it, ix) => ({
					value: it.id,
					label: it.item_name,
					stock: it.qty,
					name: "item_id",
				}));

				setItemOption(option);
			}
		} catch (error) {
			onError(error);
		}
	};

	useEffect(() => {
		getItem();
	}, [isOpen]);

	const handleChange = (e) => {
		const key = e.target ? e.target.name : e.name;
		const value = e.target ? e.target.value : e.value;

		setEditor({
			...editor,
			[key]: value,
			...(key === "item_id" && { stock: e.stock }),
		});
	};

	const handleSave = async () => {
		try {
			const { stock, ...res } = editor;
			setLoadingInsert(true);
			if (editor?.id === 0) {
				const resp = await axios.post(
					process.env.REACT_APP_SERVER_URL + "/api/v1.0/transaction/",
					res
				);

				if (resp) {
					refresh();
					onClose();
					setEditor({
						id: 0,
						item_id: 0,
						qty: null,
						transaction_date: moment(),
						stock: null,
					});
					success(resp.data.meta.message);
				}
			} else {
				const resp = await axios.put(
					process.env.REACT_APP_SERVER_URL +
						"/api/v1.0/transaction/" +
						editor.id,
					res
				);

				if (resp) {
					refresh();
					onClose();
					setEditor({
						id: 0,
						item_id: 0,
						qty: null,
						transaction_date: moment(),
						stock: null,
					});
					success(resp.data.meta.message);
				}
			}
		} catch (error) {
			onError(error?.response || error.message);
		} finally {
			setLoadingInsert(false);
		}
	};

	const onError = (e, raw = false) => {
		let errorArray = [e];
		if (e?.data?.errors) {
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
				title="Transaction Editor"
				visible={isOpen}
				onOk={handleSave}
				onCancel={() => {
					onClose();
					setEditor({
						id: 0,
						item_id: 0,
						qty: null,
						transaction_date: moment(),
						stock: null,
					});
				}}
				footer={[
					<Button disabled={loadingInsert} onClick={handleSave} type="primary">
						Save
					</Button>,
				]}
			>
				<Row className="mb-4">
					<Col span={6}>
						<span className="font-semibold ">Item</span>
					</Col>
					<Col span={18}>
						<Select
							options={itemOption}
							onChange={handleChange}
							value={itemOption.filter((ix) => ix.value === editor.item_id)}
						/>
					</Col>
				</Row>
				<Row className="mb-4">
					<Col span={6}>
						<span className="font-semibold ">Stock</span>
					</Col>
					<Col span={18}>
						<Input
							value={editor.stock}
							name="stock"
							autoComplete="false"
							readOnly
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
				<Row className="mb-4">
					<Col span={6}>
						<span className="font-semibold ">Date</span>
					</Col>
					<Col span={18}>
						<DatePicker
							value={moment(editor.transaction_date)}
							format={"DD-MM-YYYY"}
							style={{ width: "100%" }}
							onChange={(e) => setEditor({ ...editor, transaction_date: e })}
						/>
					</Col>
				</Row>
			</Modal>
		</>
	);
};

export default ModalEditor;
