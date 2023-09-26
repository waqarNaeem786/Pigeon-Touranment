import React, { useState, useEffect } from 'react';
import { db, addDoc, collection, getDocs, doc, deleteDoc, updateDoc } from './firebase';

export default function Adminpanel() {
    const [inputValue, setInputValue] = useState('');
    const [timeValue, setTimeValue] = useState('');
    const [pigeonCount, setPigeonCount] = useState('');
    const [data, setData] = useState([]);
    const [editItemId, setEditItemId] = useState(null); // Track the item being edited

    const handleNameChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleTimeChange = (e) => {
        setTimeValue(e.target.value);
    }

    const handlePigeonCountChange = (e) => {
        setPigeonCount(e.target.value);
    }

    const sendDataToFirestore = async () => {
        if (!inputValue || !timeValue || !pigeonCount) {
            alert("All fields must be filled out.");
            return;
        }

        try {
            if (editItemId) {
                // If editing, update the existing document
                await updateDoc(doc(db, 'userData', editItemId), {
                    name: inputValue,
                    time: timeValue,
                    pigeonCount: pigeonCount,
                });
                setEditItemId(null); // Clear edit state
            } else {
                // If not editing, add a new document
                await addDoc(collection(db, 'userData'), {
                    name: inputValue,
                    time: timeValue,
                    pigeonCount: pigeonCount,
                });
            }

            setInputValue('');
            setTimeValue('');
            setPigeonCount('');

            // Fetch updated data
            fetchData();
        } catch (error) {
            console.error("Error adding/updating data: ", error);
        }
    };

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'userData'));
            const docs = [];
            querySnapshot.forEach((doc) => {
                docs.push({ id: doc.id, ...doc.data() });
            });
            // Sort data by time in descending order (users with most time first)
            docs.sort((a, b) => b.time - a.time);
            setData(docs);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (id, name, time, pigeonCount) => {
        setEditItemId(id);
        setInputValue(name);
        setTimeValue(time);
        setPigeonCount(pigeonCount);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'userData', id));
            fetchData(); // Fetch updated data after deletion
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Add/Edit Data</h2>
                            <div className="form-group">
                                <label htmlFor="userName">Name</label>
                                <input
                                    type="text"
                                    id="userName"
                                    className="form-control"
                                    value={inputValue}
                                    onChange={handleNameChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="time">Time</label>
                                <input
                                    type="text"
                                    id="time"
                                    className="form-control"
                                    value={timeValue}
                                    onChange={handleTimeChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pigeonCount">Pigeon Count</label>
                                <input
                                    type="number"
                                    id="pigeonCount"
                                    className="form-control"
                                    value={pigeonCount}
                                    onChange={handlePigeonCountChange}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={sendDataToFirestore}>
                                {editItemId ? 'Update' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Pigeons</th>
                            <th>Time</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.pigeonCount}</td>
                                <td>{item.time}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm mr-2"
                                        onClick={() => handleEdit(item.id, item.name, item.time, item.pigeonCount)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
