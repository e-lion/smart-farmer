"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, CheckCircle, BookOpen, Clock, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function ModuleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchModule() {
      try {
        const docRef = doc(db, "modules", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setModule(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching module:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchModule();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading lesson...</p>
      </div>
    </div>
  );
  
  if (!module) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Lesson Not Found</h2>
        <p className="text-gray-500 mt-2">The content you are looking for does not exist.</p>
        <button onClick={() => router.back()} className="mt-4 text-green-600 font-medium hover:underline">
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
       {/* Header */}
       <header className="sticky top-0 bg-white/95 backdrop-blur-sm p-4 border-b border-gray-100 flex items-center gap-4 z-20 shadow-sm">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 truncate pr-4">{module.title}</h1>
          </div>
      </header>

      {/* Hero Section */}
      <div className="bg-green-600 text-white px-6 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
          <BookOpen className="w-64 h-64" />
        </div>
        <div className="relative z-10">
           <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium mb-3">
             <BookOpen className="w-3 h-3" />
             <span>Financial Literacy</span>
           </div>
           <h2 className="text-2xl font-bold leading-tight mb-2">{module.title}</h2>
           <div className="flex items-center gap-4 text-green-100 text-sm">
             <div className="flex items-center gap-1">
               <Clock className="w-4 h-4" />
               <span>5 min read</span>
             </div>
             <div className="flex items-center gap-1">
               <Award className="w-4 h-4" />
               <span>10 Points</span>
             </div>
           </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <article className="prose prose-green prose-lg max-w-none 
          prose-headings:font-bold prose-headings:text-gray-900 
          prose-p:text-gray-600 prose-p:leading-relaxed
          prose-strong:text-gray-900 prose-strong:font-bold
          prose-ul:list-disc prose-ul:pl-5 
          prose-li:text-gray-600 prose-li:marker:text-green-500">
           <ReactMarkdown>{module.content}</ReactMarkdown>
        </article>

        {/* Completion Section */}
        <div className="mt-12">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 text-center shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Lesson Complete!</h3>
                <p className="text-gray-500 text-sm mb-6">Great job mastering this topic.</p>
                
                <button 
                    onClick={() => router.push('/learn')}
                    className="w-full bg-green-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <span>Mark as Done</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
            </div>
        </div>
      </main>
    </div>
  );
}
