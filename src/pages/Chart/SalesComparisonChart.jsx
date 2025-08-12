import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./SalesComparisonChart.css";

const SalesComparisonChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [overallTotal, setOverallTotal] = useState(0);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "invoicebilling"));

        const monthlySales = Array(12).fill(0);
        let totalOfAllSales = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();

          // Validate totalAmount is a number
          const total = parseFloat(data?.totalAmount ?? 0);
          if (!isNaN(total) && total > 0) {
            totalOfAllSales += total;

            // Validate Firestore timestamp exists
            if (data.date?.toDate) {
              const date = data.date.toDate();
              const month = date.getMonth(); // 0 - January, 11 - December
              if (month >= 0 && month <= 11) {
                monthlySales[month] += total;
              }
            }
          }
        });

        setOverallTotal(totalOfAllSales);

        const formattedData = monthlySales.map((amount, index) => ({
          month: new Date(0, index).toLocaleString("default", { month: "short" }),
          totalAmount: parseFloat(amount.toFixed(2)),
        }));

        setSalesData(formattedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="chart-container">
      <h1 className="chart-header">Monthly Sales Comparison</h1>
      <h3 style={{ textAlign: "center", color: "#555" }}>
        Overall Total Amount: ₹{overallTotal.toFixed(2)}
      </h3>

      <ResponsiveContainer width="95%" height={400}>
        <LineChart
          data={salesData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalAmount"
            name="Monthly Sales (₹)"
            stroke="#4e54c8"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesComparisonChart;
