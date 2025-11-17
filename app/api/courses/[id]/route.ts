import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { course } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken } from '@/lib/middleware';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  // Authenticate the request
  const authError = await authenticateToken(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Find the course by ID
    const courseRecord = await db
      .select({
        id: course.id,
        title: course.title,
        content: course.content,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      })
      .from(course)
      .where(eq(course.id, id))
      .limit(1);

    if (courseRecord.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      course: courseRecord[0],
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  // Authenticate the request
  const authError = await authenticateToken(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Validate at least one field is provided
    if (!title && !content) {
      return NextResponse.json(
        { error: 'At least title or content must be provided' },
        { status: 400 }
      );
    }

    // Update the course
    const updatedCourse = await db
      .update(course)
      .set({
        ...(title && { title }),
        ...(content && { content }),
        updatedAt: new Date(),
      })
      .where(eq(course.id, id))
      .returning();

    if (updatedCourse.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Course updated successfully',
      course: updatedCourse[0],
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  // Authenticate the request
  const authError = await authenticateToken(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Delete the course
    const deletedCourse = await db
      .delete(course)
      .where(eq(course.id, id))
      .returning();

    if (deletedCourse.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Course deleted successfully',
      course: deletedCourse[0],
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}