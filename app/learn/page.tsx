"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BottomNav from "@/components/BottomNav";
import { BookOpen, CheckCircle, ChevronRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { seedEducationData } from "@/lib/seed";

export default function Learn() {
  const { user } = useAuth();
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModules() {
      try {
        // Always try to seed (idempotent check inside seedEducationData)
        await seedEducationData();
        
        const q = query(collection(db, "modules"), orderBy("order"));
        const snapshot = await getDocs(q);
        setModules(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchModules();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-6 sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Education Hub</h1>
        <p className="text-gray-500 text-sm mt-1">Master your farm finances</p>
      </header>

      <div className="p-6 space-y-6">
        {loading ? (
           <div className="space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
           </div>
        ) : (
          modules.map((module, index) => (
            <Link href={`/learn/${module.id}`} key={module.id} className="block group">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all group-hover:shadow-md group-active:scale-99">
                <div className="flex justify-between items-start mb-3">
                   <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                     Module {index + 1}
                   </div>
                   {/* Placeholder for progress status */}
                   <PlayCircle className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{module.description}</p>
                
                <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                  Start Lesson <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
