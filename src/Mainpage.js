import React, { useState, useEffect } from 'react';
import { db, collection, getDocs } from './firebase'; // Import Firebase related functions and components
import { Carousel } from 'react-responsive-carousel'; // Import Carousel component and styles
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import Carousel styles
import image1 from "./image1.jpeg";
import image2 from "./image2.jpeg";

function MainPage() {
    const [data, setData] = useState({});
    const [firstPosition, setFirstPosition] = useState(null);

    useEffect(() => {
        // Fetch data from Firestore 'userData' collection
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'userData'));
                const docs = [];
                querySnapshot.forEach((doc) => {
                    docs.push(doc.data());
                });

                // Group data by date
                const groupedData = {};
                docs.forEach((item) => {
                    const date = item.date;
                    if (!groupedData[date]) {
                        groupedData[date] = [];
                    }
                    groupedData[date].push(item);
                });

                // Find the first position holder (highest time)
                let highestTime = '0';
                let highestTimeName = '';
                Object.keys(groupedData).forEach((date) => {
                    groupedData[date].sort((a, b) => {
                        // Compare time values including the values on both sides of the period
                        return b.time.localeCompare(a.time);
                    });
                    if (groupedData[date][0]) {
                        if (groupedData[date][0].time.localeCompare(highestTime) > 0) {
                            highestTime = groupedData[date][0].time;
                            highestTimeName = groupedData[date][0].name;
                        }
                    }
                });

                setFirstPosition(highestTimeName);
                setData(groupedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Run this effect only once

    return (
        <div className="container mt-4">
            {/* Image Slider */}
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <Carousel autoPlay infiniteLoop>
                        <div>
                            <img src={image1} alt="" className="img-fluid" />
                        </div>
                        <div>
                            <img src={image2} alt="" className="img-fluid" />
                        </div>
                        {/* Add more images here */}
                    </Carousel>
                </div>
            </div>

            {/* Display the first position holder */}
            {firstPosition && (
                <div className="row mt-4">
                    <div className="col-md-12 text-center">
                        <h3 className="text-primary">
                            First Position: {firstPosition}
                        </h3>
                    </div>
                </div>
            )}

            {/* Display tables for each date */}
            {Object.keys(data).map((date, index) => (
                <div className="row mt-4" key={index}>
                    <div className="col-md-12">
                        <h3>{date}</h3>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Serial No</th>
                                        <th>Name</th>
                                        <th>Pigeon Count</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data[date].map((item, subIndex) => (
                                        <tr key={subIndex}>
                                            <td>{subIndex + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.pigeonCount}</td>
                                            <td>{item.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MainPage;
