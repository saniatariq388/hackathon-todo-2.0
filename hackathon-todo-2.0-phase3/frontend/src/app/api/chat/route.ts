// frontend\src\app\api\chat\route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // Authorization header frontend session se aata hai
    const authHeader = req.headers.get("authorization");
    console.log("🧠 Chat API received token:", authHeader);

    const res = await fetch("http://127.0.0.1:8010/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader ?? "",
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "AI Agent error", detail: text },
        { status: 500 }
      );
    }

    const data = await res.json();
    console.log("🤖 Agent response:", data);

    // 🔑 IMPORTANT: agent sends { response: "..." }
    return NextResponse.json({
      reply: data.response,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Chat API failed", detail: err.message },
      { status: 500 }
    );
  }
}
