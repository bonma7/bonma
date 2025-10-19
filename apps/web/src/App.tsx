import { useState } from "react";
import { trpc } from "./lib/trpc";
import "./App.css";

function App() {
	// 🎯 Fetch data from backend using tRPC
	const healthQuery = trpc.health.check.useQuery();
	const detailedHealthQuery = trpc.health.detailed.useQuery();

	// Example: Ping with custom message
	const [pingMessage] = useState("Hello from frontend!");
	const pingQuery = trpc.health.ping.useQuery({ message: pingMessage });

	return (
		<div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
			<h1>🏠 Bonma - Full Stack Test</h1>
			<p>Testing tRPC connection between Vite frontend and Fastify backend</p>

			{/* Backend Connection Status */}
			<div
				style={{
					padding: "1.5rem",
					border: "2px solid #646cff",
					borderRadius: "8px",
					marginTop: "2rem",
					background: "#1a1a1a",
				}}
			>
				<h2>🔌 Backend Connection</h2>

				{/* Basic Health Check */}
				<div style={{ marginTop: "1rem" }}>
					<h3>Health Check:</h3>
					{healthQuery.isLoading && <p>⏳ Checking server...</p>}
					{healthQuery.error && (
						<p style={{ color: "#ff6b6b" }}>
							❌ Error: {healthQuery.error.message}
							<br />
							<small>
								Make sure backend is running on http://localhost:3001
							</small>
						</p>
					)}
					{healthQuery.data && (
						<div style={{ color: "#51cf66" }}>
							<p>✅ Server Status: {healthQuery.data.status}</p>
							<p>
								🕐 Timestamp:{" "}
								{new Date(healthQuery.data.timestamp).toLocaleString()}
							</p>
						</div>
					)}
				</div>

				{/* Detailed Health */}
				<div style={{ marginTop: "1.5rem" }}>
					<h3>Detailed Health:</h3>
					{detailedHealthQuery.data && (
						<div style={{ color: "#51cf66" }}>
							<p>📊 Status: {detailedHealthQuery.data.status}</p>
							<p>⏱️ Uptime: {detailedHealthQuery.data.uptime.toFixed(2)}s</p>
						</div>
					)}
				</div>

				{/* Refresh Button */}
				<button
					type="button"
					onClick={() => {
						healthQuery.refetch();
						detailedHealthQuery.refetch();
						pingQuery.refetch();
					}}
					style={{
						marginTop: "1rem",
						padding: "0.5rem 1rem",
						background: "#646cff",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
					}}
				>
					🔄 Refresh All
				</button>
			</div>
		</div>
	);
}

export default App;
