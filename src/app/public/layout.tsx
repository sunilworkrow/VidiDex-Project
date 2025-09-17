import Sidebar from "@/app/public/Sidebar"
import Header from "@/app/public/Header"
import { PublicSearchProvider } from "@/app/public/searchContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <PublicSearchProvider>
          <Header />
          <main className="">
            {children}
          </main>
        </PublicSearchProvider>
      </div>
    </div>
  )
}
