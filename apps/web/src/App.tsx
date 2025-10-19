import { useState } from "react";
import { trpc } from "./lib/trpc";
import "./App.css";

function App() {
	// 💾 Database settings (CRUD operations)
	const settingsQuery = trpc.settings.list.useQuery();
	const setSetting = trpc.settings.set.useMutation({
		onSuccess: () => settingsQuery.refetch(),
	});
	const deleteSetting = trpc.settings.delete.useMutation({
		onSuccess: () => settingsQuery.refetch(),
	});

	// Local state for new setting form
	const [newKey, setNewKey] = useState("");
	const [newValue, setNewValue] = useState("");

	return (
		<div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
			<h1>🏠 Bonma - Full Stack Database Demo</h1>
			<p>Testing database connection: Backend → Prisma → SQLite</p>

			{/* Database Settings */}
			<div
				style={{
					padding: "1.5rem",
					border: "2px solid #51cf66",
					borderRadius: "8px",
					marginTop: "2rem",
				}}
			>
				<h2>💾 Database Settings (SQLite)</h2>

				{/* Loading State */}
				{settingsQuery.isLoading && <p>⏳ Loading settings from database...</p>}

				{/* Error State */}
				{settingsQuery.error && (
					<p style={{ color: "#ff6b6b" }}>
						❌ Error: {settingsQuery.error.message}
					</p>
				)}

				{/* Settings List */}
				{settingsQuery.data && (
					<>
						{settingsQuery.data.length === 0 ? (
							<div>
								<p style={{ color: "#ffa94d" }}>
									📭 No settings in database yet!
								</p>
							</div>
						) : (
							<>
								<p style={{ color: "#51cf66" }}>
									✅ Found {settingsQuery.data.length} setting(s) in database
								</p>

								{/* Settings Table */}
								<table
									style={{
										width: "100%",
										marginTop: "1rem",
										borderCollapse: "collapse",
									}}
								>
									<thead>
										<tr style={{ borderBottom: "1px solid #646cff" }}>
											<th style={{ textAlign: "left", padding: "0.5rem" }}>
												Key
											</th>
											<th style={{ textAlign: "left", padding: "0.5rem" }}>
												Value
											</th>
											<th style={{ textAlign: "left", padding: "0.5rem" }}>
												Updated
											</th>
											<th style={{ textAlign: "center", padding: "0.5rem" }}>
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{settingsQuery.data.map((setting) => (
											<tr
												key={setting.id}
												style={{ borderBottom: "1px solid #2a2a2a" }}
											>
												<td style={{ padding: "0.5rem", fontWeight: "bold" }}>
													{setting.key}
												</td>
												<td style={{ padding: "0.5rem", color: "#51cf66" }}>
													{setting.value}
												</td>
												<td style={{ padding: "0.5rem", fontSize: "0.85rem" }}>
													{new Date(setting.updatedAt).toLocaleString()}
												</td>
												<td style={{ padding: "0.5rem", textAlign: "center" }}>
													<button
														type="button"
														onClick={() =>
															deleteSetting.mutate({ key: setting.key })
														}
														disabled={deleteSetting.isPending}
														style={{
															padding: "0.25rem 0.5rem",
															background: "#ff6b6b",
															color: "white",
															border: "none",
															borderRadius: "4px",
															cursor: "pointer",
															fontSize: "0.85rem",
														}}
													>
														🗑️ Delete
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>

								{/* Refresh Button */}
								<button
									type="button"
									onClick={() => settingsQuery.refetch()}
									style={{
										padding: "0.5rem 1rem",
										background: "#646cff",
										color: "white",
										border: "none",
										borderRadius: "4px",
										cursor: "pointer",
										marginTop: "1rem",
									}}
								>
									🔄 Refresh from Database
								</button>
							</>
						)}
					</>
				)}

				{/* Add New Setting Form */}
				<div
					style={{
						marginTop: "1.5rem",
						padding: "1rem",
						borderRadius: "4px",
					}}
				>
					<h3>➕ Add New Setting</h3>
					<div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
						<input
							type="text"
							placeholder="Key (e.g., theme)"
							value={newKey}
							onChange={(e) => setNewKey(e.target.value)}
							style={{
								padding: "0.5rem",
								flex: 1,
								borderRadius: "4px",
								border: "1px solid #646cff",
								color: "black",
							}}
						/>
						<input
							type="text"
							placeholder="Value (e.g., dark)"
							value={newValue}
							onChange={(e) => setNewValue(e.target.value)}
							style={{
								padding: "0.5rem",
								flex: 1,
								borderRadius: "4px",
								border: "1px solid #646cff",
								color: "black",
							}}
						/>
						<button
							type="button"
							onClick={() => {
								if (newKey && newValue) {
									setSetting.mutate(
										{ key: newKey, value: newValue },
										{
											onSuccess: () => {
												setNewKey("");
												setNewValue("");
											},
										},
									);
								}
							}}
							disabled={!newKey || !newValue || setSetting.isPending}
							style={{
								padding: "0.5rem 1rem",
								background: "#51cf66",
								color: "black",
								border: "none",
								borderRadius: "4px",
								cursor: newKey && newValue ? "pointer" : "not-allowed",
								opacity: newKey && newValue ? 1 : 0.5,
							}}
						>
							{setSetting.isPending ? "Saving..." : "💾 Save"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
