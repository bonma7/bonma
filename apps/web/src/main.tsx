import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { loadConfig } from "./lib/config";
import { trpc } from "./lib/trpc";
import "./index.css";

function AppWrapper() {
	const [isConfigLoaded, setIsConfigLoaded] = useState(false);
	const [apiUrl, setApiUrl] = useState<string>("");

	// Load runtime configuration
	useEffect(() => {
		loadConfig()
			.then((config) => {
				setApiUrl(config.apiUrl);
				setIsConfigLoaded(true);
			})
			.catch((error) => {
				console.error("Failed to load config:", error);
				// Fallback to localhost
				setApiUrl("http://localhost:3001");
				setIsConfigLoaded(true);
			});
	}, []);

	// Create React Query client
	const [queryClient] = useState(() => new QueryClient());

	// Create tRPC client once config is loaded
	const [trpcClient, setTrpcClient] = useState<ReturnType<
		typeof trpc.createClient
	> | null>(null);

	useEffect(() => {
		if (isConfigLoaded && apiUrl) {
			setTrpcClient(
				trpc.createClient({
					links: [
						httpBatchLink({
							url: `${apiUrl}/trpc`,
						}),
					],
				}),
			);
		}
	}, [isConfigLoaded, apiUrl]);

	// Show loading state while config is being loaded
	if (!isConfigLoaded || !trpcClient) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
					fontFamily: "system-ui, sans-serif",
				}}
			>
				Loading configuration...
			</div>
		);
	}

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</trpc.Provider>
	);
}

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}

createRoot(rootElement).render(
	<StrictMode>
		<AppWrapper />
	</StrictMode>,
);
