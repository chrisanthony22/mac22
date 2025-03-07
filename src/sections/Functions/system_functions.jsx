import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const handleLoginSubmit = async (email, password, closePopup, onLoginSuccess) => {
    const url = "https://mac22.42web.io/login.php"; // Replace with working API URL
    const formData = JSON.stringify({ email, password });

    console.log("Sending data:", formData); // Debugging log

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                "Accept": "application/json" // Ensure JSON response
            },
            body: formData,
        });

        const textResponse = await response.text(); // Read raw response
        console.log("Raw Response:", textResponse);

        let result;
        try {
            result = JSON.parse(textResponse);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            toast.error("⚠️ Invalid server response. Contact support.");
            return;
        }

        console.log("Parsed JSON Response:", result);

        if (result.status === "success") {
            toast.success("🎉 Login successful!");
            onLoginSuccess();
        } else {
            toast.error("❌ Invalid credentials!");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        toast.error("⚠️ Network error, please try again.");
    }
};



// Save New Note
export const handleSaveNote = async (title, category, content, userId, closeForm, setTitle, setContent) => {
    if (!title || !category || !content) {
        toast.warn("⚠️ Please fill in all fields!", { autoClose: 2000 });
        return;
    }

    const noteData = { title, category, content };
    const url = "http://mac22.42web.io/saveNote.php";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(noteData),
        });
        const result = await response.json();

        if (response.ok && result.status === "success") {
            toast.success("✅ Note saved successfully!", { autoClose: 2000 });
            closeForm();
            setTitle("");
            setContent("");
        } else {
            toast.error("❌ Failed to save note!", { autoClose: 2000 });
        }
    } catch (error) {
        toast.error("⚠️ Error while saving note!", { autoClose: 2000 });
        console.error("Save Note Error:", error);
    }
};
