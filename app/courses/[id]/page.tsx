'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, Calendar, Clock, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchCourse(params.id as string);
    }
  }, [params.id]);

  const fetchCourse = async (courseId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}`);

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/sign-in';
          return;
        }
        if (response.status === 404) {
          setError('Course not found');
          return;
        }
        throw new Error('Failed to fetch course');
      }

      const data = await response.json();
      setCourse(data.course);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading course...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-destructive mb-4">
            {error || 'Course not found'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {error || 'The course you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
            <Link href="/courses">
              <Button>
                Browse All Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
      </div>

      {/* Course Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold mb-2">{course.title}</CardTitle>
              <CardDescription className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {formatDate(course.createdAt)}
                </span>
                {course.updatedAt !== course.createdAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Updated {formatDate(course.updatedAt)}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="secondary" className="text-sm">
                <BookOpen className="h-3 w-3 mr-1" />
                {calculateReadingTime(course.content)}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Course Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Course Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none">
            {course.content.includes('<') ? (
              // Render as HTML if it contains HTML tags
              <div
                dangerouslySetInnerHTML={{ __html: course.content }}
                className="course-content"
              />
            ) : (
              // Render as formatted text if plain text
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {course.content}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="mt-8 flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Link href="/courses">
            <Button variant="ghost">
              All Courses
            </Button>
          </Link>
        </div>

        <div className="text-sm text-muted-foreground">
          Course ID: {course.id}
        </div>
      </div>

      <style jsx>{`
        .course-content {
          line-height: 1.6;
        }

        .course-content h1,
        .course-content h2,
        .course-content h3,
        .course-content h4,
        .course-content h5,
        .course-content h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }

        .course-content p {
          margin-bottom: 1em;
        }

        .course-content ul,
        .course-content ol {
          margin-bottom: 1em;
          padding-left: 2em;
        }

        .course-content li {
          margin-bottom: 0.5em;
        }

        .course-content code {
          background-color: hsl(var(--muted));
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
        }

        .course-content pre {
          background-color: hsl(var(--muted));
          padding: 1em;
          border-radius: 6px;
          overflow-x: auto;
          margin-bottom: 1em;
        }

        .course-content blockquote {
          border-left: 4px solid hsl(var(--border));
          padding-left: 1em;
          margin-bottom: 1em;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}