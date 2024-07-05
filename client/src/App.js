import React, { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

const App = () => {
	const [message, setMessage] = useState("");
	const [decrypt, setDecrypt] = useState();

	const secretKey = "LefjQ2pEXmiy/nNZvEJ43i8hJuaAnzbA1Cbn1hOuAgA=";
	const derived_key = CryptoJS.enc.Base64.parse(secretKey);

	const iv = CryptoJS.enc.Utf8.parse("1020304050607080");
	const encryptionOptions = {
		iv: iv,
		mode: CryptoJS.mode.CBC,
	};
	const encrypted = CryptoJS.AES.encrypt(
		message,
		derived_key,
		encryptionOptions
	).toString();

    const decryptData = (encryptedMessage, derivedKey) => {
        const decrypted = CryptoJS.AES.decrypt(
            {
                ciphertext: CryptoJS.enc.Base64.parse(encryptedMessage),
            },
            derived_key,
            encryptionOptions
        );
    
        setDecrypt(decrypted.toString(CryptoJS.enc.Utf8));
    };

	const handleEncrypt = async () => {
		try {
			const response = await axios.post("http://localhost:8000/encrypted", {
				encrypted_data: encrypted,
			});
			console.log(response.data);
		} catch (error) {
			console.error("Error sending encrypted payload:", error);
		}
	};

    const handleDecrypt = async () => {
		try {
			const response = await axios.get("http://localhost:8000/decrypted");
			// setDecrypt(response.data);
            decryptData(response.data.encrypted_data)
		} catch (error) {
			console.error("Error sending encrypted payload:", error);
		}
	};

	return (
		<>
			<div style={styles.container}>
				<h1 style={styles.header}>encryption demo</h1>
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Enter message"
					style={styles.input}
				/>
				<button onClick={handleEncrypt} style={styles.button}>
					encrypt
				</button>
			</div>
			<div style={styles.container}>
				<h1 style={styles.header}>encryption demo</h1>
				<p>{decrypt}</p>
				<button onClick={handleDecrypt} style={styles.button}>
					Encrypt
				</button>
			</div>
		</>
	);
};

const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: "100vh",
		backgroundColor: "#f0f0f0",
		padding: "20px",
	},
	header: {
		marginBottom: "20px",
	},
	input: {
		marginBottom: "10px",
		padding: "10px",
		width: "300px",
		borderRadius: "5px",
		border: "1px solid #ccc",
	},
	button: {
		marginBottom: "10px",
		padding: "10px 20px",
		backgroundColor: "#007BFF",
		color: "#fff",
		border: "none",
		borderRadius: "5px",
		cursor: "pointer",
	},
};

export default App;
