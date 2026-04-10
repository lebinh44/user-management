import AppRoutes from "./routes";
import ThemeToggle from "./components/ui/theme-toggle";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="flex justify-end px-6 py-3 border-b border-gray-200 dark:border-gray-800">
        <ThemeToggle />
      </header>
      <AppRoutes />
    </div>
  );
}

export default App;
