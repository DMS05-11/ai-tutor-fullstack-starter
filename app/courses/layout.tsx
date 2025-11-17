import { Metadata } from 'next';
import CourseHeader from '@/components/course-header';

export const metadata: Metadata = {
  title: 'Courses - AI Tutor',
  description: 'Browse and explore our collection of courses',
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <CourseHeader />
      <main>{children}</main>
    </div>
  );
}