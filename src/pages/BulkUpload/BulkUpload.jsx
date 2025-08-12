// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { db, storage } from "../firebase";
// import { collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import "./BulkUpload.css"; 

// const BulkUpload = () => {
//   const [products, setProducts] = useState([]);
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("");
//   const [dragging, setDragging] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setFile(file);
//     setFileName(file.name);
//   };

//   const handleFileUpload = () => {
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const fileData = event.target.result;
//       const workbook = XLSX.read(fileData, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//       setProducts(worksheet);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const productCollection = collection(db, "products");

//     for (const product of products) {
//       if (!product.name || !product.saleprice || !product.regularprice) {
//         console.error("Missing field(s) in product: ", product);
//         continue;
//       }
//       const productData = {
//         sno:product.sno,
//         name: product.name.trim(),
//         saleprice: parseFloat(product.saleprice),
//         regularprice: parseInt(product.regularprice),
//         category:product.category
        
//       };
//       if (isNaN(productData.saleprice) || isNaN(productData.regularprice)) {
//         console.error("Invalid price or quantity for product:", product);
//         continue;
//       }
//       try {
//         await addDoc(productCollection, productData);
//       } catch (error) {
//         console.error("Error adding document: ", error);
//       }
//     }
//     setProducts([]);
//     setFileName("");
//     setUploadProgress(0);
//   };
//   const handleDragOver = (event) => {
//     event.preventDefault();
//     setDragging(true);
//   };
//   const handleDragLeave = () => {
//     setDragging(false);
//   };
//   const handleDrop = (event) => {
//     event.preventDefault();
//     setDragging(false);
//     const file = event.dataTransfer.files[0];
//     setFile(file);
//     setFileName(file.name);
//   };
//   return (
//     <div className="container">
//       <h1 className="header">Bulk Upload Products</h1>
//       <form onSubmit={handleSubmit}>
//         <div
//           className={`file-drop-zone ${dragging ? "dragging" : ""}`}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//         >
//           <label htmlFor="fileUpload" className="file-label">
//             Drag and drop a file here, or click to select a file
//           </label>
//           <input
//             id="fileUpload"
//             type="file"
//             accept=".csv, .xlsx, .xls"
//             onChange={handleFileChange}
//             style={{ display: "none" }}
//           />
//           {fileName && <p className="file-name">{fileName}</p>}
//         </div><br></br>
//         <div className="buttons">
//           <button className="btn" type="button" onClick={handleFileUpload}>
//             Upload File
//           </button>
//           <button className="btn" type="submit">Submit to Firestore</button>
//         </div>
//         {uploadProgress > 0 && (
//           <div className="progress-bar">
//             <div
//               className="progress-bar-fill"
//               style={{ width: `${uploadProgress}%` }}
//             ></div>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default BulkUpload;
// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { db, storage } from "../firebase";
// import { collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import "./BulkUpload.css"; 

// const BulkUpload = () => {
//   const [products, setProducts] = useState([]);
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("");
//   const [dragging, setDragging] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setFile(file);
//     setFileName(file.name);
//   };

//   const handleFileUpload = () => {
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const fileData = event.target.result;
//       const workbook = XLSX.read(fileData, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//       setProducts(worksheet);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const productCollection = collection(db, "products");

//     for (const product of products) {
//       // Check if the required fields are present
//       if (!product.name || !product.saleprice || !product.regularprice ) {
//         console.error("Missing field(s) in product: ", product);
//         continue;
//       }

//       const productData = {
//         sno: product.sno,
//         name: product.name.trim(),
//         saleprice: parseFloat(product.saleprice),
//         regularprice: parseInt(product.regularprice),
//         category: product.category,
//         inStock: product.inStock === "false" || product.inStock === true // Ensures a boolean value
//       };

//       // Validate saleprice and regularprice
//       if (isNaN(productData.saleprice) || isNaN(productData.regularprice)) {
//         console.error("Invalid price or quantity for product:", product);
//         continue;
//       }

//       try {
//         await addDoc(productCollection, productData);
//       } catch (error) {
//         console.error("Error adding document: ", error);
//       }
//     }

//     setProducts([]);
//     setFileName("");
//     setUploadProgress(0);
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     setDragging(true);
//   };

//   const handleDragLeave = () => {
//     setDragging(false);
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     setDragging(false);
//     const file = event.dataTransfer.files[0];
//     setFile(file);
//     setFileName(file.name);
//   };

//   return (
//     <div className="container">
//       <h1 className="header">Bulk Upload Products</h1>
//       <form onSubmit={handleSubmit}>
//         <div
//           className={`file-drop-zone ${dragging ? "dragging" : ""}`}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//         >
//           <label htmlFor="fileUpload" className="file-label">
//             Drag and drop a file here, or click to select a file
//           </label>
//           <input
//             id="fileUpload"
//             type="file"
//             accept=".csv, .xlsx, .xls"
//             onChange={handleFileChange}
//             style={{ display: "none" }}
//           />
//           {fileName && <p className="file-name">{fileName}</p>}
//         </div>
//         <br />
//         <div className="buttons">
//           <button className="btn" type="button" onClick={handleFileUpload}>
//             Upload File
//           </button>
//           <button className="btn" type="submit">Submit to Firestore</button>
//         </div>
//         {uploadProgress > 0 && (
//           <div className="progress-bar">
//             <div
//               className="progress-bar-fill"
//               style={{ width: `${uploadProgress}%` }}
//             ></div>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default BulkUpload;
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  FaHome, FaInfoCircle, FaServicestack, FaEnvelope,
  FaArrowAltCircleRight, FaArrowCircleLeft, FaEye,
  FaEdit, FaFileInvoice
} from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import Logo from "../assets/PCW.png";
import "./BulkUpload.css";
import { TbListNumbers } from "react-icons/tb";
import { IoIosPerson } from "react-icons/io";
import Sidebar from "../Sidebar/Sidebar";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BulkUpload = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      toast.warning("Please select a file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileData = event.target.result;
        const workbook = XLSX.read(fileData, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

        const requiredHeaders = ["sno", "name", "saleprice", "regularprice", "category", "inStock", "bill"];
        const fileHeaders = Object.keys(worksheet[0] || {});
        const missingHeaders = requiredHeaders.filter(header => !fileHeaders.includes(header));

        if (missingHeaders.length > 0) {
          toast.error(`Missing required columns: ${missingHeaders.join(", ")}`);
          return;
        }

        setProducts(worksheet);
        toast.success("File uploaded and parsed successfully.");
      } catch (error) {
        console.error("Error reading file:", error);
        toast.error("There was an error reading the file. Please ensure it's a valid Excel file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (products.length === 0) {
      toast.warning("No products to submit. Please upload a file first.");
      return;
    }

    const productCollection = collection(db, "products");
    const errors = [];

    const toastId = toast.loading("Uploading products...");

    for (const [index, product] of products.entries()) {
      if (
        !product.name ||
        product.saleprice === undefined ||
        product.quantity === undefined ||
        product.regularprice === undefined ||
        product.inStock === undefined ||
        product.bill === undefined
      ) {
        errors.push(`Row ${index + 2}: Missing required field(s).`);
        continue;
      }

      const saleprice = parseFloat(product.saleprice);
      const regularprice = parseInt(product.regularprice, 10);
      const bill = product.bill;
      const inStock = product.inStock === "true" || product.inStock > 0;

      if (isNaN(saleprice) || isNaN(regularprice)) {
        errors.push(`Row ${index + 2}: Invalid saleprice or regularprice.`);
        continue;
      }

      const productData = {
        sno: product.sno || "",
        name: product.name.trim(),
        saleprice,
        regularprice,
        category: product.category || "Uncategorized",
        inStock,
        quantity: product.quantity,
        bill
      };

      try {
        await addDoc(productCollection, productData);
        const progress = Math.round(((index + 1) / products.length) * 100);
        setUploadProgress(progress);
      } catch (error) {
        console.error(`Row ${index + 2}: Error adding document:`, error);
        errors.push(`Row ${index + 2}: Failed to add to Firestore.`);
      }
    }

    setProducts([]);
    setFileName("");
    setFile(null);
    setUploadProgress(0);

    if (errors.length > 0) {
      setErrorMessages(errors);
      toast.update(toastId, {
        render: "Upload completed with some errors.",
        type: "warning",
        isLoading: false,
        autoClose: 4000,
      });
    } else {
      toast.update(toastId, {
        render: "All products uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  return (
    <div className="main-container">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="container">
        <h1 className="header">Bulk Upload Products</h1>
        <form onSubmit={handleSubmit}>
          <div
            className={`file-drop-zone ${dragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label htmlFor="fileUpload" className="file-label">
              Drag and drop a file here, or click to select a file
            </label>
            <input
              id="fileUpload"
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {fileName && <p className="file-name">{fileName}</p>}
          </div>
          <br />
          <div className="buttons">
            <button className="btn" type="button" onClick={handleFileUpload}>
              Upload File
            </button>
            <button className="btn" type="submit">
              Submit to Firestore
            </button>
          </div>

          {uploadProgress > 0 && (
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {errorMessages.length > 0 && (
            <div className="error-messages">
              <h3>Errors:</h3>
              <ul>
                {errorMessages.map((msg, idx) => (
                  <li key={idx} style={{ color: "red" }}>
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default BulkUpload;

