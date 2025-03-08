import { toast } from 'react-toastify';
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";

// 🔹 Handle User Login
export const handleLoginSubmit = async (email, password, setIsLoggedIn, navigate) => {
    toast.info("processing login... please wait!", {
        autoClose: 500,
        style: { backgroundColor: "#0D1117", color: "blue", height: "50px" }
      });
    try {
        const usersRef = collection(db, "useraccounts");
        const q = query(usersRef, where("email", "==", email), where("password", "==", password)); 
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const user = querySnapshot.docs[0].data();
            const userSession = { 
                id: querySnapshot.docs[0].id, 
                email: user.email, 
                username: user.username // ✅ Ensure we store the username
            };
            console.log("userID: ",querySnapshot.docs[0].id)
            console.log("User logged in:", userSession);
            localStorage.setItem("userSession", JSON.stringify(userSession));

            toast.success("🎉 Login successful!", {
                autoClose: 2000,
                style: { backgroundColor: "#0D1117", color: "#238636", height: "50px" }
              });
              

            setIsLoggedIn(true);  // ✅ Update state
            navigate("/note");     // ✅ Redirect immediately
        } else {
            toast.error("Invalid email or password!", {
                autoClose: 1000,
                style: { backgroundColor: "#0D1117", color: "red", height: "50px" }
              });
        }
    } catch (error) {
        console.error("Login error:", error);
        toast.error("⚠️ Error logging in. Please try again!", { autoClose: 2000 });
    }
};

// 🔹 Handle Logout
export const handleLogout = () => {
    localStorage.removeItem("userSession"); // Remove user session
    toast.info("🔒 Logged out successfully!", { autoClose: 2000 });
    window.location.href = "/"; // Redirect to login page
};

// 🔹 Save New Note
export const handleSaveNote = async (title, category, content, userId, closeForm, setTitle, setContent) => {
    if (!title || !category || !content) {
        toast.warn("⚠️ Please fill in all fields!", { autoClose: 2000 });
        return;
    }

    try {
        const noteData = {
            title,
            category,
            content,
            userId,
            dateSaved: Timestamp.now() // Firestore timestamp
        };

        const notesRef = collection(db, "notes");
        await addDoc(notesRef, noteData);

        toast.success("✅ Note saved successfully!", { autoClose: 2000 });
        closeForm();
        setTitle("");
        setContent("");
    } catch (error) {
        toast.error("⚠️ Error while saving note!", { autoClose: 2000 });
        console.error("Save Note Error:", error);
    }
};

// 🔹 Fetch User Notes from Firestore
export const fetchUserNotes = async (userId, setBlogs, setSelectedBlog) => {
    try {
        const notesRef = collection(db, "notes");
        const q = query(notesRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const userNotes = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        setBlogs(userNotes);
        if (userNotes.length > 0) setSelectedBlog(userNotes[0]); // Select first note by default
    } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("⚠️ Error fetching notes!");
    }
};
