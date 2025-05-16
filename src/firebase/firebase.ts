// firebase.ts

// ----------------------
// 1. IMPORTS
// ----------------------
// Firebase Core & Firestore
import { initializeApp } from 'firebase/app';
import {
    // Core Firestore Types
    DocumentData,//typescript attribute const docData: DocumentData = ...
    Unsubscribe,//A function type to stop listening to realtime updates

    // Database References
    collection,//Gets a reference to a Firestore collection const messagesRef = collection(db, "messages");
    doc,//Gets a reference to a specific documen, used to Read/update a single record (like a user profile)
    getFirestore,//Initializes Firestore service so we can connect to db
    query,//Creates a configurable database query, used to Filter/sort documents before fetching

    // CRUD Operations
    addDoc,//Adds a new document with auto-generated ID, Creating new records (like sending a message)
    setDoc,//Creates/replaces a document at a specific path,await setDoc(doc(db, "users", "user1"), { name: "Alice" });
    updateDoc,//Updates specific fields in a document, used for Partial updates (like changing a username)

    // Query Utilities
    orderBy,//query(messagesRef, orderBy("timestamp", "desc"));
    where,//query(messagesRef, where("read", "==", false));

    // Special Functions
    increment,//await updateDoc(userRef, { unread: increment(1) });
    serverTimestamp,//Gets the server's exact time, Timestamps unaffected by device clock

    // Realtime Listeners
    onSnapshot//Listens for live data changes,Chat apps, realtime dashboards
} from 'firebase/firestore';

// Firebase Authentication
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';

// Firestore Timestamp Type
import { Timestamp } from "firebase/firestore";

// ----------------------
// 2. FIREBASE CONFIGURATION
// ----------------------
const firebaseConfig = {
    apiKey: "AIzaSyDlJAn1I6NRfQdfyUJ9vy9YE9__HSBI4wg",         // API key for Firebase services
    authDomain: "mag-student-side.firebaseapp.com",          // Domain for authentication
    projectId: "mag-student-side",                           // Firebase project ID
    storageBucket: "mag-student-side.firebasestorage.app",   // Cloud Storage bucket
    messagingSenderId: "246494652378",                       // Cloud Messaging sender ID
    appId: "1:246494652378:web:ed5b784c09d1701f5602e3",      // Firebase app ID
    measurementId: "G-H4E7SV3G7N"                            // Google Analytics ID
};

// ----------------------
// 3. FIREBASE INITIALIZATION
// ----------------------
const app = initializeApp(firebaseConfig);       // Initialize Firebase app
const db = getFirestore(app);                    // Get Firestore database instance
const auth = getAuth(app);                       // Get Authentication instance

// Set persistence to keep user logged in between sessions
setPersistence(auth, browserLocalPersistence);

// ----------------------
// 4. TYPE DEFINITIONS
// ----------------------
export type RoomType = "advisor-student" | "group" | /* future types */ string;



export interface RoomWithLastMsg {
    id: string;
    participants: string[];
    lastMessageAt: Timestamp;
    lastMessage: {
        content: string;
        status: string;
    };
    // Now using two separate counters for each slot
    unreadCountA: number;
    unreadCountB: number;
}

export type MessageStatus = "waiting" | "sent" | "received" | "read";
export type ContentType = "text" | "file"; // Future support: voice

export interface Message {
    /** Firestore document ID */
    id: string;
    /** UID of the sender */
    senderId: string;
    /** Text content or file caption */
    content: string;
    /** Message type (text/file) */
    contentType: ContentType;
    /** Storage URL for files */
    fileUrl?: string;
    /** Original filename */
    fileName?: string;
    /** Delivery status */
    status: MessageStatus;
    /** Creation timestamp */
    createdAt: Timestamp;
    /** Edit timestamp */
    editedAt?: Timestamp;
    /** ID of replied message */
    replyTo?: string;
    /** Original sender ID for replies */
    replyToSenderId?: string;
    /** Preview of replied message */
    replyToContentSnippet?: string;
};

// ----------------------
// 5. CORE EXPORTS
// ----------------------
export { db };

// ----------------------
// 6. UTILITY FUNCTIONS
// ----------------------
/**
 * Generates consistent room ID from two user IDs
 * @param user1 - First user ID
 * @param user2 - Second user ID
 * @returns Sorted concatenation of user IDs
 */
function getRoomId(user1: string, user2: string): string {
    const sortedIds = [user1, user2].sort();  // Ensure consistent order
    return sortedIds.join('-');               // Format: "user1-user2"
}

// ----------------------
// 7. MESSAGE OPERATIONS
// ----------------------
/**
 * Sends a text message and updates room metadata
 * @param senderId - ID of message sender
 * @param receiverId - ID of message recipient
 * @param content - Message text content
 * @returns Promise with message data
 */
export async function sendMessage(
    senderId: string,
    receiverId: string,
    content: string
): Promise<any> {
    // Compute roomId and sorted participants
    const roomId = getRoomId(senderId, receiverId);
    const participants = [senderId, receiverId].sort();
    const roomRef = doc(db, "rooms", roomId);

    // Map participants to slots A and B
    const [userA, userB] = participants;
    // Determine which slot to increment
    const receiverSlot = receiverId === userA ? "unreadCountA" : "unreadCountB";

    // Prepare room update payload
    const roomUpdate: Partial<RoomWithLastMsg> = {
        participants,
        lastMessageAt: serverTimestamp() as any,
        lastMessage: { content, status: "received" }
    };
    // Increment the appropriate unread counter
    (roomUpdate as any)[receiverSlot] = increment(1);

    // Merge update into room document
    await setDoc(roomRef, roomUpdate, { merge: true });

    // Create message sub-document
    const messagesCol = collection(db, "rooms", roomId, "messages");
    const messageData = {
        senderId,
        content,
        contentType: "text",
        status: "received",
        createdAt: serverTimestamp(),
    };
    await addDoc(messagesCol, messageData);

    return messageData;
}


/**
 * Updates message delivery status and room timestamp
 * @param messageId - ID of message to update
 * @param senderId - Original sender's ID
 * @param receiverId - Message recipient's ID
 * @param newStatus - New status to set
 */
export async function updateMessageStatus(
    messageId: string,
    senderId: string,
    receiverId: string,
    newStatus: MessageStatus
): Promise<void> {
    try {
        const roomId = getRoomId(senderId, receiverId);// get the respective room
        const messageRef = doc(db, `rooms/${roomId}/messages/${messageId}`);//new version of firestor allos / instead of ,
        //above, get the respective message by its message id and room id
        // Update message status and optional read timestamp
        await updateDoc(messageRef, {
            status: newStatus,//new status 
            ...(newStatus === 'read' && { readAt: serverTimestamp() })
        });

        // Update room's last activity time
        const roomRef = doc(db, "rooms", roomId);
        await updateDoc(roomRef, {
            lastMessageAt: serverTimestamp()
        });

    } catch (error) {
        console.error("Error updating message status:", error);
        throw new Error("Failed to update message status");
    }
}

// ----------------------
// 8. SUBSCRIPTION MANAGEMENT
// ----------------------
/**
 * Real-time listener for messages in a chat room
 * @param userA - First user ID
 * @param userB - Second user ID
 * @param onUpdate - Callback for message updates
 * @returns Unsubscribe function
 */
export function subscribeToMessages(// creates a real time message listener
    userA: string,
    userB: string,
    onUpdate: (messages: Message[]) => void// uses onUpdate whenever new messages arrive
): Unsubscribe { // returns unsubscribe button to stop listening
    const roomId = getRoomId(userA, userB);
    const messagesCol = collection(db, "rooms", roomId, "messages"); //get all messages
    const q = query(messagesCol, orderBy("createdAt", "asc"));  // Chronological order by date

    return onSnapshot(q, (snap) => { //onSnapshot function returns the Unsubscribe function
        const msgs: Message[] = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Message[];
        onUpdate(msgs);  // Pass updated messages array to callback
    });
}

/**
 * Real-time listener for user's chat rooms
 * @param userId - User ID to monitor rooms for
 * @param onUpdate - Callback for room updates
 * @returns Unsubscribe function
 */
/**
 * Subscribe to real-time updates for rooms involving the user
 */
export function subscribeToUserRooms(
    userId: string,
    onUpdate: (rooms: RoomWithLastMsg[]) => void
): Unsubscribe {
    const roomsQ = query(
        collection(db, "rooms"),
        where("participants", "array-contains", userId),
        orderBy("lastMessageAt", "desc")
    );

    return onSnapshot(roomsQ, (snap) => {
        const rooms: RoomWithLastMsg[] = snap.docs.map((doc) => {
            const data = doc.data() as DocumentData;
            const participants = data.participants as string[];
            const [userA, userB] = participants.sort();

            return {
                id: doc.id,
                participants,
                lastMessageAt: data.lastMessageAt as Timestamp,
                lastMessage: {
                    content: (data.lastMessage?.content as string) || "",
                    status: (data.lastMessage?.status as string) || "sent",
                },
                unreadCountA: (data.unreadCountA as number) || 0,
                unreadCountB: (data.unreadCountB as number) || 0,
            };
        });
        onUpdate(rooms);
    });
}


// ----------------------
// 9. UNREAD COUNT MANAGEMENT
// ----------------------
/**
 * Resets unread counter for a user in specific chat
 * @param userId - User ID to reset counter for
 * @param otherId - Other participant's ID
 */
export async function resetUnreadCount(
    userId: string,
    otherId: string
): Promise<void> {
    const roomId = getRoomId(userId, otherId);
    const roomRef = doc(db, "rooms", roomId);

    // Sort participants into slots A and B
    const [userA, userB] = [userId, otherId].sort();
    // Decide which field to reset
    const resetField = userId === userA ? "unreadCountA" : "unreadCountB";

    // Perform the zero-reset
    await updateDoc(roomRef, {
        [resetField]: 0,
    });
}
