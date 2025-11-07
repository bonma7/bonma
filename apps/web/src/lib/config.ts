/**
 * Runtime configuration loader
 * Fetches config from /config.json which can be updated without rebuilding
 */

interface AppConfig {
	apiUrl: string;
}

let configCache: AppConfig | null = null;

export async function loadConfig(): Promise<AppConfig> {
	if (configCache) {
		return configCache;
	}

	try {
		const response = await fetch("/config.json");
		if (!response.ok) {
			throw new Error(`Failed to load config: ${response.statusText}`);
		}
		configCache = await response.json();
		return configCache;
	} catch (error) {
		console.error("Failed to load config, using defaults:", error);
		// Fallback to localhost for development
		configCache = {
			apiUrl: "http://localhost:3001",
		};
		return configCache;
	}
}

export function getConfig(): AppConfig {
	if (!configCache) {
		throw new Error(
			"Config not loaded. Call loadConfig() before using getConfig()",
		);
	}
	return configCache;
}
