// src/pages/AllBillsPage.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path if needed
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaDownload, FaPrint, FaShareAlt, FaTrash, FaTruck } from 'react-icons/fa';
import Logo from "../assets/PCW.png";
import { format, isValid, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { FaHome, FaEye, FaEdit, FaFileInvoice, FaArrowCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import { AiFillProduct } from 'react-icons/ai';
import { MdLogout } from 'react-icons/md';
import { TbListNumbers } from 'react-icons/tb';
import { IoIosPerson } from 'react-icons/io';
import Sidebar from '../Sidebar/Sidebar';

const WayBillCopy = (bill) => {
  const [bills, setBills] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedBillType, setSelectedBillType] = useState('');
  const [filteredBills, setFilteredBills] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const sortedBills = bills.sort((a, b) => {
    const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
    const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
    return dateB - dateA; // Sort descending by date
  });
const handleBillTypeChange = async (value) => {
  setSelectedBillType(value);
  let collectionName = '';

  // Map dropdown value to Firestore collection
 

  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBills(data);
  } catch (error) {
    console.error('Error fetching bills:', error);
  }
};
useEffect(() => {
  if (selectedDate) {
    const filtered = bills.filter(bill => {
      const createdAt = bill.createdAt instanceof Timestamp
        ? bill.createdAt.toDate()
        : new Date(bill.createdAt);
      return createdAt.toISOString().split('T')[0] === selectedDate;
    });
    setFilteredBills(filtered);
  } else {
    setFilteredBills(bills);
  }
}, [selectedDate, bills]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        // Fetch bills from 'billing' collection
        const billingSnapshot = await getDocs(collection(db, 'waybilling'));
        const billingData = billingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch bills from 'customerBilling' collection
        // const customerBillingSnapshot = await getDocs(collection(db, 'customerBilling'));
        // const customerBillingData = customerBillingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Combine both collections
        const allBills = [...billingData];
        
        setBills(allBills);
      } catch (error) {
        console.error('Error fetching bills: ', error);
      }
    };

    fetchBills();
  }, []);

// const filteredBills = sortedBills.filter((bill) => {
//   const billDate = bill.createdAt instanceof Timestamp ? bill.createdAt.toDate().toLocaleDateString() : new Date(bill.createdAt).toLocaleDateString();
//   return selectedDate ? billDate === new Date(selectedDate).toLocaleDateString() : true;
// });
const toggleSidebar = () => {
  setIsOpen(!isOpen);
};
const formatDate = (createdAt) => {
  let createdAtDate;

  // Convert createdAt to a Date object
  if (createdAt instanceof Timestamp) {
    createdAtDate = createdAt.toDate();
  } else if (typeof createdAt === 'string' || createdAt instanceof Date) {
    createdAtDate = new Date(createdAt);
  } else {
    return 'Invalid Date'; // Handle cases where createdAt is not valid
  }

  // Format the date as 'MM/DD/YYYY' or any desired format
  return !isNaN(createdAtDate.getTime())
    ? createdAtDate.toLocaleDateString() // Returns only the date portion (e.g., "8/27/2024")
    : 'Invalid Date';
};  
const generatePDF = async (detail, copyType, billType) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const borderMargin = 10;

  const drawPageBorder = () => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(borderMargin, borderMargin, pageWidth - 2 * borderMargin, pageHeight - 2 * borderMargin);
  };

  const formattedDate = formatDate(detail.createdAt);
  const clean = (val) => (val === undefined ? '' : val);
  const {
    customerName,
    customerAddress,
    customerEmail,
    customerState,
    customerPhoneNo,
    customerGSTIN,
    customerPan,
    despatchedFrom,
    despatchedTo,
    transportName
  } = detail;
 
  let headerTableStartY = 12;
let headerTableEndY = 0; // Will be set dynamically


doc.autoTable({
  body: [
    ['GKM TRADERS', '', 'TAX INVOICE'],
    ['Address:1/400 North Street M Duraisamypuram', '', `Invoice Number: ${detail.invoiceNumber}`],
    ['Mamsapuram (po)', '', `Date: ${formattedDate}`],
    ['Sivakasi (TK)', '', 'GSTIN : 33AAZFG9211C1ZD'],
    ['Virudhunagar - 626124', '', ''],
    ['State: 33-Tamil Nadu', '', ''],
    ['Phone number: 8072973721', '', '']
  ],
  startY: headerTableStartY,
  theme: 'plain',
  styles: { fontSize: 9 },
  margin: { left: 14, right: 14 },
  columnStyles: {
    0: { fontStyle: 'bold', cellWidth: 80 },
    1: { cellWidth: 37 },
    2: { fontStyle: 'bold', halign: 'right', cellWidth: 60 }
  },
  didParseCell: function (data) {
    if (data.row.index === 0) {
      data.cell.styles.textColor = [255, 0, 0];
      data.cell.styles.fontSize = 11;
      data.cell.styles.fontStyle = 'bold';
    }
  },
  didDrawPage: drawPageBorder,
  didDrawCell: function (data) {
    // Set end Y on the last actual row
    const lastRowIndex = 6; // your table has 7 rows, so last index is 6
    const lastColIndex = 2;
    if (data.row.index === lastRowIndex && data.column.index === lastColIndex) {
      headerTableEndY = data.cell.y + data.cell.height;
    }
  }
});

// ✅ Draw rectangle around the whole table
doc.setDrawColor(0);
doc.setLineWidth(0.2);
doc.rect(14, headerTableStartY, pageWidth - 28, headerTableEndY - headerTableStartY);


  let startY = doc.autoTable.previous?.finalY + 5 || 70;

// Row 1: Name, Address, State
const row1 = [
  customerName ? `Name: ${customerName}` : null,
  customerAddress ? `Address: ${customerAddress}` : null,
  customerState ? `State: ${customerState}` : null,
].filter(Boolean).map(item => ({ content: item }));

// Row 2: Phone, GSTIN, PAN
const row2 = [
  customerPhoneNo ? `Phone: ${customerPhoneNo}` : null,
  customerGSTIN ? `GSTIN: ${customerGSTIN}` : null,
  customerPan ? `PAN: ${customerPan}` : null,
].filter(Boolean).map(item => ({ content: item }));

// Combine into final table body
const customerDetails = [];

// ✅ Add 'TO' as the first row
customerDetails.push([
  { content: 'TO', styles: { textColor:"#d30466" ,fontStyle: 'bold', fontSize: 15 } },
  { content: '' }, // 2nd column empty
  { content: '' }  // 3rd column empty
]);


if (row1.length > 0) customerDetails.push(row1);
if (row2.length > 0) customerDetails.push(row2);

const customerStartY = startY;

doc.autoTable({
  body: customerDetails,
  startY: customerStartY,
  theme: 'plain',
  styles: { fontSize: 8 },
  margin: { left: 15, right: 15 },
  didParseCell: function (data) {
    if (data.row.index === 0) {
      data.cell.styles.fontSize = 11;
    }
  }
});

// Draw surrounding rectangle
const customerEndY = doc.autoTable.previous.finalY;
doc.setDrawColor(0);
doc.setLineWidth(0.1);
doc.rect(14, customerStartY - 2, 182, customerEndY - customerStartY + 2);


const productList = detail.productDetails || detail.productsDetails || [];

if (productList.length === 0) {
console.warn("⚠️ No products found in detail object:", detail);
}

const productTableBody = detail.productsDetails.map((item, index) => [
  (index + 1).toString(), // S.No
  item.name || 'N/A',
  '36041000',
  item.quantity?.toString() || '0',
  `Rs.${item.saleprice?.toFixed(2) || '0.00'}`,
  `Rs.${((item.quantity || 0) * (item.saleprice || 0)).toFixed(2)}`
]);

const totalQuantity = detail.productsDetails.reduce((acc, item) => acc + (item.quantity || 0), 0);
const totalProducts = detail.productsDetails.length;

const totalAmount = `Rs.${detail.totalAmount?.toFixed(2) || '0.00'}`;
const discountedAmount = `Rs.${detail.discountedTotal?.toFixed(2) || '0.00'}`;
const grandTotal = `Rs.${detail.grandTotal?.toFixed(2) || '0.00'}`;

// Push Totals
productTableBody.push(
  [
    { content: 'Total Amount', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
    totalAmount
  ],
  [
    { content: 'Discounted Amount', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
    discountedAmount
  ]
);

// ✅ Conditionally Add CGST + SGST or IGST
if (detail.cgstAmount && detail.sgstAmount) {
  productTableBody.push(
    [
      { content: 'CGST (9%)', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
      `Rs.${detail.cgstAmount.toFixed(2)}`
    ],
    [
      { content: 'SGST (9%)', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
      `Rs.${detail.sgstAmount.toFixed(2)}`
    ]
  );
} else if (detail.igstAmount) {
  productTableBody.push(
    [
      { content: 'IGST (18%)', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
      `Rs.${detail.igstAmount.toFixed(2)}`
    ]
  );
}

// ✅ Now push Grand Total
productTableBody.push(
  [
    { content: 'Grand Total', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
    grandTotal
  ]
);

productTableBody.push(
  [
    { content: 'Total Products:', styles: { halign: 'right', fontStyle: 'bold' } },
    `${totalProducts}`,
    { content: 'Total Quantity:', colSpan: 1, styles: { halign: 'right', fontStyle: 'bold' } },
    `${totalQuantity}`,
    
  ]
);
// Despatch Info Rows
if (despatchedFrom) {
  productTableBody.push([
    { content: 'Despatched From:', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold', fillColor: '#fff' } },
    { content: despatchedFrom, colSpan: 4, styles: { fontStyle: 'normal', fillColor: '#fff' } }
  ]);
}

if (despatchedTo) {
  productTableBody.push([
    { content: 'Despatched To:', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold', fillColor: '#fff' } },
    { content: despatchedTo, colSpan: 4, styles: { fontStyle: 'normal', fillColor: '#fff' } }
  ]);
}

if (transportName) {
  productTableBody.push([
    { content: 'Transport Name:', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold', fillColor: '#fff' } },
    { content: transportName, colSpan: 4, styles: { fontStyle: 'normal', fillColor: '#fff' } }
  ]);
}

// Draw the full table
doc.autoTable({
  head: [['S.No', 'Product Name', 'HSN CODE', 'Quantity', 'Price', 'Total Amount']],
  body: productTableBody,
  startY: doc.autoTable.previous.finalY + 2,
  theme: 'grid',
  didDrawPage: drawPageBorder,
  headStyles: { fillColor: [255, 182, 193], textColor: [0, 0, 139], lineWidth: 0.2 },
  alternateRowStyles: { fillColor: [245, 245, 245] },
  styles: { fontSize: 10, lineColor: [0, 0, 0], fontColor:[0,0,0] },
   bodyStyles: {
    fillColor: [255, 255, 255],     // White background
    textColor: [0, 0, 0],           // Black text
    lineColor: [0, 0, 0],           // Black border
    lineWidth: 0.1                  // Border thickness for body
  },
  columnStyles: {
    0: { halign: 'center' }, // S.No
    1: { halign: 'left' },   // Product Name
    2: { halign: 'center' }, // HSN
    3: { halign: 'right' },  // Quantity
    4: { halign: 'right' },  // Price
    5: { halign: 'right' }   // Total
  }
}); 
 


  const numberToWords = require('number-to-words');
  const totalInWords = numberToWords.toWords(detail.grandTotal || 0);
  doc.autoTable({
    body: [[`Rupees: ${totalInWords.toUpperCase()}`]],
    startY: doc.autoTable.previous.finalY + 2,
    theme: 'plain',
    didDrawPage: drawPageBorder,
    styles: { fontSize: 10, fontStyle: 'bold', textColor: [0, 0, 139] },
    margin: { left: 15 }
  });

    const termsStartY = doc.autoTable.previous.finalY + 2;
  let termsEndY = 0;

  doc.autoTable({
    body: [
      ['Terms & Conditions'],
      ['1. Goods once sold will not be taken back.'],
      ['2. All matters subject to "Sivakasi" jurisdiction only.']
    ],
    startY: termsStartY,
    theme: 'plain',
    styles: { fontSize: 9 },
    margin: { left: 15 },
    didDrawCell: function (data) {
      if (data.row.index === 2 && data.column.index === 0) {
        termsEndY = data.cell.y + data.cell.height;
      }
    }
  });

  // Signature Row
  doc.autoTable({
    body: [['', '', 'Authorised Signature']],
    startY: doc.autoTable.previous.finalY + 2,
    theme: 'plain',
    styles: { fontSize: 10, fontStyle: 'bold' },
    columnStyles: {
      2: { halign: 'right' }
    },
    margin: { left: 15, right: 15 }
  });

  // Rectangle for Terms & Signature section
  doc.setDrawColor(0);
  doc.setLineWidth(0.2);
  doc.rect(15, termsStartY, pageWidth - 30, doc.autoTable.previous.finalY + 10 - termsStartY);
  const fileName = `WAY BILL-${detail.invoiceNumber}.pdf`;
  doc.save(fileName);
};



  const handleDownloadAllPdfs = async (detail) => {
    const copyTypes = ['Transport'];
    for (const copyType of copyTypes) {
      generatePDF(detail, copyType);
    }
  };
  const handleShare = async (bill) => {
    const pdfUrl = await generatePdfUrl(bill); // Ensure you have a function to generate and return the PDF URL.
    const shareData = {
      title: `Invoice #${bill.invoiceNumber}`,
      text: `Please find the attached invoice for ${bill.customerName}.`,
      url: pdfUrl,
    };
  
    // Use navigator.share if supported
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for WhatsApp and Gmail
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        `Invoice for ${bill.customerName} (₹${bill.totalAmount}): ${pdfUrl}`
      )}`;
      const gmailUrl = `mailto:?subject=${encodeURIComponent(
        `Invoice #${bill.invoiceNumber}`
      )}&body=${encodeURIComponent(
        `Please find the invoice for ${bill.customerName} (₹${bill.totalAmount}): ${pdfUrl}`
      )}`;
      
      const fallbackMessage = 'Sharing is not supported on this browser. Use WhatsApp or Gmail links.';
  
      // Prompt user to choose
      const userChoice = window.confirm(
        'Choose OK to share via WhatsApp or Cancel to share via Gmail.'
      );
  
      if (userChoice) {
        window.open(whatsappUrl, '_blank');
      } else {
        window.open(gmailUrl, '_blank');
      }
    }
  };
  
  // Mock function to generate a PDF URL
  const generatePdfUrl = async (bill) => {
    // Logic to generate PDF URL
    return `https://example.com/invoices/${bill.id}.pdf`;
  };
  const handlePrint = (bill) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<html><head><title>Invoice</title></head><body>${bill.invoiceNumber}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  const handleDelete = async (id) => {
    // Display confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this bill?");
  
    if (!isConfirmed) {
      return; // Exit if the user cancels
    }
  
    try {
      // Delete from 'billing' collection
      const billingDocRef = doc(db, 'wayBilling', id);
      await deleteDoc(billingDocRef);
  
      // Delete from 'customerBilling' collection
      const customerBillingDocRef = doc(db, 'customerBilling', id);
      await deleteDoc(customerBillingDocRef);
  
      // Update the state to remove the deleted bill from the UI
      setBills(prevBills => prevBills.filter(bill => bill.id !== id));
  
      console.log(`Document with id ${id} deleted from both billing and customerBilling collections.`);
    } catch (error) {
      console.error('Error deleting bill: ', error.message);
    }
  };
  
  
  return (
    <div className="main-container2">
      {/* Sidebar */}
     <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
  
      {/* Main Content */}
      <div className="content">
        <div className="all-bills-page">
          <h1>Way Bills</h1>
          <div className="date-filter">
          <label style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '10px' }}>
  Select Date:
  <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
  />
</label>

          </div>
          <table className="products-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Customer Name</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => {
                const createdAt = bill.createdAt instanceof Timestamp
                  ? bill.createdAt.toDate().toLocaleDateString()
                  : new Date(bill.createdAt).toLocaleDateString();
                return (
                  <tr key={bill.id}>
                    <td>{bill.invoiceNumber}</td>
                    <td>{bill.customerName}</td>
                    <td>₹{bill.totalAmount}</td>
                    <td>{createdAt}</td>
                    <td>
                      <FaDownload
                        className="download-icon"
                        onClick={() => handleDownloadAllPdfs(bill)}
                      />
                      <FaTrash
                        className="delete-icon"
                        onClick={() => handleDelete(bill.id)}
                      />
                       {/* <FaShareAlt
    className="share-icon"
    onClick={() => handleShare(bill)}
    style={{ cursor: 'pointer', marginLeft: '10px', color: '#1b73e8' }}
  />
   <FaPrint
                      className="print-icon"
                      onClick={() => handlePrint(bill)}
                      style={{ cursor: "pointer", marginLeft: "10px", color: "#ff5722" }}
                    /> */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  };

export default WayBillCopy;