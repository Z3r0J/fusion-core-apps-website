import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		// Check localStorage and system preference
		const stored = localStorage.getItem("theme");
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const shouldBeDark = stored === "dark" || (!stored && prefersDark);

		setIsDark(shouldBeDark);
		updateTheme(shouldBeDark);
	}, []);

	const updateTheme = (dark: boolean) => {
		if (dark) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	const toggleTheme = () => {
		const newTheme = !isDark;
		setIsDark(newTheme);
		updateTheme(newTheme);
	};

	return (
		<button
			onClick={toggleTheme}
			className="theme-toggle hover:text-brand-600 dark:hover:text-brand-400 focus:ring-brand-500 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all duration-200 hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			title={isDark ? "Switch to light mode" : "Switch to dark mode"}
		>
			{isDark ? (
				<Sun className="h-5 w-5 transition-transform duration-200 hover:rotate-12" />
			) : (
				<Moon className="h-5 w-5 transition-transform duration-200 hover:-rotate-12" />
			)}
		</button>
	);
}
