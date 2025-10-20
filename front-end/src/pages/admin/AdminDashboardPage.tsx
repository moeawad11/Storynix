import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import StatCard from "../../components/admin/StatCard.js";
import { DashboardStats } from "../../types/index.js";

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching admin stats", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats)
    return (
      <div className="text-center py-10 text-gray-600">Loading stats...</div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Sales"
        value={`$${Number(stats.totalSales).toFixed(2)}`}
      />
      <StatCard title="Total Orders" value={stats.totalOrders} />
      <StatCard title="Total Users" value={stats.totalUsers} />
      <StatCard title="Total Books" value={stats.totalBooks} />
    </div>
  );
};

export default AdminDashboardPage;
