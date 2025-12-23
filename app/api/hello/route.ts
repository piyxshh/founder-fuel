import { type NextRequest } from "next/server";

export async function GET(request: Request) {


return Response.json({ message: "Hello World"});
}