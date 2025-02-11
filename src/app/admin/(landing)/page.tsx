"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Main() {
  return (
    <>
      <div>
        <h1>Next-Auth Login</h1>
        <h2>Sing Up</h2>
        <Link href="/signup">계정 만들기</Link>

        <h3>Have you already Signed Up?</h3>
        <button onClick={() => signIn()}>로그인하기</button>
      </div>
    </>
  );
}
