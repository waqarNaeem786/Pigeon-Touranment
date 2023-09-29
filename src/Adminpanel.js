import React, { useState, useEffect } from 'react';
import {
    db,
    addDoc,
    collection,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
} from './firebase'; // Import Firebase-related functions and components

export default function Adminpanel() {
    const [inputValue, setInputValue] = useState('');
    const [timeValue, setTimeValue] = useState('');
    const [pigeonCount, setPigeonCount] = useState('');
    const [dateValue, setDateValue] = useState(''); // State for the date field
    const [data, setData] = useState([]);
    const [editItemId, setEditItemId] = useState(null); // Track the item being edited
    const [ascendingOrder, setAscendingOrder] = useState(true); // Sort order

    const handleNameChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleTimeChange = (e) => {
        setTimeValue(e.target.value);
    };

    const handlePigeonCountChange = (e) => {
        setPigeonCount(e.target.value);
    };

    const handleDateChange = (e) => {
        setDateValue(e.target.value);
    };

    const sendDataToFirestore = async () => {
        if (!inputValue || !timeValue || !pigeonCount || !dateValue) {
            alert('All fields must be filled out.');
            return;
        }

        try {
            if (editItemId) {
                // If editing, update the existing document
                await updateDoc(doc(db, 'userData', editItemId), {
                    name: inputValue,
                    time: timeValue,
                    pigeonCount: pigeonCount,
                    date: dateValue, // Include the date in the update
                });
                setEditItemId(null); // Clear edit state
            } else {
                // If not editing, add a new document
                await addDoc(collection(db, 'userData'), {
                    name: inputValue,
                    time: timeValue,
                    pigeonCount: pigeonCount,
                    date: dateValue, // Include the date when adding
                });
            }

            setInputValue('');
            setTimeValue('');
            setPigeonCount('');
            setDateValue('');

            // Fetch updated data
            fetchData();
        } catch (error) {
            console.error('Error adding/updating data: ', error);
        }
    };

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'userData'));
            const docs = [];
            querySnapshot.forEach((doc) => {
                docs.push({ id: doc.id, ...doc.data() });
            });

            // Sort data based on the current sort order and time field
            docs.sort((a, b) => {
                const aTime = parseInt(a.time);
                const bTime = parseInt(b.time);
                return ascendingOrder ? aTime - bTime : bTime - aTime;
            });

            // Add serial numbers
            const dataWithSerialNumbers = docs.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));

            setData(dataWithSerialNumbers);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (id, name, time, pigeonCount, date) => {
        setEditItemId(id);
        setInputValue(name);
        setTimeValue(time);
        setPigeonCount(pigeonCount);
        setDateValue(date);
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

                            {/* Add the date input field */}
                            <div className="form-group">
                                <label htmlFor="date">Date</label>
                                <input
                                    type="text"
                                    id="date"
                                    className="form-control"
                                    value={dateValue}
                                    onChange={handleDateChange}
                                />
                            </div>

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
                            <button
                                className="btn btn-primary"
                                onClick={sendDataToFirestore}
                            >
                                {editItemId ? 'Update' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Serial No</th>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Pigeons</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.serialNumber}</td>
                                    <td>{item.date}</td>
                                    <td>{item.name}</td>
                                    <td>{item.pigeonCount}</td>
                                    <td>{item.time}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm mr-2"
                                            onClick={() =>
                                                handleEdit(
                                                    item.id,
                                                    item.name,
                                                    item.time,
                                                    item.pigeonCount,
                                                    item.date
                                                )
                                            }
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
