import { Modal } from "antd";
import React from "react";
import { FaTimesCircle } from "react-icons/fa";

const ModalError = ({ visible = false, error = [], handleClose }) => {
	return (
		<Modal
			visible={visible}
			title={
				<div className="flex items-center">
					<FaTimesCircle size={24} className="mr-2 text-rose-500" />
					<span>Errors</span>
				</div>
			}
			style={{ top: 10 }}
			onCancel={handleClose}
			onOk={handleClose}
		>
			<ol>
				{error.map((it, ix) => {
					if (it !== "") {
						return <li key={ix}>{it}</li>;
					}
					return null;
				})}
			</ol>
		</Modal>
	);
};

export default ModalError;
