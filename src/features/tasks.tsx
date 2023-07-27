import { SyntheticEvent, useEffect, useState } from 'react';
import { Form, FormControl, Modal, ModalBody, ModalFooter, ModalTitle, 
    Button, FormGroup, FormLabel, Row, ModalHeader, Table, FormCheck } from 'react-bootstrap';
import { getLogger } from '../LogConfig';

const log = getLogger("model.Task");

interface Task {
    id?: number
    title: string
    description: string
    completed: boolean
    created_at?: Date
    updated_at?: Date
}

/*
 *
 * Controller Definition
 * 
 */

interface TaskControllerProps {}
export const TaskController = ({}:TaskControllerProps) => {
    const [ tasks, setTasks ] = useState<Task[]>([]);

    const url = 'http://localhost:4000/tasks';

    // Initial fetch
    useEffect(() => {
        const abortController = new AbortController();
        handleRead({signal: abortController.signal});
        return () => abortController.abort();
    }, []);

    // (C)reate
    function handleCreate(task: Task): void {
        fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: task.title,
                completed: task.completed,
                description: task.description,
            })
        })
            .then(() => handleRead())
            .catch(error => log.error(() => 'Create Error: ', error));
    }
    
    // (R)ead
    function handleRead(opt?: any): void {
        fetch(url, opt)
            .then(response => response.json())
            .then(data => { setTasks(data); log.debug(() => `Fetched ${data.length} tasks`); })
            .catch(error => {
                if (error instanceof Error && error.name !== 'AbortError') {
                    log.error(() => 'Read Error: ', error);
                }
            });
    }

    // (U)pdate
    function handleUpdate(task: Task): void {
        fetch(`${url}/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: task.title,
                completed: task.completed,
                description: task.description,
            })
        })
            .then(() => handleRead())
            .catch(error => log.error(() => 'Update Error: ', error));
    }
    
    // (D)elete
    function handleDelete(id?: number): void {
        if (!id) { return; }
        fetch(`${url}/${id}`, { method: 'DELETE' })
            .then(() => handleRead())
            .catch(error => log.error(() => 'Delete Error: ', error));
    }

    // Return the view
    return (
        <TaskMainView tasks={tasks} 
            onCreate={handleCreate}
            onDelete={handleDelete}
            onUpdate={handleUpdate} />
    );
}

/* 
 *
 * View Definitions
 * 
 */

interface TaskMainViewProps {
    tasks: Task[];
    onCreate: (task:Task) => void;
    onDelete: (id?:number) => void;
    onUpdate: (task:Task) => void;
}
const TaskMainView = ({tasks, onCreate, onDelete, onUpdate}: TaskMainViewProps) => {
    const [ isVisible, setVisible ] = useState(false);
    const [ isUpdate, setUpdate ] = useState(false);
    const [ selectedTask, setSelectedTask ] = useState<Task>();

    return (
        <>
        <div style={{overflow: "scroll", maxHeight: "500px"}}>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Completed</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {tasks.map((task, idx) => (
                    <tr key={idx}>
                        <td>{task.id}</td>
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>{task.completed ? "True" : "False"}</td>
                        <td>
                            <div className="btn-group">
                                <button className="btn btn-outline-primary btn-sm" 
                                    style={{marginRight: "5px"}} 
                                    onClick={() => {
                                        setSelectedTask(task);
                                        setVisible(true);
                                        setUpdate(true);
                                    }}>Update</button>
                                <button className="btn btn-outline-danger btn-sm" 
                                    onClick={() => onDelete(task.id)}>Delete</button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
        
        <TaskModal isVisible={isVisible} 
            isUpdate={isUpdate} 
            onCancel={ () => { setVisible(false); setUpdate(false) }}
            onCreate={ (task) => { setVisible(false); onCreate(task); }}
            onUpdate={ (task) => { setVisible(false); onUpdate(task); }}
            task={selectedTask} />
        
        <button type="button" 
            className="btn btn-primary mt-1"
            onClick={() => { setSelectedTask(undefined); setUpdate(false); setVisible(true); }}>New Task</button>
        </>
    )
}

interface TaskModalProps {
    isUpdate: boolean;
    isVisible: boolean;
    onCancel: () => void;
    onCreate: (task:Task) => void;
    onUpdate: (task:Task) => void;
    task?: Task;
}
const TaskModal = ({isUpdate, isVisible, onCancel, onCreate, onUpdate, task}:TaskModalProps) => {
    const onSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        if (form.checkValidity() === true) {
            const data = Object.fromEntries(new FormData(event.currentTarget));
            const t: Task = {
                id: task?.id,
                title: data.title.toString(),
                description: data.description.toString(),
                completed: (data.completed) ? true : false,
            }

            if (isUpdate) {
                onUpdate(t);
            } else {
                onCreate(t);
            }
        }
    }

    return (
        <>
        <div>
            <Modal show={isVisible}>
                <Form noValidate validated={true} onSubmit={onSubmit}>
                    <ModalHeader>
                        <ModalTitle>{isUpdate ? 'Update' : 'Create'} Task</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <FormLabel>Title:</FormLabel>
                            <FormControl required type="text" name="title" defaultValue={task?.title} />
                        </FormGroup>
                        <FormGroup controlId="description">
                            <FormLabel>Description:</FormLabel>
                            <FormControl required type="area" name="description" defaultValue={task?.description} />
                        </FormGroup>
                        { isUpdate && (
                            <FormGroup controlId="completed">
                                <FormLabel>Completed:</FormLabel>
                                <FormCheck type="checkbox" 
                                    name="completed" 
                                    defaultChecked={task?.completed} />
                            </FormGroup>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                        <Button variant="primary" type="submit">Submit</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </div>
        </>
    )
}
