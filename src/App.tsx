import './global.scss';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBinFill } from 'react-icons/ri';
import apis from './apis';
import { useEffect, useState } from 'react';
import { message, Modal } from 'antd';

type Task = {
  id: string;
  name: string;
  isCompleted: boolean;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [newTask, setNewTask] = useState('');
  const [editName, setEditName] = useState('');
  const [editId, setEditId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTask = () => {
    if (!newTask) return message.error('Vui lòng nhập tên công việc');

    if (tasks.some((task) => task.name === newTask)) {
      return message.error('Công việc đã tồn tại');
    }

    const task = {
      id: `t${Math.ceil(Math.random() * 1000)}`,
      name: newTask,
      isCompleted: false,
    };
    apis.tasksApi.addTask(task).then((res) => {
      setTasks([...tasks, res]);
      setNewTask('');
    });
  };

  const deleteTask = (id: string) => {
    apis.tasksApi.deleteTask(id).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  const editTask = (task: Task) => {
    apis.tasksApi.updateTask(task).then((res) => {
      setTasks(
        tasks.map((t) => {
          if (t.id === res.id) {
            return res;
          }
          return t;
        })
      );
    });
  };

  const handleToggleCompleted = (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;
    editTask({ ...task, isCompleted: !task.isCompleted });
  };

  const showModal = (task: Task) => {
    setEditId(task.id);
    setEditName(task.name);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (!editName) return message.error('Vui lòng nhập tên công việc');
    if (tasks.some((task) => task.name === editName)) {
      return message.error('Công việc đã tồn tại');
    }
    editTask({ id: editId, name: editName, isCompleted: false });
    setEditName('');
    setEditId('');
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setEditName('');
    setEditId('');
    setIsModalOpen(false);
  };

  useEffect(() => {
    apis.tasksApi.getTasks().then((res) => {
      setTasks(res);
    });
  }, []);

  return (
    <div className="page">
      <Modal
        title="Cập nhật công việc"
        open={isModalOpen}
        onOk={handleOk}
        okText="Cập nhật"
        cancelText="Hủy"
        onCancel={handleCancel}
      >
        <input
          className="inputEdit"
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
      </Modal>
      <div className="addContainer">
        <input
          type="text"
          placeholder="Nhập tên công việc"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Thêm</button>
      </div>
      <div className="tabsContainer">
        <div
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          TẤT CẢ
        </div>
        <div
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          ĐÃ HOÀN THÀNH
        </div>
        <div
          className={`tab ${activeTab === 'incompleted' ? 'active' : ''}`}
          onClick={() => setActiveTab('incompleted')}
        >
          CHƯA HOÀN THÀNH
        </div>
      </div>
      <div className="tasksContainer">
        {tasks &&
          tasks
            .filter((task) => {
              if (activeTab === 'completed') {
                return task.isCompleted;
              } else if (activeTab === 'incompleted') {
                return !task.isCompleted;
              }
              return true;
            })
            .map((task) => (
              <div
                className={`task ${task.isCompleted ? 'completed' : ''}`}
                key={task.id}
              >
                <div className="taskText">
                  <input
                    type="checkbox"
                    defaultChecked={task.isCompleted}
                    onChange={() => handleToggleCompleted(task.id)}
                  />
                  <span>{task.name}</span>
                </div>

                <div className="taskActions">
                  <button className="edit" onClick={() => showModal(task)}>
                    <FaEdit />
                  </button>
                  <button
                    className="delete"
                    onClick={() => deleteTask(task.id)}
                  >
                    <RiDeleteBinFill />
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
