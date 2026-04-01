import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, mobileNumber, password, confirmPassword } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json({ success: false, error: 'Full name, email, and password are required' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: 'Passwords do not match' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ 
      $or: [{ email }, ...(mobileNumber ? [{ mobileNumber }] : [])] 
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User already exists with this email or mobile number.' }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const names = fullName.trim().split(/\s+/);

    const newUser = await User.create({
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      profile: {
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        location: '',
      }
    });

    // Create a plain object representation for the frontend context
    const userRepresentation = {
      id: newUser._id.toString(),
      fullName: newUser.fullName,
      email: newUser.email,
      mobileNumber: newUser.mobileNumber,
      profile: newUser.profile,
    };

    const token = signToken({ id: userRepresentation.id, email: userRepresentation.email });

    return NextResponse.json({
      success: true,
      token,
      user: userRepresentation
    }, { status: 201 });

  } catch (error: any) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
