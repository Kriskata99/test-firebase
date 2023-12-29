import React, { FC, useState } from "react";
import { auth, googleProvider } from "../.config/firebase.ts";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const Auth: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log(auth?.currentUser?.email);
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      console.log(auth?.currentUser?.email);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <input
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        placeholder="Password..."
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button onClick={signIn}>Sign In</button>

      <button onClick={signInWithGoogle}>Sign In with Google</button>

      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default Auth;
