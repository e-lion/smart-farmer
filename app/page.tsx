"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Plus, TrendingUp, TrendingDown, Sun, CloudRain } from "lucide-react";
import Link from "next/link";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [recentRecords, setRecentRecords] = useState<any[]>([]);
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    async function fetchData() {
       if (!user) return;
       // In a real app, we would listen to real-time updates.
       // For now, just fetch once.
       try {
           const q = query(
               collection(db, "records"),
               where("userId", "==", user.uid),
               orderBy("date", "desc"),
               limit(5)
           );
           const snapshot = await getDocs(q);
           const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
           setRecentRecords(records);

           // Calculate totals (simplified, ideally do this with aggregation query or cloud function)
           const allQ = query(collection(db, "records"), where("userId", "==", user.uid));
           const allSnapshot = await getDocs(allQ);
           let inc = 0;
           let exp = 0;
           allSnapshot.forEach(doc => {
               const data = doc.data();
               if (data.type === "income") inc += Number(data.amount);
               if (data.type === "expense") exp += Number(data.amount);
           });
           setTotalIncome(inc);
           setTotalExpense(exp);

       } catch (error) {
           console.error("Error fetching data:", error);
       }
    }

    fetchData();
  }, [user]);

  if (loading || !user) {
      return <div className="min-h-screen flex items-center justify-center text-green-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-green-600 text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="flex justify-between items-start mb-6">
            <div>
                <p className="text-green-100 text-sm font-medium">{greeting}</p>
                <h1 className="text-2xl font-bold mt-1 max-w-[200px] truncate">{user.email?.split('@')[0]}</h1>
            </div>
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                 {/* Placeholder weather icon */}
                 <Sun className="w-6 h-6 text-yellow-300" />
            </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <p className="text-sm text-green-100 mb-1">Net Balance</p>
            <h2 className="text-3xl font-bold">KES {(totalIncome - totalExpense).toLocaleString()}</h2>
            <div className="mt-4 flex gap-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-400/20 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-green-300" />
                    </div>
                    <div>
                        <p className="text-xs text-green-200">Income</p>
                        <p className="font-semibold text-sm">+{totalIncome.toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-400/20 rounded-lg">
                        <TrendingDown className="w-4 h-4 text-red-300" />
                    </div>
                     <div>
                        <p className="text-xs text-green-200">Expense</p>
                        <p className="font-semibold text-sm">-{totalExpense.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
            <Link href="/records/add?type=income" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
                <div className="bg-green-100 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="font-medium text-gray-700">Add Income</span>
            </Link>
             <Link href="/records/add?type=expense" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
                <div className="bg-red-100 p-3 rounded-full">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <span className="font-medium text-gray-700">Add Expense</span>
            </Link>
        </div>

        {/* Recent Transactions */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                <Link href="/records" className="text-sm text-green-600 font-medium">See All</Link>
            </div>
            
            <div className="space-y-3">
                {recentRecords.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                        No records yet.
                    </div>
                ) : (
                    recentRecords.map(record => (
                        <div key={record.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${record.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {record.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{record.category || 'General'}</p>
                                    <p className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={`font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {record.type === 'income' ? '+' : '-'} {Number(record.amount).toLocaleString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
