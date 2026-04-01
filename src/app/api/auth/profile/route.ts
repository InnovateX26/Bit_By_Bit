import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

const getUserIdFromAuthHeader = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  return decoded ? (decoded as any).id : null;
};

export async function GET(req: Request) {
  try {
    const userId = getUserIdFromAuthHeader(req);
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const user = await User.findById(userId).select('-password');
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const userRepresentation = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      profile: user.profile,
    };

    return NextResponse.json({ success: true, user: userRepresentation }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error occurred' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = getUserIdFromAuthHeader(req);
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    await connectToDatabase();
    
    const updateData: any = {};
    if (body.fullName) updateData.fullName = body.fullName;
    if (body.email) updateData.email = body.email.toLowerCase();
    if (body.mobileNumber) updateData.mobileNumber = body.mobileNumber;
    
    if (body.profile) {
      if (typeof body.profile.firstName !== 'undefined') updateData['profile.firstName'] = body.profile.firstName;
      if (typeof body.profile.lastName !== 'undefined') updateData['profile.lastName'] = body.profile.lastName;
      if (typeof body.profile.location !== 'undefined') updateData['profile.location'] = body.profile.location;
      if (typeof body.profile.avatar !== 'undefined') updateData['profile.avatar'] = body.profile.avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select('-password');

    if (!updatedUser) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const userRepresentation = {
      id: updatedUser._id.toString(),
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      mobileNumber: updatedUser.mobileNumber,
      profile: updatedUser.profile,
    };
    
    return NextResponse.json({ success: true, user: userRepresentation }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error occurred' }, { status: 500 });
  }
}
