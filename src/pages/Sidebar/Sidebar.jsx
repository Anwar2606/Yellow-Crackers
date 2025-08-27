import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import {
  FaHome, FaEye, FaEdit, FaFileInvoice, FaArrowAltCircleRight,
  FaArrowCircleLeft, FaChevronDown, FaChevronUp
} from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { TbListNumbers } from "react-icons/tb";
import { HiOutlineDocumentCheck, HiOutlineDocumentText } from "react-icons/hi2";
import { IoIosPerson } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { GrDocumentPdf } from "react-icons/gr";
import { IoDocumentTextOutline } from "react-icons/io5";
import Logo from "../assets/PCW.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isBillsOpen, setIsBillsOpen] = useState(false);
  const [isBillsOpen2, setIsBillsOpen2] = useState(false);

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <ul>
        <li className="sidebar-header">
          {isOpen ? (
            'Yellow Crackers'
          ) : (
            <img src={Logo} alt="PCW Logo" className="collapsed-logo" />
          )}
        </li>

        <li><Link to="/newhome"><FaHome /> {isOpen && <span>Home</span>}</Link></li>
        <li><Link to="/products"><AiFillProduct /> {isOpen && <span>Products</span>}</Link></li>

        <li onClick={() => setIsBillsOpen(!isBillsOpen)} className="submenu-toggle">
          <FaEye /> {isOpen && <span>All Bills {isBillsOpen ? <FaChevronUp /> : <FaChevronDown />}</span>}
        </li>
        {isBillsOpen && isOpen && (
          <ul className="submenu">
            {/* <li><Link to="/wholesalecopy"><GrDocumentPdf /> Whole Sale Copy</Link></li> */}
            {/* <li><Link to="/retailcopy"><IoDocumentTextOutline /> Retail Copy</Link></li> */}
            <li><Link to="/invoicecopy"><HiOutlineDocumentText /> Invoice Copy</Link></li>
            <li><Link to="/waybillcopy"><HiOutlineDocumentCheck /> Way Bill Copy</Link></li>
          </ul>
        )}

        <li onClick={() => setIsBillsOpen2(!isBillsOpen2)} className="submenu-toggle">
          <FaEdit /> {isOpen && <span>Edit Bills {isBillsOpen2 ? <FaChevronUp /> : <FaChevronDown />}</span>}
        </li>
        {isBillsOpen2 && isOpen && (
          <ul className="submenu">
            {/* <li><Link to="/wholesaleeditbill"><GrDocumentPdf /> Wholesale Copy</Link></li> */}
            {/* <li><Link to="/retaileditbill"><IoDocumentTextOutline /> Retail Copy</Link></li> */}
            <li><Link to="/invoiceeditbill"><HiOutlineDocumentText /> Invoice Copy</Link></li>
            <li><Link to="/waybilleditbill"><HiOutlineDocumentCheck /> Way Bill Copy</Link></li>
          </ul>
        )}

        {/* <li><Link to="/wholesalebill"><GrDocumentPdf />{isOpen && <span>Whole Sale Bill</span>}</Link></li> */}
        {/* <li><Link to="/retailcalculator"><IoDocumentTextOutline />{isOpen && <span>Retail Bill</span>}</Link></li> */}
        <li><Link to="/invoicebill"><HiOutlineDocumentText />{isOpen && <span>Invoice</span>}</Link></li>
        <li><Link to="/waybill"><HiOutlineDocumentCheck />{isOpen && <span>Way Bill</span>}</Link></li>
        <li><Link to="/showcustomers"><IoIosPerson /> {isOpen && <span>Customers</span>}</Link></li>
        <li><Link to="/invoice"><TbListNumbers />{isOpen && <span>Invoice Numbers</span>}</Link></li>
        <li><Link to="/"><MdLogout /> {isOpen && <span>Logout</span>}</Link></li>

        {/* <li className="toggle-button">
          <button onClick={toggleSidebar}>
            {isOpen ? <FaArrowCircleLeft /> : <FaArrowAltCircleRight />}
          </button>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
