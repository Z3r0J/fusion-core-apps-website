import PlaceholderApp from "@/assets/placeholder-app.svg?react";


interface CardImageProps {
	app: {
		title: string;
		icon?: string;
	};
}

export const CardImage = ({ app }: CardImageProps) => {
	return app.icon ? (
		<img
			alt={`${app.title} icon`}
			className="h-16 w-16 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
			height={64}
			loading="eager"
			src={app.icon}
			width={64}
		/>
	) : (
		<PlaceholderApp className="app-card_icon h-16 w-16 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900" />
	);
};
