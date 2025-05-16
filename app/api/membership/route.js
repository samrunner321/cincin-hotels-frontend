import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'hotelName', 'email', 'website', 'agreeToTerms'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        }, 
        { status: 400 }
      );
    }
    
    // In a real application, you would:
    // 1. Store the data in a database
    // 2. Send notification emails
    // 3. Process the membership application
    
    // For now, we'll just log the data and return a success response
    console.log('Membership application received:', body);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Application submitted successfully' 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing membership application:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      }, 
      { status: 500 }
    );
  }
}