// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { signal, effect } from "@preact/signals-react";
import { toggleSnackBar } from "./App";
import firebase from "firebase/compat/app";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
  getStorage,
} from "firebase/storage";
import { updateRoom, getToken } from "./utilities/utility";
import { v4 as uuidv4 } from "uuid";
import { get } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBS3GbtL_5EP0q_v7PoBU0vFPdTUN4B8IE",
  authDomain: "react-ui-f1bfb.firebaseapp.com",
  projectId: "react-ui-f1bfb",
  storageBucket: "react-ui-f1bfb.appspot.com",
  messagingSenderId: "15045364826",
  appId: "1:15045364826:web:50cb2b4d8eb2c0f46d5c63",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireBaseStorage = getStorage();
const db = getFirestore(app);

export const commentsSignal = signal({});
export const roomDRatinglSignal = signal(0);

export const addRoomTransaction = async (data) => {
  await setDoc(doc(db, "rooms", data.id), {
    ...data,
    comments: [],
  });
};

export const sendBroadcastMessage = async (data) => {
  await addDoc(collection(db, "broadcast"), {
    msg: data,
    tstamp: new Date().setMinutes(new Date().getMinutes() + 5),
  });
};

export const fetchBroadcastMessage = async () => {
  const unsubscribe = onSnapshot(
    query(collection(db, "broadcast")),
    (snapshot) => {
      snapshot.docChanges().filter((x) => {
        if (x.type === "added" && x.doc?.data()?.tstamp > Date.now()) {
          toggleSnackBar.value = {
            message: `${x.doc.data()?.msg}`,
            isOpen: true,
            timeOut: 50,
            // isInfo: true,
          };
          console.log("x.doc.data()", toggleSnackBar.value);
        }
      });
    }
  );
  return () => unsubscribe();
};

export const getRoomRating = async (id) => {
  return (await getDoc(query(doc(db, "rating", id)))).data();
};

export const addRoomRating = async (id, rating) => {
  const userName = getToken()?.userName;
  let ratingObj = {
    rating: rating,
    users: [{ userName: userName, rating }],
  };
  const ratings = await getRoomRating(id);
  if (ratings) {
    const unqUsers = [
      ...ratings.users.filter((x) => x.userName !== userName),
      { rating, userName },
    ];
    ratingObj = {
      rating:
        unqUsers
          .map((x) => x.rating)
          .reduce((partialSum, a) => partialSum + a, 0) / unqUsers.length,
      users: unqUsers,
    };
  }
  await setDoc(doc(db, "rating", id), ratingObj);
  roomDRatinglSignal.value = ratingObj.rating;
  await updateRoom({ id, rating: ratingObj.rating, actionType: "RATING" });
};

export const addComment = async (id, name, comment, toID) => {
  commentsSignal.value = {
    id,
    name,
    ...commentsSignal.value,
    comments: [
      ...(commentsSignal.value?.comments || []),
      {
        name: getToken().userName,
        isReply: toID ? true : false,
        text: comment,
        tstamp: Date.now(),
        id: uuidv4(),
        toID: toID || "",
        userIconColor: `#${Math.floor(Math.random() * 2 ** 24)
          .toString(16)
          .padStart(0, 6)}`,
      },
    ],
  };
  await setDoc(doc(db, "rooms", commentsSignal.value.id), {
    ...commentsSignal.value,
  });
};

export const fetchRoomDetails = async (id) => {
  commentsSignal.value = {};
  const unsubscribe = onSnapshot(
    query(collection(db, "rooms"), where("id", "==", id)),
    (snapshot) => {
      snapshot.docChanges().forEach((x) => {
        if (x.type === "modified") {
          toggleSnackBar.value = { message: "New comment added", isOpen: true };
          console.log("TEST", x);
        }
      });
      snapshot.forEach((doc) => {
        commentsSignal.value = { ...doc.data() };
      });
    }
  );

  return () => unsubscribe();
};

export const addRoomImage = async (imageUpload) => {
  const imageRef = storageRef(fireBaseStorage, `rooms/${Date.now()}`);

  const res = await uploadBytes(imageRef, imageUpload);
  const URL = await getDownloadURL(res.ref);
  return URL;
};

export const addUserImage = async (imageUpload) => {
  const imageRef = storageRef(fireBaseStorage, `users/${Date.now()}`);

  const res = await uploadBytes(imageRef, imageUpload);
  const URL = await getDownloadURL(res.ref);
  return URL;
};
