import { NextResponse } from "next/server";
import decript from "./decript";
import encrypt from "./encrypt";

async function updateLocalSessionCookie(request) {
  const resp = NextResponse.next();
  const check = request.cookies.get("localSession")?.value;
  if (!check) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const payload = await decript(check);
    resp.cookies.set({
      name: "localSession",
      value: await encrypt(payload),
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(payload.exp * 1000),
    });
    return resp;
  } catch (error) {
    const resp = NextResponse.redirect(new URL("/", request.url));
    resp.cookies.set({
        name: "localSession",
        value: "",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: new Date(Date.now() - 1000),
      });
      return resp
  }
}

export default updateLocalSessionCookie;
