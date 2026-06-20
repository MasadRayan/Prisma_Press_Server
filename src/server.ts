import dotenv from "dotenv";
import app from "./app";
dotenv.config();
const PORT = process.env.PORT || 3000;

async function main() {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

main();