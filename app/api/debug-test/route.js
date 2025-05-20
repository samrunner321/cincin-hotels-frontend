/**
 * Simple debug test route
 */
import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({ success: true, message: "Debug test route works!" });
}