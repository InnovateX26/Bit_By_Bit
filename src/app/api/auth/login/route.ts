import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emailOrMobile, password } = body;

    if (!emailOrMobile || !password) {
      return NextResponse.json({ success: false, error: 'Email/Mobile and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({
      $or: [{ email: emailOrMobile.toLowerCase() }, { mobileNumber: emailOrMobile }]
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json({ success: false, error: 'Please sign in with Google' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const userRepresentation = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      profile: user.profile,
    };

    const token = signToken({ id: userRepresentation.id, email: userRepresentation.email });

    return NextResponse.json({
      success: true,
      token,
      user: userRepresentation
    }, { status: 200 });

  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
