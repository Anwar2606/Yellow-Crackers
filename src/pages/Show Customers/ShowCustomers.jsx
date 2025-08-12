import React, { useEffect, useState } from "react";
import { db } from "../../pages/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Sidebar from "../Sidebar/Sidebar";

const ShowCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "customer"));
        const customerList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customerList);
      } catch (error) {
        console.error("Error fetching customers: ", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "customer", id));
        setCustomers((prev) => prev.filter((customer) => customer.id !== id));
        alert("Customer deleted successfully.");
      } catch (error) {
        console.error("Error deleting customer: ", error);
        alert("Failed to delete customer.");
      }
    }
  };

  return (
    <div className="main-container2">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="content">
        <div className="all-bills-page">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1>Customer Details</h1>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#1b2594",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
              onClick={() => navigate("/addcustomer")}
            >
              Add Customer
            </button>
          </div>

          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>State</th>
                <th>Phone No</th>
                <th>GSTIN</th>
                <th>PAN</th>
                {/* <th>Email</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.customerName}</td>
                    <td>{customer.customerAddress}</td>
                    <td>{customer.customerState}</td>
                    <td>{customer.customerPhoneNo}</td>
                    <td>{customer.customerGSTIN}</td>
                    <td>{customer.customerPan}</td>
                    {/* <td>{customer.customerEmail}</td> */}
                    <td>
                      <button
                        onClick={() => navigate(`/editcustomer/${customer.id}`)}
                        style={{
                          backgroundColor: "#ffc107",
                          color: "black",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <MdDelete /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No customer data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShowCustomers;
