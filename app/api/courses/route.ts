import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { course } from '@/db/schema';
import { authenticateToken } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  // Authenticate the request
  const authError = await authenticateToken(request);
  if (authError) return authError;

  try {
    // Fetch all courses
    const courses = await db
      .select({
        id: course.id,
        title: course.title,
        content: course.content,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      })
      .from(course)
      .orderBy(course.createdAt);

    return NextResponse.json({
      courses,
      total: courses.length,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Authenticate the request
  const authError = await authenticateToken(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Create new course
    const newCourse = await db.insert(course).values({
      id: crypto.randomUUID(),
      title,
      content,
    }).returning();

    return NextResponse.json({
      message: 'Course created successfully',
      course: newCourse[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}