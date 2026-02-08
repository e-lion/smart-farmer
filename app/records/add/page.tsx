"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft, Save } from "lucide-react";

function AddRecordForm() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialType = searchParams.get("type") || "expense";

    const [type, setType] = useState(initialType);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const categories = type === "income" 
        ? ["Harvest Sales", "Livestock Sales", "Services", "Other"]
        : ["Seeds", "Fertilizer", "Labor", "Equipment", "Feed", "Other"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            await addDoc(collection(db, "records"), {
                userId: user.uid,
                type,
                amount: Number(amount),
                category,
                date,
                description,
                createdAt: new Date().toISOString()
            });
            router.push("/");
        } catch (error: any) {
            console.error("Error adding record:", error);
            alert(`Failed to save record: ${error.message || error.code || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
             <header className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Add Transaction</h1>
            </header>

            <main className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Type Selection */}
                    <div className="flex bg-gray-200 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setType("income")}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${type === "income" ? "bg-white text-green-600 shadow-sm" : "text-gray-500"}`}
                        >
                            Income
                        </button>
                        <button
                             type="button"
                             onClick={() => setType("expense")}
                             className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${type === "expense" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`}
                        >
                            Expense
                        </button>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full text-3xl font-bold p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            placeholder="0.00"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${category === cat ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none h-24 resize-none"
                            placeholder="Add notes..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !amount || !category}
                        className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-200 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Save Record
                    </button>
                </form>
            </main>
        </div>
    );
}

export default function AddRecord() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AddRecordForm />
        </Suspense>
    );
}
