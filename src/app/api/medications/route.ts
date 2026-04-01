import { NextResponse } from "next/server";

// Mock database
let medications = [
  { id: 1, name: "Aspirin", time: "08:00 AM", active: true },
  { id: 2, name: "Vitamin C", time: "09:00 AM", active: false }
];
let nextId = 3;

export async function GET() {
  return NextResponse.json(medications);
}

export async function POST(req: Request) {
  try {
    const { name, time } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    
    const newMed = {
      id: nextId++,
      name,
      time: time || "08:00 AM",
      active: true,
    };
    
    medications.push(newMed);
    return NextResponse.json(newMed, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    const medIndex = medications.findIndex((m) => m.id === id);
    
    if (medIndex === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    medications[medIndex].active = !medications[medIndex].active;
    return NextResponse.json(medications[medIndex]);
  } catch (error) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    medications = medications.filter((m) => m.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
