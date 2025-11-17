'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Plus } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses');

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/sign-in';
          return;
        }
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-destructive mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchCourses} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground mt-2">
            Browse and explore our collection of courses
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-4">No courses available</h2>
          <p className="text-muted-foreground mb-6">
            Check back later for new courses, or contact an administrator to add courses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl line-clamp-2">{course.title}</CardTitle>
                  <Badge variant="secondary" className="ml-2">
                    New
                  </Badge>
                </div>
                <CardDescription>
                  Last updated {formatDate(course.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {truncateContent(course.content)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <Link href={`/courses/${course.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Badge variant="outline">
                    {course.content.length > 0 ? `${Math.ceil(course.content.length / 1000)} min read` : 'Quick read'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Showing {courses.length} course{courses.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}