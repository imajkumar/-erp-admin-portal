import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Make request to external API
    const response = await axios.post('http://165.22.212.8/auth/login', {
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });

    // Return the response from external API
    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error('API Error:', error);

    // Handle different types of errors
    if (error.response) {
      // External API returned an error
      return NextResponse.json(
        { message: error.response.data?.message || 'Login failed' },
        { status: error.response.status }
      );
    } else if (error.request) {
      // Network error - external API is unreachable
      return NextResponse.json(
        { message: 'External API is unreachable. Please try again later.' },
        { status: 503 }
      );
    } else {
      // Other error
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
