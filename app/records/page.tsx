"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BottomNav from "@/components/BottomNav";
import { TrendingUp, TrendingDown, Filter, Calendar } from "lucide-react";

export default function Records() {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    async function fetchRecords() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "records"),
          where("userId", "==", user.uid),
          orderBy("date", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, [user]);

  const filteredRecords = records.filter(record => {
      if (filterType === "all") return true;
      return record.type === filterType;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Records</h1>
      </header>

      <div className="p-4">
        {/* Filter Chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterType === "all" ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
            >
                All
            </button>
             <button
                onClick={() => setFilterType("income")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterType === "income" ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
            >
                Income
            </button>
             <button
                onClick={() => setFilterType("expense")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterType === "expense" ? "bg-red-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
            >
                Expense
            </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
             <div className="text-center py-10 text-gray-400">Loading records...</div>
          ) : filteredRecords.length === 0 ? (
             <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                 No records found.
             </div>
          ) : (
            filteredRecords.map(record => (
                <div key={record.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${record.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {record.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{record.category || 'General'}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {new Date(record.date).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                         <span className={`block font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {record.type === 'income' ? '+' : '-'} {Number(record.amount).toLocaleString()}
                        </span>
                        {record.description && <p className="text-xs text-gray-400 max-w-[100px] truncate">{record.description}</p>}
                    </div>
                </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
