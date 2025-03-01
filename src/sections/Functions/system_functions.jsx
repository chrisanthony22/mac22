import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const handleLoginSubmit = async (email, password, closePopup, onLoginSuccess) => {
    const url = "http://localhost:8080/mac22_react/login.php"; 
    const formData = { email, password };

    // Show "Processing login..." toast and store its ID
    const processingToastId = toast.info("...Processing login...", {
        icon: <Oval color="#3498db" height={20} width={20} />,
        style: { 
            backgroundColor: "blue", 
            color: "#fff",
            fontSize: "14px", 
            fontFamily: "Arial, sans-serif",
            padding: "5px 10px", 
            minHeight: "50px", 
            lineHeight: "1", 
        }
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        toast.dismiss(processingToastId);  // Remove the processing toast

        // Read raw response first
        const textResponse = await response.text();
        console.log("Raw Response:", textResponse);

        // Try parsing JSON
        let result;
        try {
            result = JSON.parse(textResponse);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            toast.error("⚠️ Invalid server response. Contact support.", { autoClose: 2000 });
            return;
        }

        console.log("Parsed JSON Response:", result);

        if (result.status === "success" && result.username && result.fullname && result.id) {
            toast.success("🎉 Login successful!", { autoClose: 2000 });

            localStorage.setItem("userSession", JSON.stringify({
                username: result.username,
                fullname: result.fullname,
                id: result.id,
            }));

            setTimeout(() => {
                onLoginSuccess();
            }, 3000);
        } else {
            toast.error("❌ Invalid credentials!", { autoClose: 2000 });
        }
    } catch (error) {
        toast.dismiss(processingToastId);
        toast.error("⚠️ Error during login, Try Again.", { autoClose: 2000 });
        console.log("Fetch error:", error);
    }
};


// Save New Note
export const handleSaveNote = async (title, category, content, userId, closeForm, setTitle, setContent) => {
    if (!title || !category || !content) {
        toast.warn("⚠️ Please fill in all fields!", { autoClose: 2000 });
        return;
    }

    const noteData = { title, category, content };
    const url = "http://localhost:8080/mac22_react/saveNote.php";

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
