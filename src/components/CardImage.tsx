import PlaceholderApp from "@/assets/placeholder-app.svg?react";

interface CardImageProps {
	app: {
		title: string;
		icon?: string;
	};
	className?: string;
}

export const CardImage = ({ app, className }: CardImageProps) => {
	const sizeClass = className || "h-16 w-16";
	return app.icon ? (
		<img
			alt={`${app.title} icon`}
			className={`${sizeClass} rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900`}
			loading="eager"
			src={app.icon}
		/>
	) : (
		<PlaceholderApp className={`app-card_icon ${sizeClass} rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900`} />
	);
};
