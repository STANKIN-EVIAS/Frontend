import Footer from "components/Footer"; // Импортируйте ваш футтер
import Header from "components/Header";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes";

import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />

                <main className="flex-grow pb-8">
                    <AppRoutes />
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    );
}
