import { Button, Col, Input, Modal, Row } from "antd";
import axios from "axios";
import React, { useState } from "react";
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
	const [error, setError] = useState([]);
	const [modalError, setModalError] = useState(false);

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
					process.env.REACT_APP_SERVER_URL + "/api/v1.0/item-category/",
					editor
				);

				if (resp) {
					refresh();
					onClose();
					setEditor({ id: 0, category_name: "" });
					success(resp.data.meta.message);
				}
			} else {
				const resp = await axios.put(
					process.env.REACT_APP_SERVER_URL +
						"/api/v1.0/item-category/" +
						editor.id,
					editor
				);

				if (resp) {
					refresh();
					onClose();
					setEditor({ id: 0, category_name: "" });
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
					setEditor({ id: 0, category_name: "" });
				}}
				footer={[
					<Button disabled={loadingInsert} onClick={handleSave} type="primary">
						Save
					</Button>,
				]}
			>
				<Row>
					<Col span={6}>
						<span className="font-semibold ">Category Name</span>
					</Col>
					<Col span={18}>
						<Input
							value={editor.category_name}
							onChange={handleChange}
							name="category_name"
							autoComplete="false"
						/>
					</Col>
				</Row>
			</Modal>
		</>
	);
};

export default ModalEditor;
