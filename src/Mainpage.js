import React, { useState, useEffect } from 'react';
import { db, collection, getDocs } from './firebase'; // Import Firebase related functions and components
import { Carousel } from 'react-responsive-carousel'; // Import Carousel component and styles
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import Carousel styles
import image1 from "./image1.jpeg";
import image2 from "./image2.jpeg";

function MainPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch data from Firestore 'userData' collection
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'userData'));
                const docs = [];
                querySnapshot.forEach((doc) => {
                    docs.push(doc.data());
                });
                setData(docs);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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

            {/* Table to display Firestore data */}
            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Pigeon Count</th> {/* Update the column header here */}
                                <th>Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.pigeonCount}</td> {/* Update the property name here */}
                                    <td>{item.time}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
