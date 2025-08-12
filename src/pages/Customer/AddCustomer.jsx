import React, { useState } from "react";
import { db } from "../../pages/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { FaHome, FaEye, FaEdit, FaFileInvoice, FaArrowCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { TbListNumbers } from "react-icons/tb";
import { MdLogout } from "react-icons/md";
import Logo from "../assets/PCW.png"; // Adjust the path as per your project
import { IoIosPerson } from "react-icons/io";
import Sidebar from "../Sidebar/Sidebar";

const AddCustomer = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar state
  const [customerDetails, setCustomerDetails] = useState({
    customerName: "",
    customerAddress: "",
    customerState: "",
    customerPhoneNo: "",
    customerGSTIN: "",
    customerPan: "",
    customerEmail: "",
  });

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "customer"), customerDetails);
      alert("Customer added successfully!");
      setCustomerDetails({
        customerName: "",
        customerAddress: "",
        customerState: "",
        customerPhoneNo: "",
        customerGSTIN: "",
        customerPan: "",
        customerEmail: "",
      });
    } catch (error) {
      console.error("Error adding customer: ", error);
      alert("Failed to add customer!");
    }
  };

  return (
    <div className="main-container">
      {/* Sidebar */}
     <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="content" style={{position:"relative",top:"60px"}}>
        <div className="Edit-page">
          <h2 className="Page-title">Add Customer</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="customerName"
                value={customerDetails.customerName}
                onChange={handleChange}
                className="Edit-input1"
                
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="customerAddress"
                value={customerDetails.customerAddress}
                onChange={handleChange}
                className="Edit-input1"
                
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="customerState"
                value={customerDetails.customerState}
                onChange={handleChange}
                className="Edit-input1"
                
              />
            </label>
            <label>
              Phone No:
              <input
                type="text"
                name="customerPhoneNo"
                value={customerDetails.customerPhoneNo}
                onChange={handleChange}
                className="Edit-input1"
                
              />
            </label>
            <label>
              GSTIN:
              <input
                type="text"
                name="customerGSTIN"
                value={customerDetails.customerGSTIN}
                onChange={handleChange}
                className="Edit-input2"
              />
            </label>
            <label>
              PAN:
              <input
                type="text"
                name="customerPan"
                value={customerDetails.customerPan}
                onChange={handleChange}
                className="Edit-input2"
              />
            </label>
            <label>
              Email:
              <input
                type="text"
                name="customerEmail"
                value={customerDetails.customerEmail}
                onChange={handleChange}
                className="Edit-input2"
              />
            </label>
            <div>
              <button type="submit" className="Edit-btn">
                Add Customer
              </button>
              <button
                type="button"
                className="Edit-btn"
                onClick={() => {
                  setCustomerDetails({
                    customerName: "",
                    customerAddress: "",
                    customerState: "",
                    customerPhoneNo: "",
                    customerGSTIN: "",
                    customerPan: "",
                    customerEmail: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
