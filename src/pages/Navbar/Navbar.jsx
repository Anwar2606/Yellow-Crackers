import React from 'react';
import { Link } from 'react-router-dom';
// import Logo from '../assets/PCW.png';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-title"><Link to="/home" ></Link>
          
        </h1>
      <ul className="navbar-list">
     
         <li className="navbar-item">
          <Link to="/newhome" className="navbar-link">Dashboard</Link>
        </li>
        <li className="navbar-item">
          <Link to="/allbills" className="navbar-link">All Bills</Link>
        </li>
        <li className="navbar-item">
          <Link to="/editbill" className="navbar-link">Edit Bills</Link>
        </li>
        <li className="navbar-item">
          <Link to="/showcustomers" className="navbar-link">Customers</Link>
        </li>
         <li className="navbar-item">
          <Link to="/wholesalebill" className="navbar-link">Wholesale Bill</Link>
        </li>
         <li className="navbar-item">
          <Link to="/retailcalculator" className="navbar-link">Retail Bill</Link>
        </li>
         <li className="navbar-item">
          <Link to="/invoicebill" className="navbar-link">Invoice</Link>
        </li>
         <li className="navbar-item">
          <Link to="/waybill" className="navbar-link">Way Bill</Link>
        </li>
        <li className="navbar-item">
          <Link to="/invoice" className="navbar-link">Invoice Number</Link>
        </li>
        
        <li className="navbar-item">
          <Link to="/products" className="navbar-link">Products</Link>
        </li>
        
        {/* <li className="navbar-item">
          <Link to="/multipleproducts" className="navbar-link">Add MultipleProducts</Link>
        </li> */}
       
      </ul>
    </nav>
  );
};

export default Navbar;
