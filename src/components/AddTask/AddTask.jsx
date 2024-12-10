import {useRef, useState} from "react";
import {message, Modal} from "antd";
import useOutsideClick from "../../hooks/useOutsideClick.jsx";
import styles from './AddTask.module.css';
import classNames from "classnames";

const {useMessage} = message

const AddTask = ({onSaveContent, onCancel}) => {
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [messageApi, contextHolder] = useMessage();

    const taskNameInputRef = useRef(null);


    const resetTaskNameInput = () => {
        if (!taskNameInputRef.current) return;

        taskNameInputRef.current.innerText = "";

    }

    const handleConfirmModal = () => {
        setIsModalVisible(false);
        resetTaskNameInput();
        setTaskName("");
        setDescription("");
        onCancel();
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleCancelBtn = () => {
        console.log(taskName.length, !!taskName);
        if (taskName || description !== "") {
            setIsModalVisible(true); //open modal
        } else {
            setIsModalVisible(false); //don't open modal

            onCancel();
        }
    };

    const containerRef = useOutsideClick(handleCancelBtn);

    const handleUpdateTaskName = (event) => {
        setTaskName(event.currentTarget.innerText?.trim());
    };

    //description içindeki veriyi güncelle
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSaveContent = async () => {
        if (taskName.length > 500) {
            await messageApi.error(
                `Maximum length of task length should be 500. Current length is ${taskName.length}.`,
                5
            );

            return;
        }

        onSaveContent(taskName, description);

        resetTaskNameInput();

        setTaskName("");
        setDescription("");
        setIsModalVisible(false);
    };

    return (
        <div ref={containerRef} className={styles.wrapper}>
            <div className={styles.inputContainer}>
                <div
                    ref={taskNameInputRef}
                    autoFocus
                    className={styles.taskNameInput}
                    contentEditable
                    onInput={handleUpdateTaskName}
                    data-placeholder="Task Name"
                />
                <textarea
                    name="Description"
                    id="description"
                    value={description}
                    className={styles.descriptionInput}
                    placeholder="Description"
                    onChange={handleDescriptionChange}
                />
            </div>
            <hr style={{border: "0.1px solid #e1e1e1"}}/>
            <footer className={styles.footer}>
                <button className={styles.cancelBtn} onClick={handleCancelBtn}>
                    <svg
                        viewBox="0 0 24 24"
                        className="icon_close"
                        width="24"
                        height="24"
                    >
                        <path
                            fill="currentColor"
                            fillRule="nonzero"
                            d="M5.146 5.146a.5.5 0 0 1 .708 0L12 11.293l6.146-6.147a.5.5 0 0 1 .638-.057l.07.057a.5.5 0 0 1 0 .708L12.707 12l6.147 6.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.708 0L12 12.707l-6.146 6.147a.5.5 0 0 1-.638.057l-.07-.057a.5.5 0 0 1 0-.708L11.293 12 5.146 5.854a.5.5 0 0 1-.057-.638z"
                        ></path>
                    </svg>
                </button>
                <button
                    className={classNames(styles.sendTaskBtn, {[styles.disableBtn]: !taskName.trim().length})}
                    disabled={!taskName.trim().length}
                    onClick={handleSaveContent}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                    >
                        <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M7.18 6.396C7 6.642 7 7.054 7 7.878V11l6.715.674c.38.038.38.614 0 .652L7 13v3.122c0 .824 0 1.236.18 1.482.157.214.4.356.669.39.308.041.687-.15 1.444-.531l8.183-4.122c.861-.434 1.292-.651 1.432-.942a.915.915 0 0 0 0-.798c-.14-.29-.57-.508-1.433-.942l-8.18-4.122c-.758-.381-1.137-.572-1.445-.532a.986.986 0 0 0-.67.391Z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
            </footer>

            {contextHolder}

            <Modal
                open={isModalVisible}
                onOk={handleConfirmModal}
                onCancel={handleCloseModal}
            >
                <div>
                    <h3 className="cancelDicardHeader">
                        Do you want to delete changes?
                    </h3>
                    <h3 className="cancelDicard">
                        The changes will not be saved.
                    </h3>
                </div>
            </Modal>
        </div>
    )
}

export default AddTask;